/** Resolve in-page anchor when desktop + responsive layouts duplicate the same id. */
export function findScrollTarget(id: string): HTMLElement | null {
  const escaped = CSS.escape(id);
  const candidates = document.querySelectorAll<HTMLElement>(`[id="${escaped}"]`);
  if (candidates.length === 0) return null;

  for (const el of candidates) {
    if (el.getClientRects().length > 0) return el;
  }

  for (const el of candidates) {
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") continue;

    const canvas = el.closest("[data-figma-canvas]");
    if (canvas && canvas.getClientRects().length > 0) return el;
    if (!canvas && el.offsetParent !== null) return el;
  }

  return candidates[candidates.length - 1] ?? null;
}
