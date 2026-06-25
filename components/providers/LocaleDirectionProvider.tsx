"use client";

import type { ReactNode } from "react";
import { DirectionProvider } from "@/components/ui/direction";
import type { Direction } from "@/i18n/routing";

type LocaleDirectionProviderProps = {
  direction: Direction;
  children: ReactNode;
};

/** Global Radix/shadcn text direction — sync with `<html dir>` from locale. */
export function LocaleDirectionProvider({
  direction,
  children,
}: LocaleDirectionProviderProps) {
  return (
    <DirectionProvider dir={direction} direction={direction}>
      {children}
    </DirectionProvider>
  );
}
