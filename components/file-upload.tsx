"use client";

// icon
import { X } from "lucide-react";
// component
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
// style
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
  isMessageFile?: boolean; 
}

const FileUpload = ({ onChange, value, endpoint, isMessageFile = false }: FileUploadProps) => {

  if (value && !isMessageFile) {
    return (
      <div className="relative h-20 w-20">
        <Image
          fill
          src={value}
          alt="Upload"
          className="rounded-full"
        />
        <button
          className="absolute top-0 right-0 shadow-sm rounded-full bg-rose-500 text-white p-1"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res[0].url);
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
      }}
    />
  );
};

export default FileUpload;
