"use client";

import { Fragment } from "react";
import { GERMAN_TERMS, TERM_MAP } from "@/data/german-terms";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SmartTextProps {
  text: string;
  className?: string;
}

export function SmartText({ text, className }: SmartTextProps) {
  const parts = tokenize(text);

  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.type === "term" ? (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              <span className="underline decoration-primary/50 decoration-dotted cursor-help text-primary/90 font-medium hover:text-primary transition-colors">
                {part.text}
              </span>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="max-w-64 p-3 bg-background/95 border-primary/20 backdrop-blur-xl"
            >
              <p className="font-semibold text-xs text-primary mb-1">{part.term}</p>
              <p className="text-xs text-foreground/90">{part.definition}</p>
              <p className="text-[10px] text-muted-foreground mt-1 italic">
                {part.definition_en}
              </p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <Fragment key={i}>{part.text}</Fragment>
        )
      )}
    </span>
  );
}

type Part =
  | { type: "text"; text: string }
  | { type: "term"; text: string; term: string; definition: string; definition_en: string };

function tokenize(text: string): Part[] {
  if (!text) return [];

  // Build regex from known terms sorted by length (longest first to avoid partial matches)
  const terms = GERMAN_TERMS.map((t) => t.term).sort(
    (a, b) => b.length - a.length
  );
  const pattern = new RegExp(
    `\\b(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
    "gi"
  );

  const parts: Part[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: text.slice(lastIndex, match.index) });
    }
    const termData = TERM_MAP[match[0].toLowerCase()];
    if (termData) {
      parts.push({
        type: "term",
        text: match[0],
        term: termData.term,
        definition: termData.definition,
        definition_en: termData.definition_en,
      });
    } else {
      parts.push({ type: "text", text: match[0] });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", text: text.slice(lastIndex) });
  }

  return parts;
}
