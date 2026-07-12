import * as React from "react"

import { cn } from "@/lib/utils"

const isArabicText = (text?: string | null) => {
  if (!text) return false;
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

function Textarea({ className, placeholder, ...props }: React.ComponentProps<"textarea">) {
  const isArabicPlaceholder = isArabicText(placeholder);

  return (
    <textarea
      placeholder={placeholder}
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        isArabicPlaceholder && "placeholder:[direction:rtl] placeholder:text-right",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
