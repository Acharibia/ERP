import { useState, useEffect } from "react";
import Dropzone, { Accept } from "react-dropzone";
import { XCircle, ImageIcon, FileTextIcon, VideoIcon, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  value?: string | null;
  onChange?: (file: File | null) => void;
  className?: string;
  dropzoneClassName?: string;
  accept?: Accept;
  maxFiles?: number;
  previewClassName?: string;
}

const defaultAccept: Accept = {
  "image/*": [".png", ".jpg", ".jpeg", ".webp"],
  "application/pdf": [".pdf"],
  "application/msword": [".doc", ".docx"],
  "video/*": [".mp4", ".mov"],
};

const FileUploader = ({
  value,
  onChange,
  className,
  dropzoneClassName,
  previewClassName,
  accept = defaultAccept,
  maxFiles = 1,
}: FileUploaderProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFileType(file.type);
      onChange?.(file);
    }
  };

  const handleRemove = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFileType(null);
    onChange?.(null);
  };

  const renderPreview = () => {
    if (!previewUrl || !fileType) return null;

    if (fileType.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt="Preview"
                className={cn("border border-border h-full w-full rounded-md object-cover", previewClassName)}

        />
      );
    }

    return (
      <div className="flex h-full w-full flex-col items-center justify-center border border-border rounded-md bg-muted text-muted-foreground p-2 text-center text-sm">
        {fileType.includes("pdf") && <FileTextIcon className="h-8 w-8 mb-2" />}
        {fileType.includes("video") && <VideoIcon className="h-8 w-8 mb-2" />}
        {!fileType.includes("pdf") && !fileType.includes("video") && <FileIcon className="h-8 w-8 mb-2" />}
        <span>{previewUrl.split("/").pop()}</span>
      </div>
    );
  };

  return (
    <div className={cn("w-full max-w-40", className)}>
      {previewUrl ? (
        <div className="relative aspect-square">
          <button
            type="button"
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 cursor-pointer"
            onClick={handleRemove}
          >
            <XCircle className="h-5 w-5 text-destructive" />
          </button>
          {renderPreview()}
        </div>
      ) : (
        <Dropzone onDrop={handleDrop} accept={accept} maxFiles={maxFiles}>
          {({
            getRootProps,
            getInputProps,
            isDragActive,
            isDragAccept,
            isDragReject,
          }) => (
            <div
              {...getRootProps()}
              className={cn(
                "border border-dashed flex items-center justify-center aspect-square rounded-md cursor-pointer transition-colors",
                {
                  "border-primary bg-secondary": isDragActive && isDragAccept,
                  "border-destructive bg-destructive/20":
                    isDragActive && isDragReject,
                },
                dropzoneClassName
              )}
            >
              <input {...getInputProps()} />
              <ImageIcon className="h-16 w-16 text-muted-foreground" strokeWidth={1.25} />
            </div>
          )}
        </Dropzone>
      )}
    </div>
  );
};

export default FileUploader;
