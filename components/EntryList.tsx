"use client";

import { useEffect, useState } from "react";
import { getDb } from "@/lib/db";
import { getReflection } from "@/lib/ollama";
import MoodChart from "@/components/MoodChart";

type Entry = {
  id: number;
  date: string;
  content: string;
  mood: string;
  created_at: string;
};

export default function EntryList({ refreshKey }: { refreshKey: number }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [reflection, setReflection] = useState("");
  const [reflecting, setReflecting] = useState(false);
  const [reflectError, setReflectError] = useState("");

  useEffect(() => {
    loadEntries();
  }, [refreshKey]);

  async function loadEntries() {
    setLoading(true);
    const db = await getDb();
    const result = db.exec("SELECT * FROM entries ORDER BY created_at DESC");

    if (result.length === 0) {
      setEntries([]);
      setLoading(false);
      return;
    }

    const columns = result[0].columns;
    const rows = result[0].values.map((row) => {
      const obj: any = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj as Entry;
    });

    setEntries(rows);
    setLoading(false);
  }

  async function handleReflect() {
    setReflecting(true);
    setReflectError("");
    setReflection("");

    try {
      const recentEntries = entries.slice(0, 7).map((e) => e.content);
      const result = await getReflection(recentEntries);
      setReflection(result);
    } catch (err) {
      setReflectError("Couldn't generate a reflection. Make sure Ollama is running locally.");
    } finally {
      setReflecting(false);
    }
  }

  if (loading) return <p className="text-muted mt-6">Loading entries...</p>;

  return (
    <div className="mt-8">
      {entries.length > 0 && (
        <button
          onClick={handleReflect}
          disabled={reflecting}
          className="mb-5 bg-surface border border-amber/30 text-amber font-medium px-5 py-2.5 rounded-full hover:bg-amber/10 disabled:opacity-50 transition-colors"
        >
          {reflecting ? "Reflecting..." : "🪞 Reflect on Recent Entries"}
        </button>
      )}

      {reflectError && <p className="text-red-400 text-sm mb-4">{reflectError}</p>}

      {reflection && (
        <div className="border border-amber/30 bg-amber/5 rounded-2xl p-5 mb-6">
          <p className="text-amber text-xs font-medium tracking-wide uppercase mb-2">Your Reflection</p>
          <p className="text-soft leading-relaxed">{reflection}</p>
        </div>
      )}

      {entries.length >= 2 && <MoodChart entries={entries} />}


      {entries.length === 0 ? (
        <p className="text-muted">No entries yet. Write your first one above.</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="border border-white/5 bg-surface/50 rounded-xl p-4">
              <div className="flex justify-between text-xs text-muted mb-2">
                <span>{entry.date}</span>
                <span>{entry.mood}</span>
              </div>
              <p className="text-soft leading-relaxed">{entry.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}