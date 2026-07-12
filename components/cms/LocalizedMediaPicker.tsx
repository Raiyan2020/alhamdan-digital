"use client";

import { useRef } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "@/lib/toast";
import { useUploadCmsMediaMutation } from "@/hooks/use-cms-mutations";
import type { UploadCmsMediaInput } from "@/lib/api/cms";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BilingualTextInput } from "./BilingualFields";
import { ImageCropUpload } from "./ImageCropUpload";

type LocalizedMediaPickerProps<T extends FieldValues> = {
  control: Control<T, unknown, T>;
  name: Path<T>;
  label: string;
  accept?: string;
  aspect?: number;
};

export function LocalizedMediaPicker<T extends FieldValues>({
  control,
  name,
  label,
  accept = "image/png,image/jpeg,image/webp,image/gif",
  aspect,
}: LocalizedMediaPickerProps<T>) {
  const t = useTranslations("cms.common");
  const tMedia = useTranslations("cms.mediaUpload");
  const form = useFormContext<T>();
  const uploadMutation = useUploadCmsMediaMutation();
  const currentUrl = form.watch(`${name}.defaultUrl` as Path<T>) as string | undefined;
  const initialUrl = useRef(currentUrl ?? "");

  function upload(file: File, options?: Pick<UploadCmsMediaInput, "preserveDimensions">) {
    uploadMutation.mutate({ file, ...options }, {
      onSuccess: (data) => {
        form.setValue(`${name}.defaultUrl` as Path<T>, data.asset.url as never, { shouldDirty: true });
        form.setValue(`${name}.defaultAssetId` as Path<T>, data.asset.id as never, { shouldDirty: true });
        form.setValue(`${name}.arUrl` as Path<T>, null as never, { shouldDirty: true });
        form.setValue(`${name}.arAssetId` as Path<T>, null as never, { shouldDirty: true });
        form.setValue(`${name}.enUrl` as Path<T>, null as never, { shouldDirty: true });
        form.setValue(`${name}.enAssetId` as Path<T>, null as never, { shouldDirty: true });
        form.setValue(`${name}.isDecorative` as Path<T>, false as never, { shouldDirty: true });
        toast.success(tMedia("uploadSuccess"));
      },
    });
  }

  function removeImage() {
    form.setValue(`${name}.defaultUrl` as Path<T>, initialUrl.current as never, { shouldDirty: true });
    form.setValue(`${name}.defaultAssetId` as Path<T>, null as never, { shouldDirty: true });
    form.setValue(`${name}.arUrl` as Path<T>, null as never, { shouldDirty: true });
    form.setValue(`${name}.arAssetId` as Path<T>, null as never, { shouldDirty: true });
    form.setValue(`${name}.enUrl` as Path<T>, null as never, { shouldDirty: true });
    form.setValue(`${name}.enAssetId` as Path<T>, null as never, { shouldDirty: true });
  }

  return (
    <div className="grid gap-4 rounded-lg border border-border p-4">
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className="mt-1 text-sm text-muted-foreground">{tMedia("pickerHint")}</p>
      </div>

      <ImageCropUpload
        currentUrl={currentUrl}
        onUpload={upload}
        onRemove={removeImage}
        isUploading={uploadMutation.isPending}
        accept={accept}
        aspect={aspect}
      />

      <FormField
        control={control}
        name={`${name}.defaultUrl` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tMedia("sharedUrl")}</FormLabel>
            <FormControl>
              <Input dir="ltr" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={control}
          name={`${name}.arUrl` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tMedia("arabicOverrideUrl")}</FormLabel>
              <FormControl>
                <Input dir="ltr" value={field.value ?? ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${name}.enUrl` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tMedia("englishOverrideUrl")}</FormLabel>
              <FormControl>
                <Input dir="ltr" value={field.value ?? ""} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <BilingualTextInput control={control} name={`${name}.alt` as Path<T>} label={t("altText")} />
    </div>
  );
}
