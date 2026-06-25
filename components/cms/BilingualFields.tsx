"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/cms/RichTextEditor";

type BilingualFieldProps<T extends FieldValues> = {
  control: Control<T, unknown, T>;
  name: Path<T>;
  label: string;
};

export function BilingualTextInput<T extends FieldValues>({
  control,
  name,
  label,
}: BilingualFieldProps<T>) {
  const t = useTranslations("cms.common");

  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
      <FormField
        control={control}
        name={`${name}.ar` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label} ({t("arabic")})
            </FormLabel>
            <FormControl>
              <Input dir="rtl" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.en` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label} ({t("english")})
            </FormLabel>
            <FormControl>
              <Input dir="ltr" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export function BilingualTipTapField<T extends FieldValues>({
  control,
  name,
  label,
}: BilingualFieldProps<T>) {
  const t = useTranslations("cms.common");

  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-6">
      <FormField
        control={control}
        name={`${name}.html.ar` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label} ({t("arabic")})
            </FormLabel>
            <FormControl>
              <RichTextEditor
                dir="rtl"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name={`${name}.html.en` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              {label} ({t("english")})
            </FormLabel>
            <FormControl>
              <RichTextEditor
                dir="ltr"
                value={field.value ?? ""}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
