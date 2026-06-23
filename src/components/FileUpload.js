"use client";

import { useState, useRef } from "react";
import { uploadFile } from "@/lib/client";
import Icon from "@/components/Icon";

// Drag & drop uploader. Calls onUploaded(url) for each successful upload.
export default function FileUpload({
  folder = "uploads",
  max = 3,
  value = [],
  onChange,
  label = "Drag & drop or click to upload",
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function handleFiles(files) {
    setError("");
    const list = Array.from(files).slice(0, max - value.length);
    if (!list.length) return;
    setBusy(true);
    try {
      const urls = [];
      for (const file of list) {
        const url = await uploadFile(file, folder);
        urls.push(url);
      }
      onChange?.([...value, ...urls]);
    } catch (e) {
      setError(e.message || "Upload failed. Is storage configured?");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-bg px-4 py-8 text-center text-sm text-muted transition hover:border-orange"
      >
        <Icon name="upload" className="h-8 w-8 text-muted" />
        <span className="mt-2">{busy ? "Uploading…" : label}</span>
        <span className="mt-1 text-xs">
          {value.length}/{max} uploaded
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={max > 1}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}

      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="upload"
                className="h-20 w-20 rounded-lg border border-border object-cover"
              />
              <button
                type="button"
                onClick={() => onChange?.(value.filter((_, idx) => idx !== i))}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white"
              >
                <Icon name="x" className="h-3.5 w-3.5" strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

