export const MOTION_DURATION = {
  instant: 80,
  fast: 140,
  medium: 240,
  slow: 420,
  cinematic: 720,
} as const;

export const MOTION_STAGGER = {
  card: 70,
  step: 60,
  list: 55,
  maxMobile: 8,
} as const;

export const MOTION_THRESHOLD = {
  sectionHeading: { desktop: 0.15, mobile: 0.08 },
  cards: { desktop: 0.1, mobile: 0.05 },
  images: { desktop: 0.12, mobile: 0.08 },
  footer: { desktop: 0.08, mobile: 0.05 },
} as const;

export const MOTION_ROOT_MARGIN = {
  sectionHeading: "0px 0px -5% 0px",
  cards: "0px 0px -5% 0px",
  images: "0px 0px -8% 0px",
  footer: "0px",
} as const;

export const MOTION_FAIL_OPEN_MS = 2000;
