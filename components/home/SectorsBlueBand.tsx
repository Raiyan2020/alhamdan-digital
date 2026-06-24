import { cn } from "@/lib/utils";

type SectorsBlueBandProps = {
  className?: string;
};

/** Full-bleed wavy navy band matching the Figma sectors ribbon. */
export function SectorsBlueBand({ className }: SectorsBlueBandProps) {
  return (
    <div className={cn("pointer-events-none w-full select-none", className)} aria-hidden>
      <svg
        viewBox="0 0 1440 322"
        preserveAspectRatio="none"
        className="block h-full w-full"
        role="presentation"
      >
        <path
          fill="#012561"
          d="M0 114 C190 92 344 72 542 96 C735 120 880 157 1068 145 C1238 134 1352 99 1440 54 L1440 194 C1322 254 1165 292 958 294 C737 296 557 247 361 232 C201 220 86 232 0 260 Z"
        />
      </svg>
    </div>
  );
}
