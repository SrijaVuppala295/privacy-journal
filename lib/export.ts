import { getDb } from "./db";

export async function exportDb() {
  const db = await getDb();
  const data = db.export();
  const blob = new Blob([data.buffer as ArrayBuffer], { type: "application/octet-stream" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `journal-backup-${new Date().toISOString().split("T")[0]}.db`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importDb(file: File): Promise<void> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Save directly into localStorage in the same format getDb() expects
  localStorage.setItem("journal-db", JSON.stringify(Array.from(bytes)));

  // Force a page reload so getDb() picks up the new data fresh
  window.location.reload();
}