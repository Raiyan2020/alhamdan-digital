"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const DEFAULT_WORD_DELAY_MS = 120;

type WordRevealTextProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  startDelayMs?: number;
  wordDelayMs?: number;
};

export function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function richTextToPlainText(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getWordRevealDuration(
  text: string,
  { startDelayMs = 0, wordDelayMs = DEFAULT_WORD_DELAY_MS } = {},
) {
  const wordCount = splitWords(text).length;
  if (wordCount === 0) return startDelayMs;
  return startDelayMs + wordDelayMs * (wordCount - 1) + 350;
}

export function WordRevealText({
  text,
  as: Component = "div",
  className,
  startDelayMs = 0,
  wordDelayMs = DEFAULT_WORD_DELAY_MS,
}: WordRevealTextProps) {
  const reducedMotion = useReducedMotion();
  const words = useMemo(() => splitWords(text), [text]);
  const sequenceKey = `${reducedMotion ? "reduced" : "motion"}-${text}`;

  return (
    <WordRevealSequence
      key={sequenceKey}
      words={words}
      as={Component}
      className={className}
      reducedMotion={Boolean(reducedMotion)}
      startDelayMs={startDelayMs}
      wordDelayMs={wordDelayMs}
    />
  );
}

function WordRevealSequence({
  words,
  as: Component,
  className,
  reducedMotion,
  startDelayMs,
  wordDelayMs,
}: {
  words: string[];
  as: NonNullable<WordRevealTextProps["as"]>;
  className?: string;
  reducedMotion: boolean;
  startDelayMs: number;
  wordDelayMs: number;
}) {
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? words.length : 0);

  useEffect(() => {
    if (reducedMotion) return;
    if (visibleCount >= words.length) return;

    const delay = visibleCount === 0 ? startDelayMs : wordDelayMs;
    const id = window.setTimeout(() => {
      setVisibleCount((count) => count + 1);
    }, delay);

    return () => window.clearTimeout(id);
  }, [reducedMotion, startDelayMs, visibleCount, wordDelayMs, words.length]);

  return (
    <Component className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={false}
          animate={
            index < visibleCount
              ? { opacity: 1, y: 0, filter: "blur(0px)" }
              : { opacity: 0, y: 14, filter: "blur(4px)" }
          }
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Component>
  );
}
