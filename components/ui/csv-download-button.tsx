"use client";

import { Download } from "lucide-react";

type CsvDownloadButtonProps = {
  filename: string;
  label: string;
  rows: string[][];
  className: string;
};

export function CsvDownloadButton({
  filename,
  label,
  rows,
  className,
}: CsvDownloadButtonProps) {
  function downloadCsv() {
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <button type="button" onClick={downloadCsv} className={className}>
      <Download className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
