import { cn } from "@/lib/utils";

export type ProductRippleVariant = "edge-left" | "edge-right" | "center";

type ProductRipplesProps = {
  variant?: ProductRippleVariant;
  className?: string;
};

const RING_COUNT = 7;
const RING_STEP = 44;

export function ProductRipples({
  variant = "edge-right",
  className,
}: ProductRipplesProps) {
  const origin =
    variant === "edge-right"
      ? "right-0 top-[42%]"
      : variant === "edge-left"
        ? "left-0 top-[42%]"
        : "left-1/2 top-1/2";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-visible", className)}
      aria-hidden
    >
      {Array.from({ length: RING_COUNT }, (_, ring) => (
        <span
          key={ring}
          className={cn(
            "absolute rounded-full border border-[#5aa8ff]/38",
            variant === "center" ? "-translate-x-1/2 -translate-y-1/2" : "-translate-y-1/2",
            variant === "edge-right" && "translate-x-1/2",
            variant === "edge-left" && "-translate-x-1/2",
            origin
          )}
          style={{
            width: 56 + ring * RING_STEP,
            height: 56 + ring * RING_STEP,
          }}
        />
      ))}
      <span
        className={cn(
          "absolute h-32 w-32 rounded-full bg-[#b8dcff]/40 blur-2xl",
          variant === "center" ? "-translate-x-1/2 -translate-y-1/2" : "-translate-y-1/2",
          variant === "edge-right" && "translate-x-1/2",
          variant === "edge-left" && "-translate-x-1/2",
          origin
        )}
      />
    </div>
  );
}

/** Ripples in the column gutter — completes arcs between adjacent cards. */
export function ProductGridRipples({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-0", className)} aria-hidden>
      <ProductRipples variant="center" className="absolute left-1/2 top-[calc(317px/2)]" />
      <ProductRipples
        variant="center"
        className="absolute left-1/2 top-[calc(317px+2.5rem+(317px/2))]"
      />
    </div>
  );
}

const cardRippleVariant: ProductRippleVariant[] = [
  "edge-right",
  "edge-left",
  "edge-right",
  "edge-left",
];

export function getProductCardRippleVariant(index: number): ProductRippleVariant {
  return cardRippleVariant[index % cardRippleVariant.length];
}
