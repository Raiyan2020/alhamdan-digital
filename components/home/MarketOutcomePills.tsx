"use client";

import { Check } from "lucide-react";
import { Stagger } from "@/components/motion";
import { cn } from "@/lib/utils";

type MarketOutcomePillsProps = {
  outcomes: string[];
  className?: string;
  pillClassName?: string;
  compact?: boolean;
};

export function MarketOutcomePills({
  outcomes,
  className,
  pillClassName,
  compact = false,
}: MarketOutcomePillsProps) {
  return (
    <Stagger
      className={cn(
        "grid w-full gap-y-3",
        compact
          ? "mx-auto max-w-[507px] grid-cols-1"
          : "mt-8 max-w-[507px] grid-cols-2 gap-x-6 gap-y-4",
        className
      )}
      staggerMs={55}
      variant="fade-up"
    >
      {outcomes.map((item, index) => (
        <span
          key={item}
          className={cn(
            "flex h-11 w-full items-center justify-start gap-2 rounded-full bg-[#f3f3f3] px-4 text-start font-bold text-[#0d0d0d]",
            compact ? "text-xs sm:text-sm" : "text-[14px]",
            !compact &&
              index === outcomes.length - 1 &&
              "col-span-2 w-full justify-self-start",
            pillClassName
          )}
        >
          <Check
            className={cn(
              "shrink-0 rounded-full bg-[#012561] p-1 text-white",
              compact ? "h-4 w-4" : "h-5 w-5"
            )}
            aria-hidden
          />
          <span className="whitespace-nowrap">{item}</span>
        </span>
      ))}
    </Stagger>
  );
}
