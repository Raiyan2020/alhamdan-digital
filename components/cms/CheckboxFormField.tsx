"use client";

import type { FieldPath, FieldValues } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

type CheckboxFormFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
};

export function CheckboxFormField<T extends FieldValues>({
  name,
  label,
}: CheckboxFormFieldProps<T>) {
  const form = useFormContext<T>();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex w-fit max-w-full items-center gap-2 space-y-0">
          <FormControl className="w-auto shrink-0">
            <Checkbox checked={Boolean(field.value)} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="mt-0! cursor-pointer">{label}</FormLabel>
        </FormItem>
      )}
    />
  );
}
