/**
 * Uses Claude API to verify and fix correctAnswer values for all 16 state question sets.
 */
import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '../src/data/questions.json');

const client = new Anthropic({ apiKey: process.env.CLAUDE_CODE_OAUTH_TOKEN });

async function verifyStateQuestions(state, questions) {
  // Build a compact representation of all questions + options for this state
  const payload = questions.map((q, i) => ({
    i,
    question: q.question,
    options: q.options,
    currentAnswer: q.correctAnswer,
    currentAnswerText: q.options[q.correctAnswer],
  }));

  const prompt = `You are a German civics expert. For the German state "${state}", verify and correct the "correctAnswer" index (0-3) for each question below.

These are from the official German citizenship test (Leben in Deutschland / Einbürgerungstest).

Rules you must know:
- Q about "Landeszentrale für politische Bildung": always that option
- Q about which minister the state does NOT have: always "Außenministerin/Außenminister" (foreign affairs is federal, not state)
- Q about state parliament term: most states = 5 years; Bremen = 4 years
- Q about head of government title: regular states = "Ministerpräsidentin/Ministerpräsident"; Berlin = "Regierende Bürgermeisterin/Regierender Bürgermeister"; Hamburg = "Erste Bürgermeisterin/Erster Bürgermeister"; Bremen = "Präsidentin/Präsident des Senats" or "Bürgermeisterin/Bürgermeister"
- Q about state capital: use the actual Landeshauptstadt
- Q about which district/Landkreis/Bezirk belongs to the state: pick the one actually in that state
- Q about flag colors: use the actual Landesfarben/Landesflagge colors
- Q about voting age for local elections: Bayern=18, most others=16

For each question, return the correct 0-based index.

Return ONLY valid JSON array (no markdown), format:
[{"i": 0, "correctAnswer": 2, "reason": "brief explanation"}, ...]

Questions for ${state}:
${JSON.stringify(payload, null, 2)}`;

  const msg = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const raw = msg.content[0].text.trim();
  const json = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  return JSON.parse(json);
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  let totalFixed = 0;

  for (const [state, questions] of Object.entries(data.states)) {
    process.stdout.write(`\nVerifying ${state}... `);

    try {
      const corrections = await verifyStateQuestions(state, questions);
      let stateFixed = 0;

      for (const c of corrections) {
        const q = questions[c.i];
        if (q.correctAnswer !== c.correctAnswer) {
          console.log(`\n  Q${c.i + 1}: "${q.question}"`);
          console.log(`    OLD answer [${q.correctAnswer}]: "${q.options[q.correctAnswer]}"`);
          console.log(`    NEW answer [${c.correctAnswer}]: "${q.options[c.correctAnswer]}"`);
          console.log(`    Reason: ${c.reason}`);
          q.correctAnswer = c.correctAnswer;
          stateFixed++;
          totalFixed++;
        }
      }

      if (stateFixed === 0) {
        process.stdout.write(`✓ all correct\n`);
      } else {
        console.log(`  → Fixed ${stateFixed} questions`);
      }

      // Save after each state
      fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      console.log(`✗ Error: ${e.message}`);
    }

    // Small delay between states
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n\nTotal corrections made: ${totalFixed}`);
}

main().catch(console.error);
