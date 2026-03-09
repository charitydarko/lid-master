/**
 * Translates all German questions/options in questions.json to English.
 * Uses claude-haiku-4-5 in batches of 20 questions for speed + cost efficiency.
 */
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../src/data/questions.json');

const client = new Anthropic({ apiKey: process.env.CLAUDE_CODE_OAUTH_TOKEN });
const BATCH_SIZE = 20;

// Returns true if question needs translation (question_en or options_en are placeholders)
function needsTranslation(q) {
  const qen = q.question_en || '';
  const hasPendingQ = qen.includes('pending') || qen === '';
  const hasPendingOpts = (q.options_en || []).some(o => o.startsWith('Option ') || o === '');
  return hasPendingQ || hasPendingOpts;
}

async function translateBatch(questions) {
  const payload = questions.map((q, i) => ({
    i,
    q: q.question,
    opts: q.options,
  }));

  const prompt = `Translate the following German citizenship test questions and their answer options to English.
Return ONLY a JSON array (no markdown, no explanation) with objects having keys: i, q_en, opts_en.
Keep proper nouns (city names, state names, organization names) as-is.
For image options like "Bild 1", "Bild 2" etc, translate to "Image 1", "Image 2" etc.

Questions to translate:
${JSON.stringify(payload, null, 2)}`;

  const msg = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text.trim();
  // Strip markdown code fences if present
  const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(json);
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

  // Collect all questions needing translation with their location
  const toTranslate = [];

  for (let i = 0; i < data.general.length; i++) {
    if (needsTranslation(data.general[i])) {
      toTranslate.push({ section: 'general', idx: i, q: data.general[i] });
    }
  }
  for (const [state, qs] of Object.entries(data.states)) {
    for (let i = 0; i < qs.length; i++) {
      if (needsTranslation(qs[i])) {
        toTranslate.push({ section: 'state', state, idx: i, q: qs[i] });
      }
    }
  }

  console.log(`Found ${toTranslate.length} questions needing translation.`);
  console.log(`Processing in batches of ${BATCH_SIZE}...`);

  let done = 0;
  let errors = 0;

  for (let b = 0; b < toTranslate.length; b += BATCH_SIZE) {
    const batch = toTranslate.slice(b, b + BATCH_SIZE);
    const batchNum = Math.floor(b / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toTranslate.length / BATCH_SIZE);
    process.stdout.write(`Batch ${batchNum}/${totalBatches} (${batch.length} questions)... `);

    try {
      const results = await translateBatch(batch.map(item => item.q));

      for (const r of results) {
        const item = batch[r.i];
        if (!item) continue;

        if (item.section === 'general') {
          data.general[item.idx].question_en = r.q_en;
          data.general[item.idx].options_en = r.opts_en;
        } else {
          data.states[item.state][item.idx].question_en = r.q_en;
          data.states[item.state][item.idx].options_en = r.opts_en;
        }
      }

      done += batch.length;
      console.log(`✓ (${done}/${toTranslate.length} total)`);

      // Save after every batch so we don't lose progress
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      errors++;
      console.log(`✗ Error: ${e.message}`);
      // Small pause before retrying
      await new Promise(r => setTimeout(r, 2000));
    }

    // Small delay between batches to avoid rate limits
    if (b + BATCH_SIZE < toTranslate.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }

  console.log(`\nDone! ${done} translated, ${errors} batch errors.`);

  // Verify
  let remaining = 0;
  const all = [...data.general, ...Object.values(data.states).flat()];
  for (const q of all) {
    if (needsTranslation(q)) remaining++;
  }
  console.log(`Questions still needing translation: ${remaining}`);
}

main().catch(console.error);
