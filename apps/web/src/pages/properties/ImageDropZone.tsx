import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { readImageFileAsDataUrl, readImageFilesAsDataUrls } from "@/lib/imageDataUrl";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type ImageDropZoneProps = {
  id: string;
  label: string;
  description?: string;
  /** Shown inside the zone when no preview (or behind dimmed preview for “replace”). */
  previewSrc: string | null;
  previewAlt?: string;
  multiple?: boolean;
  /** Called with one or more data URLs after successful read. */
  onReady: (dataUrls: string[]) => void;
  onClear?: () => void;
  clearLabel?: string;
  disabled?: boolean;
};

export function ImageDropZone({
  id,
  label,
  description,
  previewSrc,
  previewAlt = "",
  multiple = false,
  onReady,
  onClear,
  clearLabel = "Remove",
  disabled,
}: ImageDropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);

  const processFiles = useCallback(
    async (fileList: FileList | File[] | null) => {
      if (!fileList?.length || disabled) return;
      const files = multiple ? Array.from(fileList) : [Array.from(fileList)[0]!];
      setBusy(true);
      try {
        const urls = multiple ? await readImageFilesAsDataUrls(files) : [await readImageFileAsDataUrl(files[0]!)];
        onReady(urls);
        toast.success(multiple ? `${urls.length} image(s) added` : "Image set");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Upload failed");
      } finally {
        setBusy(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [disabled, multiple, onReady],
  );

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {description ? <p className="mt-0.5 text-xs text-muted">{description}</p> : null}
        </div>
        {previewSrc && onClear ? (
          <Button type="button" variant="ghost" className="h-8 gap-1 px-2 text-xs text-muted" onClick={onClear} disabled={disabled}>
            <X className="h-3.5 w-3.5" aria-hidden />
            {clearLabel}
          </Button>
        ) : null}
      </div>

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="sr-only"
        disabled={disabled || busy}
        onChange={(e) => void processFiles(e.target.files)}
      />

      <div
        role="button"
        tabIndex={disabled || busy ? -1 : 0}
        aria-label={label}
        className={cn(
          "relative flex w-full flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          drag ? "border-primary bg-primary/5" : "border-border bg-accent/20 hover:border-primary/50 hover:bg-accent/40",
          disabled || busy ? "pointer-events-none opacity-50" : "cursor-pointer",
        )}
        onClick={() => {
          if (!busy && !disabled) inputRef.current?.click();
        }}
        onKeyDown={(e) => {
          if (busy || disabled) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void processFiles(e.dataTransfer.files);
        }}
      >
        {previewSrc ? (
          <>
            <img src={previewSrc} alt={previewAlt} className="max-h-48 w-full object-contain opacity-90" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <span className="rounded-lg bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-md">
                {multiple ? "Add more images" : "Replace image"}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted">
            {busy ? (
              <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
            ) : (
              <ImagePlus className="h-10 w-10 text-primary/70" aria-hidden />
            )}
            <span className="text-sm font-medium text-foreground">
              {busy ? "Processing…" : multiple ? "Drop images here or browse" : "Drop cover here or browse"}
            </span>
            <span className="max-w-xs text-xs text-muted">JPG, PNG, WebP, GIF · up to 2 MB each</span>
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground shadow-sm">
              <Upload className="h-3.5 w-3.5" aria-hidden />
              Choose files
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
