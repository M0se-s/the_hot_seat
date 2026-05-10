"use client";

import React, { useState, useRef } from "react";
import { uploadProjectFile } from "@/lib/api";
import type { UploadResponse } from "@/lib/types";
import { Upload, CheckCircle2, AlertCircle, Loader2, FileText } from "lucide-react";

interface FileUploaderProps {
  projectId: string;
  onUploadSuccess: (result: UploadResponse) => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export const FileUploader: React.FC<FileUploaderProps> = ({
  projectId,
  onUploadSuccess,
}) => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<UploadResponse | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    // Client-side validation (backend validates too)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      setUploadState("error");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension !== "pdf" && extension !== "txt") {
      setError("Only PDF and TXT files are supported.");
      setUploadState("error");
      return;
    }

    setUploadState("uploading");
    setError(null);
    setLastResult(null);

    try {
      const result = await uploadProjectFile(projectId, file);
      setLastResult(result);
      setUploadState("success");
      onUploadSuccess(result);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploadState("error");
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleReset = () => {
    setUploadState("idle");
    setError(null);
    setLastResult(null);
  };

  return (
    <div className="w-full space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => uploadState !== "uploading" && fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-xl p-8
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center space-y-4
          ${
            isDragOver
              ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]"
              : uploadState === "success"
              ? "border-emerald-600/60 bg-emerald-950/20 cursor-default"
              : uploadState === "uploading"
              ? "border-slate-600 bg-slate-900/50 cursor-wait"
              : "border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50"
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.txt"
          disabled={uploadState === "uploading"}
        />

        {/* Icon */}
        <div
          className={`
            p-4 rounded-full transition-transform duration-300
            ${isDragOver ? "scale-110 bg-blue-500/20" : "bg-slate-800 group-hover:scale-105"}
            ${uploadState === "success" ? "bg-emerald-900/40" : ""}
          `}
        >
          {uploadState === "uploading" ? (
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          ) : uploadState === "success" ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          ) : (
            <Upload
              className={`w-8 h-8 ${isDragOver ? "text-blue-400" : "text-slate-400"}`}
            />
          )}
        </div>

        {/* Text content */}
        <div className="text-center">
          {uploadState === "uploading" && (
            <p className="text-lg font-medium text-slate-200">Uploading...</p>
          )}

          {uploadState === "success" && lastResult && (
            <>
              <p className="text-base font-semibold text-emerald-400">Upload successful</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <p className="text-sm text-slate-300 font-medium">{lastResult.filename}</p>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {lastResult.extractedText.length.toLocaleString()} characters extracted
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="mt-3 text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors"
              >
                Upload another file
              </button>
            </>
          )}

          {(uploadState === "idle" || uploadState === "error") && (
            <>
              <p className="text-lg font-medium text-slate-200">
                Click or drag to upload source material
              </p>
              <p className="text-sm font-medium text-slate-400 mt-2">PDF/TXT only (Max 10MB)</p>
              <div className="mt-2 text-xs text-slate-500 space-y-1">
                <p>OCR is not supported (scanned PDFs will be rejected)</p>
                <p>DOCX / images / web links are not supported in MVP</p>
              </div>
            </>
          )}
        </div>

        {isDragOver && (
          <div className="absolute inset-0 bg-blue-500/5 rounded-xl pointer-events-none" />
        )}
      </div>

      {/* Error banner */}
      {uploadState === "error" && error && (
        <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};
