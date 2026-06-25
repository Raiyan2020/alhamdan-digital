"use client";

import { useTranslations } from "next-intl";
import type { CmsSectionGroup } from "@/lib/cms/section-nav";
import { cn } from "@/lib/utils";
import { dashboardNavItemBase } from "@/lib/dashboard/classes";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CmsSectionNavProps = {
  namespace: "home" | "about";
  groups: readonly CmsSectionGroup[];
  activeSection: string;
  onSectionChange: (section: string) => void;
};

export function CmsSectionNav({
  namespace,
  groups,
  activeSection,
  onSectionChange,
}: CmsSectionNavProps) {
  const t = useTranslations("cms");

  return (
    <>
      <div className="lg:hidden">
        <Select value={activeSection} onValueChange={onSectionChange}>
          <SelectTrigger className="h-11 w-full rounded-xl bg-muted/40">
            <SelectValue placeholder={t("common.chooseSection")} />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectGroup key={group.groupKey}>
                <SelectLabel className="text-xs font-normal text-muted-foreground">
                  {t(`${namespace}.groups.${group.groupKey}`)}
                </SelectLabel>
                {group.items.map((id) => (
                  <SelectItem key={id} value={id} className="font-medium">
                    {t(`${namespace}.sections.${id}`)}
                  </SelectItem>
                ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav
        aria-label={t("common.chooseSection")}
        className="hidden shrink-0 lg:block lg:w-60 xl:w-64"
      >
        <div className="sticky top-8 space-y-6 rounded-2xl border border-border/70 bg-dashboard-surface p-3 shadow-dashboard">
          {groups.map((group) => (
            <div key={group.groupKey}>
              <div className="mb-2 flex items-center gap-2 px-2">
                <span className="h-px flex-1 bg-border/80" aria-hidden />
                <span className="shrink-0 text-[10px] font-normal tracking-wide text-dashboard-ink-muted/80">
                  {t(`${namespace}.groups.${group.groupKey}`)}
                </span>
                <span className="h-px flex-1 bg-border/80" aria-hidden />
              </div>
              <div className="space-y-1">
                {group.items.map((id) => {
                  const active = activeSection === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onSectionChange(id)}
                      data-active={active ? "true" : undefined}
                      className={cn(
                        dashboardNavItemBase,
                        "text-start",
                        active && "shadow-dashboard-lg",
                      )}
                    >
                      {active ? (
                        <span
                          className="absolute inset-y-2 start-1.5 w-1 rounded-full bg-brand-on/90"
                          aria-hidden
                        />
                      ) : null}
                      <span className={cn(active && "ps-2")}>
                        {t(`${namespace}.sections.${id}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
