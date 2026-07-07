import { cn } from "@/lib/utils";

export type ProductRippleVariant = "edge-left" | "edge-right" | "center";

type ProductRipplesProps = {
  variant?: ProductRippleVariant;
  className?: string;
  ringCount?: number;
  ringStep?: number;
  opacityClass?: string;
};

export function ProductRipples({
  variant = "edge-right",
  className,
  ringCount = 4,
  ringStep = 100,
  opacityClass = "border-[var(--accent-glow)]/45",
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
      {Array.from({ length: ringCount }, (_, ring) => (
        <span
          key={ring}
          className={cn(
            "absolute rounded-full border",
            opacityClass,
            variant === "center" ? "-translate-x-1/2 -translate-y-1/2" : "-translate-y-1/2",
            variant === "edge-right" && "translate-x-1/2",
            variant === "edge-left" && "-translate-x-1/2",
            origin
          )}
          style={{
            width: 56 + ring * ringStep,
            height: 56 + ring * ringStep,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Renders concentric rings centered exactly on the phone image within a card.
 * phoneX / phoneY are percentage positions (0–100) of the phone center within the card.
 */
export function CardPhoneRipples({
  phoneX,
  phoneY = 50,
  className,
}: {
  phoneX: number; // 0–100, percent from left
  phoneY?: number; // 0–100, percent from top
  className?: string;
}) {
  const RING_COUNT = 5;
  const MIN_SIZE = 80;
  const RING_STEP = 90;

  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden
    >
      {Array.from({ length: RING_COUNT }, (_, ring) => {
        const size = MIN_SIZE + ring * RING_STEP;
        return (
          <span
            key={ring}
            className="absolute rounded-full border border-[#5aa8ff]/30"
            style={{
              width: size,
              height: size,
              left: `${phoneX}%`,
              top: `${phoneY}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
}

/** Ripples in the column gutter — completes arcs between adjacent cards. */
export function ProductGridRipples({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-0", className)} aria-hidden>
      <ProductRipples
        variant="center"
        ringCount={4}
        ringStep={100}
        opacityClass="border-[var(--accent-glow)]/35"
        className="absolute left-1/2 top-[calc(317px/2)]"
      />
      <ProductRipples
        variant="center"
        ringCount={4}
        ringStep={100}
        opacityClass="border-[var(--accent-glow)]/35"
        className="absolute left-1/2 top-[calc(317px+2.5rem+(317px/2))]"
      />
    </div>
  );
}

/** Background ripples perfectly aligned with the card phone visual positions. */
export function ProductGridBackgroundRipples({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 z-0 overflow-visible hidden md:block", className)} aria-hidden>
      {/* Top-Right: bohamdan phone (right edge of right column) */}
      <ProductRipples
        variant="edge-right"
        ringCount={4}
        ringStep={100}
        opacityClass="border-[var(--accent-glow)]/35"
        className="absolute right-0 top-[158.5px]"
      />
      {/* Top-Left: Did Deed phone (right edge of left column) */}
      <ProductRipples
        variant="edge-right"
        ringCount={4}
        ringStep={100}
        opacityClass="border-[var(--accent-glow)]/35"
        className="absolute left-[calc(50%-20px)] top-[158.5px]"
      />
      {/* Bottom-Right: Road 80 phone (left edge of right column) */}
      <ProductRipples
        variant="edge-left"
        ringCount={4}
        ringStep={100}
        opacityClass="border-[var(--accent-glow)]/35"
        className="absolute left-[calc(50%+20px)] top-[515.5px]"
      />
      {/* Bottom-Left: NAFAS phone (left edge of left column) */}
      <ProductRipples
        variant="edge-left"
        ringCount={4}
        ringStep={100}
        opacityClass="border-[var(--accent-glow)]/35"
        className="absolute left-0 top-[515.5px]"
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
