"use client";

import { useState } from "react";
import EntryForm from "@/components/EntryForm";
import EntryList from "@/components/EntryList";
import { exportDb, importDb } from "@/lib/export";
import Link from "next/link";

export default function Journal() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="max-w-2xl mx-auto p-6 min-h-screen">
      <Link href="/" className="text-muted text-sm hover:text-amber transition-colors">
        ← Back
      </Link>

      <h1 className="font-display text-3xl font-medium mt-4 mb-1">Your Journal</h1>
      <p className="text-muted text-sm mb-6">
        Everything here stays on this device. No cloud, no servers.
      </p>

      <div className="flex gap-3 mb-6">
        <button
          onClick={exportDb}
          className="text-sm border border-surface px-3 py-1 rounded-full text-muted hover:text-amber hover:border-amber transition-colors"
        >
          ⬇️ Export Backup
        </button>

        <label className="text-sm border border-surface px-3 py-1 rounded-full text-muted hover:text-amber hover:border-amber transition-colors cursor-pointer">
          ⬆️ Import Backup
          <input
            type="file"
            accept=".db"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importDb(file);
            }}
          />
        </label>
      </div>

      <EntryForm onSaved={() => setRefreshKey((k) => k + 1)} />
      <EntryList refreshKey={refreshKey} />
    </main>
  );
}