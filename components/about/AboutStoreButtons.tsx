"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Stagger } from "@/components/motion";
import { cn } from "@/lib/utils";
import type { LocalizedAboutContent } from "@/lib/cms/types";

type StoreButton = LocalizedAboutContent["products"][number]["storeButtons"][number];

export function AboutStoreButtons({
  buttons,
  className,
}: {
  buttons: StoreButton[];
  className?: string;
}) {
  return (
    <Stagger className={cn("flex flex-wrap gap-4", className)} staggerMs={80} variant="fade-up">
      {buttons.map((store) => (
        <motion.div key={store.id}>
          <Link
            href={store.href}
            className="flex h-12 w-36 items-center justify-center rounded-xl bg-black text-left text-white"
            dir="ltr"
          >
            <span className="text-sm leading-tight">
              <small className="block text-[9px] text-white/70">{store.preLabel}</small>
              {store.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </Stagger>
  );
}
