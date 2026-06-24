"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const WORD_DELAY_MS = 140;
const LINE_GAP_MS = 280;
const TYPE_MS = 55;
const DELETE_MS = 35;
const PHRASE_HOLD_MS = 2200;
const BETWEEN_PHRASES_MS = 400;

type HeroAnimatedHeadingProps = {
  line1: string;
  line2Prefix: string;
  cyclePhrases: string[];
  className?: string;
  startDelayMs?: number;
};

function splitWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

export function HeroAnimatedHeading({
  line1,
  line2Prefix,
  cyclePhrases,
  className,
  startDelayMs = 0,
}: HeroAnimatedHeadingProps) {
  const reducedMotion = useReducedMotion();
  const line1Words = useMemo(() => splitWords(line1), [line1]);
  const prefixWords = useMemo(() => splitWords(line2Prefix), [line2Prefix]);
  const phrases = useMemo(
    () => cyclePhrases.filter(Boolean),
    [cyclePhrases]
  );

  const [line1Count, setLine1Count] = useState(
    reducedMotion ? line1Words.length : 0
  );
  const [prefixCount, setPrefixCount] = useState(
    reducedMotion ? prefixWords.length : 0
  );
  const [typedPhrase, setTypedPhrase] = useState(
    reducedMotion ? (phrases[0] ?? "") : ""
  );
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cycleStarted, setCycleStarted] = useState(reducedMotion);

  const line1Done = line1Count >= line1Words.length;
  const prefixDone = prefixCount >= prefixWords.length;

  useEffect(() => {
    if (reducedMotion) return;
    if (line1Count >= line1Words.length) return;
    const id = window.setTimeout(
      () => setLine1Count((count) => count + 1),
      line1Count === 0 ? startDelayMs : WORD_DELAY_MS
    );
    return () => window.clearTimeout(id);
  }, [line1Count, line1Words.length, reducedMotion, startDelayMs]);

  useEffect(() => {
    if (reducedMotion || !line1Done) return;
    if (prefixCount >= prefixWords.length) return;
    const id = window.setTimeout(
      () => setPrefixCount((count) => count + 1),
      prefixCount === 0 ? LINE_GAP_MS : WORD_DELAY_MS
    );
    return () => window.clearTimeout(id);
  }, [line1Done, prefixCount, prefixWords.length, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !prefixDone || phrases.length === 0) return;
    if (!cycleStarted) {
      const id = window.setTimeout(() => setCycleStarted(true), LINE_GAP_MS);
      return () => window.clearTimeout(id);
    }

    const target = phrases[phraseIndex] ?? "";

    if (!isDeleting && typedPhrase === target) {
      const id = window.setTimeout(() => setIsDeleting(true), PHRASE_HOLD_MS);
      return () => window.clearTimeout(id);
    }

    if (isDeleting && typedPhrase === "") {
      const id = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((index) => (index + 1) % phrases.length);
      }, BETWEEN_PHRASES_MS);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      if (isDeleting) {
        setTypedPhrase((value) => value.slice(0, -1));
        return;
      }

      setTypedPhrase(target.slice(0, typedPhrase.length + 1));
    }, isDeleting ? DELETE_MS : TYPE_MS);

    return () => window.clearTimeout(id);
  }, [
    cycleStarted,
    isDeleting,
    phraseIndex,
    phrases,
    prefixDone,
    reducedMotion,
    typedPhrase,
  ]);

  const showCursor =
    !reducedMotion && cycleStarted && (isDeleting || typedPhrase.length > 0);

  return (
    <h1
      className={cn(
        "font-medium tracking-[-0.03em] text-[#0d0d0d]",
        className
      )}
    >
      <span className="block" aria-label={line1}>
        {line1Words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="inline-block"
            initial={false}
            animate={
              index < line1Count
                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                : { opacity: 0, y: 14, filter: "blur(4px)" }
            }
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {index < line1Words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </span>

      <span className="mt-1 block min-h-[1.15em]" aria-live="polite">
        {prefixWords.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="inline-block"
            initial={false}
            animate={
              line1Done && index < prefixCount
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 12 }
            }
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
            {index < prefixWords.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}

        {prefixDone && (
          <>
            {(prefixWords.length > 0 || typedPhrase.length > 0) && "\u00A0"}
            <motion.span
              className={cn(
                "inline-block bg-gradient-to-l from-[#012561] via-[#0b3d8f] to-[#1e5fbf] bg-clip-text font-semibold tracking-[-0.02em] text-transparent",
                "drop-shadow-[0_1px_0_rgba(1,37,97,0.08)]"
              )}
              initial={false}
              animate={{ opacity: 1 }}
            >
              {typedPhrase}
              {showCursor && (
                <motion.span
                  aria-hidden
                  className="ms-0.5 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] rounded-full bg-[#012561]"
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{
                    duration: 0.85,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </motion.span>
          </>
        )}
      </span>
    </h1>
  );
}
