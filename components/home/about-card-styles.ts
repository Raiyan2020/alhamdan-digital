export type AboutCardKey = "ai" | "scale" | "expertise" | "mindset";

/** Per-card surface colors — CSS variables adapt to light/dark theme. */
export const aboutCardStyles: Record<AboutCardKey, { bgVar: string }> = {
  ai: { bgVar: "var(--about-card-ai)" },
  scale: { bgVar: "var(--about-card-scale)" },
  expertise: { bgVar: "var(--about-card-expertise)" },
  mindset: { bgVar: "var(--about-card-mindset)" },
};

export const aboutCardSharedClass =
  "rounded-2xl text-center shadow-none";

export const aboutCardIconClass =
  "mb-5 grid h-12 w-12 place-items-center rounded-full bg-card-surface text-brand shadow-[0_4px_14px_rgba(1,37,97,0.07)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.25)]";
