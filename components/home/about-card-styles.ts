export type AboutCardKey = "ai" | "scale" | "expertise" | "mindset";

/** Per-card surface colors sampled from Figma (node 32:4 about grid). */
export const aboutCardStyles: Record<AboutCardKey, { bg: string }> = {
  ai: { bg: "#E9EEF6" },
  scale: { bg: "#ECF1FB" },
  expertise: { bg: "#E6EFFF" },
  mindset: { bg: "#E8F0FC" },
};

export const aboutCardSharedClass =
  "rounded-2xl text-center shadow-none";

export const aboutCardIconClass =
  "mb-5 grid h-12 w-12 place-items-center rounded-full bg-white text-[#012561] shadow-[0_4px_14px_rgba(1,37,97,0.07)]";
