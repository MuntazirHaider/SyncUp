"use client";

// Icons
import { FileIcon, X, Play, Video } from "lucide-react";
// Components
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
// Styles
import "@uploadthing/react/styles.css";

interface FileUploadProps {
  onChange: (url?: string) => void;
  value: string;
  endpoint: "messageFile" | "serverImage";
}

const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
  let file = "";
  let fileType = "";
  let fileName = "";

  if (value) {
    try {
      const parsedValue = JSON.parse(value);
      file = parsedValue.url || "";
      fileType = parsedValue.type?.toLowerCase() || "Unknown";
      fileName = parsedValue.name || "File Uploaded";
    } catch (error) {
      console.error("Invalid file data format:", error);
    }
  }

  // Image Preview
  if (file && fileType.includes("image")) {
    return (
      <div className="relative h-20 w-20">
        <Image fill src={file} alt="Upload" className="rounded-full" />
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

  // PDF Preview
  if (file && fileType.includes("pdf")) {
    const truncatedFileName =
      fileName.length > 50 ? `${fileName.slice(0, 50)}...` : fileName;

    return (
      <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 shadow-md">
        <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
        <a
          href={file}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline truncate"
          title={fileName}
        >
          {truncatedFileName}
        </a>
        <button
          className="absolute -top-2 -right-2 shadow-sm rounded-full bg-rose-500 text-white p-1"
          type="button"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // Audio Preview
  if (file && fileType.includes("audio")) {
    const truncatedFileName =
      fileName.length > 50 ? `${fileName.slice(0, 50)}...` : fileName;
    return (
      <div className="relative flex flex-col items-center p-3 mt-2 rounded-md bg-background/10 shadow-md w-full max-w-md">
        <div className="flex items-center w-full mb-2">
          <Play className="h-6 w-6 fill-green-400 stroke-green-600 mr-2" />
          <p className="text-sm text-green-700 font-medium truncate flex-1">
            {truncatedFileName || "Audio File"}
          </p>
          <button
            className="absolute -top-2 -right-2 shadow-sm rounded-full bg-rose-500 text-white p-1"
            type="button"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <audio controls className="w-full">
          <source src={file} type={fileType} />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  // Video Preview
  if (file && fileType.includes("video")) {
    const truncatedFileName =
      fileName.length > 50 ? `${fileName.slice(0, 50)}...` : fileName;
    return (
      <div className="relative flex flex-col items-center p-2 mt-2 rounded-md bg-background/10 shadow-md w-full max-w-md">
        <div className="flex items-center w-full mb-2">
          <Video className="h-10 w-10 fill-blue-200 stroke-blue-400" />
          <p className="text-sm text-green-700 font-medium truncate flex-1">
            {truncatedFileName || "Audio File"}
          </p>
          <button
            className="absolute -top-2 -right-2 shadow-sm rounded-full bg-rose-500 text-white p-1"
            type="button"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <video controls className="mt-2 w-full max-h-40 rounded-md">
          <source src={file} type={fileType} />
          Your browser does not support the video element.
        </video>
      </div>
    );
  }

  // Default Dropzone
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        const fileData = {
          url: res[0].url,
          type: res[0].type,
          name: res[0].name,
        };
        onChange(JSON.stringify(fileData));
      }}
      onUploadError={(error: Error) => {
        console.error("Upload error:", error);
      }}
    />
  );
};

export default FileUpload;
