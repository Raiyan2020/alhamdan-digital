import type { LucideIcon } from "lucide-react";
import { MotionCard } from "@/components/motion";
import { cn } from "@/lib/utils";

type SectorCardProps = {
  title: string;
  Icon: LucideIcon;
  className?: string;
};

export function SectorCard({ title, Icon, className }: SectorCardProps) {
  return (
    <MotionCard
      whileHover={undefined}
      className={cn(
        "flex shrink-0 flex-col items-center justify-center gap-3 rounded-2xl bg-card-surface text-center shadow-[0_18px_60px_rgba(15,23,42,0.12)]",
        className
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand/8 dark:bg-brand-soft/12 text-brand">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="px-3 text-[20px] font-semibold leading-tight text-ink">
        {title}
      </h3>
    </MotionCard>
  );
}
