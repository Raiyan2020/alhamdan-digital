import { cn } from "@/lib/utils";

/** Shiny glass hover — primary CTAs & solid buttons */
export const glassBtnClass =
  "motion-glass-btn border border-transparent";

/** Shiny glass hover — nav & text links */
export const glassLinkClass = "motion-glass-link";

/** Nav pills in header (resting glass + hover shine) */
export const glassNavLinkClass = "motion-glass-link--pill";

/** Active nav pill */
export const glassLinkActiveClass = "motion-glass-link--active";

/** Links on dark backgrounds (footer) */
export const glassLinkOnDarkClass = "motion-glass-link--on-dark";

/** Round / icon buttons */
export const glassIconBtnClass = "motion-glass-icon-btn";

export function glassLinkCn(active = false, onDark = false, extra?: string) {
  return cn(
    glassLinkClass,
    active && glassLinkActiveClass,
    onDark && glassLinkOnDarkClass,
    extra
  );
}

export function glassNavLinkCn(active = false, extra?: string) {
  return cn(glassLinkClass, glassNavLinkClass, active && glassLinkActiveClass, extra);
}

export function glassBtnCn(extra?: string) {
  return cn(glassBtnClass, extra);
}

export function glassIconBtnCn(extra?: string) {
  return cn(glassIconBtnClass, extra);
}
