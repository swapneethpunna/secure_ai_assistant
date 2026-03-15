import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";

type UploadedFile = {
  id: string;
  name: string;
  size: string;
  date: string;
  status: "ready" | "uploading";
};

const formatSize = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const UploadDocuments = () => {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: "1", name: "security_policy.pdf", size: "2.4 MB", date: "Mar 8, 2026", status: "ready" },
    { id: "2", name: "password_guidelines.pdf", size: "1.1 MB", date: "Mar 7, 2026", status: "ready" },
    { id: "3", name: "compliance_report.pdf", size: "3.7 MB", date: "Mar 6, 2026", status: "ready" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const newFiles: UploadedFile[] = Array.from(incoming).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: formatSize(f.size),
      date: formatDate(new Date()),
      status: "ready",
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="upload-page">
      {/* Header */}
      <div className="upload-header">
        <h1 className="upload-title">Upload Documents</h1>
        <p className="upload-subtitle">Upload PDF documents for AI-powered analysis and Q&A</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`dropzone ${dragging ? "dropzone-active" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          style={{ display: "none" }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
        />
        <div className="dropzone-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="dropzone-title">Drag & drop PDF files here</p>
        <p className="dropzone-sub">or click to browse files</p>
        <p className="dropzone-hint">Supported format: PDF · Max 50MB per file</p>
      </div>

      {/* Uploaded Documents List */}
      {files.length > 0 && (
        <div className="uploaded-heading">
            <h2>Uploaded Documents ({files.length})</h2>
        <div className="uploaded-section">
          <div className="file-list">
            {files.map((file) => (
              <div key={file.id} className="file-item">
                <div className="file-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="file-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-meta">{file.size} · {file.date}</p>
                </div>
                <div className="file-actions">
                  <span className="file-status">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Ready
                  </span>
                  <button className="file-remove" onClick={() => handleRemove(file.id)} title="Remove">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
      )}
    </div>
  );
};

export default UploadDocuments;