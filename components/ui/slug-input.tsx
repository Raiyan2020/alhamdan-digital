"use client";

import * as React from "react";
import { slugify } from "@/lib/slugify";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type SlugInputProps = Omit<React.ComponentProps<typeof Input>, "onChange" | "value" | "dir"> & {
  value?: string;
  onChange?: (value: string) => void;
};

function applySlugValue(
  raw: string,
  currentValue: string,
  onChange?: (value: string) => void,
) {
  const next = slugify(raw);
  if (next !== currentValue) {
    onChange?.(next);
  }
  return next;
}

const SlugInput = React.forwardRef<HTMLInputElement, SlugInputProps>(function SlugInput(
  { value = "", onChange, onBlur, className, onPaste, ...props },
  ref,
) {
  return (
    <Input
      ref={ref}
      dir="ltr"
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      value={value}
      className={cn(className)}
      onChange={(event) => onChange?.(event.target.value)}
      onBlur={(event) => {
        applySlugValue(event.target.value, value, onChange);
        onBlur?.(event);
      }}
      onPaste={(event) => {
        event.preventDefault();
        const pasted = event.clipboardData.getData("text");
        applySlugValue(pasted, value, onChange);
        onPaste?.(event);
      }}
      {...props}
    />
  );
});

export { SlugInput };
