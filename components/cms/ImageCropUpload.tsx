"use client";

import { Crop, Loader2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { isValidImageSrc } from "@/lib/media/image-url";
import {
  getCroppedImageFile,
  shouldOpenCropEditor,
  type PixelCrop,
} from "@/lib/cms/crop-image";

const OUTPUT_WIDTH_OPTIONS = [
  { value: "original", maxWidth: undefined },
  { value: "1920", maxWidth: 1920 },
  { value: "1200", maxWidth: 1200 },
  { value: "800", maxWidth: 800 },
  { value: "400", maxWidth: 400 },
] as const;

type OutputWidthValue = (typeof OUTPUT_WIDTH_OPTIONS)[number]["value"];
type UploadMode = "crop" | "original";
type CropBoxSize = {
  width: number;
  height: number;
};

const DEFAULT_CROP_BOX: CropBoxSize = {
  width: 260,
  height: 200,
};

const MIN_CROP_BOX_SIZE = 120;
const MAX_CROP_BOX_WIDTH = 720;
const MAX_CROP_BOX_HEIGHT = 420;

function isValidPreviewUrl(url?: string): url is string {
  return isValidImageSrc(url);
}

type ImageCropUploadProps = {
  currentUrl?: string;
  onUpload: (file: File, options?: { preserveDimensions?: boolean }) => void;
  onRemove?: () => void;
  isUploading?: boolean;
  accept?: string;
  aspect?: number;
  className?: string;
  disabled?: boolean;
};

export function ImageCropUpload({
  currentUrl,
  onUpload,
  onRemove,
  isUploading = false,
  accept = "image/png,image/jpeg,image/webp,image/gif",
  aspect,
  className,
  disabled = false,
}: ImageCropUploadProps) {
  const t = useTranslations("cms.mediaUpload");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropBoxSize, setCropBoxSize] = useState<CropBoxSize>(DEFAULT_CROP_BOX);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [outputWidth, setOutputWidth] = useState<OutputWidthValue>("1920");
  const [uploadMode, setUploadMode] = useState<UploadMode>("crop");
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewErrorUrl, setPreviewErrorUrl] = useState<string | null>(null);

  const previewUrl = isValidPreviewUrl(currentUrl) ? currentUrl.trim() : null;
  const showPreview = Boolean(previewUrl) && previewErrorUrl !== previewUrl;

  const resetCropState = useCallback(() => {
    setSourceFile(null);
    setImageSrc((current) => {
      if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
      return null;
    });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCropBoxSize(DEFAULT_CROP_BOX);
    setCroppedAreaPixels(null);
    setOutputWidth("1920");
    setUploadMode("crop");
    setIsProcessing(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  useEffect(() => {
    return () => {
      if (imageSrc?.startsWith("blob:")) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  function openCropDialog(file: File) {
    const objectUrl = URL.createObjectURL(file);
    setSourceFile(file);
    setImageSrc(objectUrl);
    setDialogOpen(true);
  }

  function handleFileSelection(file: File | undefined) {
    if (!file || disabled || isUploading) return;

    if (file.size > 8 * 1024 * 1024) {
      window.alert(t("fileTooLarge"));
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (shouldOpenCropEditor(file)) {
      openCropDialog(file);
      return;
    }

    onUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleConfirmCrop() {
    if (!imageSrc || !sourceFile) return;

    setIsProcessing(true);
    try {
      if (uploadMode === "original") {
        onUpload(sourceFile, { preserveDimensions: true });
        setDialogOpen(false);
        resetCropState();
        return;
      }

      if (!croppedAreaPixels) return;

      const selected = OUTPUT_WIDTH_OPTIONS.find((option) => option.value === outputWidth);
      const croppedFile = await getCroppedImageFile(imageSrc, croppedAreaPixels, {
        maxWidth: selected?.maxWidth,
        fileName: sourceFile.name,
        mimeType: "image/webp",
        quality: 0.92,
      });
      onUpload(croppedFile);
      setDialogOpen(false);
      resetCropState();
    } catch {
      window.alert(t("cropFailed"));
      setIsProcessing(false);
    }
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
    if (!open) resetCropState();
  }

  const busy = isUploading || isProcessing;

  function openFilePicker() {
    if (disabled || busy) return;
    inputRef.current?.click();
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        disabled={disabled || busy}
        onChange={(event) => handleFileSelection(event.target.files?.[0])}
      />

      <button
        type="button"
        onClick={openFilePicker}
        disabled={disabled || busy}
        aria-label={showPreview ? t("replaceImage") : t("uploadImage")}
        className={cn(
          "flex h-56 w-full items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-muted/20",
          "cursor-pointer transition-colors hover:border-dashboard-gulf/40 hover:bg-muted/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dashboard-gulf/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        {showPreview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl ?? ""}
            alt=""
            className="pointer-events-none max-h-full max-w-full object-contain"
            onError={() => setPreviewErrorUrl(previewUrl)}
          />
        ) : (
          <div className="pointer-events-none flex flex-col items-center justify-center gap-2 px-6 text-center text-dashboard-ink-muted">
            <Upload className="h-8 w-8 opacity-60" aria-hidden />
            <p className="text-sm">{t("emptyPreview")}</p>
            <p className="text-xs opacity-80">{t("clickToUpload")}</p>
          </div>
        )}
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="rounded-full"
          disabled={disabled || busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? (
            <Loader2 className="me-2 h-4 w-4 animate-spin" />
          ) : (
            <Crop className="me-2 h-4 w-4" />
          )}
          {busy ? t("uploading") : showPreview ? t("replaceImage") : t("uploadImage")}
        </Button>

        {showPreview && onRemove ? (
          <Button
            type="button"
            variant="destructive"
            className="rounded-full"
            disabled={disabled || busy}
            onClick={onRemove}
          >
            <X className="me-2 h-4 w-4" />
            {t("removeImage")}
          </Button>
        ) : null}
      </div>

      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl" showCloseButton={!busy}>
          <DialogHeader className="border-b border-border/60 px-6 py-5 pe-14 text-start">
            <DialogTitle>{t("cropTitle")}</DialogTitle>
            <DialogDescription>{t("cropDescription")}</DialogDescription>
          </DialogHeader>

          <div className="relative h-[min(68vh,560px)] min-h-[320px] w-full bg-black/90">
            {imageSrc && uploadMode === "crop" ? (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                cropSize={cropBoxSize}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                objectFit="contain"
              />
            ) : null}
            {imageSrc && uploadMode === "original" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt=""
                className="h-full w-full object-contain"
              />
            ) : null}
          </div>

          <div className="grid gap-5 border-b border-border/60 px-6 py-5 sm:grid-cols-2">
            <div className="space-y-3">
              <Label>{t("uploadMode")}</Label>
              <Select
                value={uploadMode}
                onValueChange={(value) => setUploadMode(value as UploadMode)}
                disabled={busy}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crop">{t("modeCrop")}</SelectItem>
                  <SelectItem value="original">{t("modeOriginal")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {uploadMode === "crop" ? (
              <>
                <div className="space-y-3">
                  <Label htmlFor="crop-zoom">{t("zoom")}</Label>
                  <Slider
                    id="crop-zoom"
                    min={1}
                    max={3}
                    step={0.05}
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0] ?? 1)}
                    disabled={busy}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="crop-box-width">{t("cropBoxWidth")}</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(cropBoxSize.width)}px</span>
                  </div>
                  <Slider
                    id="crop-box-width"
                    min={MIN_CROP_BOX_SIZE}
                    max={MAX_CROP_BOX_WIDTH}
                    step={10}
                    value={[cropBoxSize.width]}
                    onValueChange={(value) =>
                      setCropBoxSize((current) => ({ ...current, width: value[0] ?? current.width }))
                    }
                    disabled={busy}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="crop-box-height">{t("cropBoxHeight")}</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(cropBoxSize.height)}px</span>
                  </div>
                  <Slider
                    id="crop-box-height"
                    min={MIN_CROP_BOX_SIZE}
                    max={MAX_CROP_BOX_HEIGHT}
                    step={10}
                    value={[cropBoxSize.height]}
                    onValueChange={(value) =>
                      setCropBoxSize((current) => ({ ...current, height: value[0] ?? current.height }))
                    }
                    disabled={busy}
                  />
                </div>
                <div className="space-y-3">
                  <Label>{t("outputSize")}</Label>
                  <Select
                    value={outputWidth}
                    onValueChange={(value) => setOutputWidth(value as OutputWidthValue)}
                    disabled={busy}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="original">{t("sizeOriginal")}</SelectItem>
                      <SelectItem value="1920">{t("size1920")}</SelectItem>
                      <SelectItem value="1200">{t("size1200")}</SelectItem>
                      <SelectItem value="800">{t("size800")}</SelectItem>
                      <SelectItem value="400">{t("size400")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full"
                    disabled={busy}
                    onClick={() => setCropBoxSize(DEFAULT_CROP_BOX)}
                  >
                    {t("resetCropBox")}
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-border/70 bg-muted/30 px-4 py-3 text-sm text-dashboard-ink-muted sm:col-span-1">
                {t("originalModeHint")}
              </div>
            )}
          </div>

          <DialogFooter className="mx-0 mb-0 gap-3 border-t border-border/60 bg-transparent px-6 py-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              disabled={busy}
              onClick={() => handleDialogOpenChange(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              type="button"
              className="rounded-full bg-dashboard-gulf text-brand-on hover:bg-dashboard-gulf/90"
              disabled={busy || (uploadMode === "crop" && !croppedAreaPixels)}
              onClick={() => void handleConfirmCrop()}
            >
              {busy ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                uploadMode === "original" ? t("confirmOriginal") : t("confirmCrop")
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
