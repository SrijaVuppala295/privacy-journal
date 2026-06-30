"use client";

import { useState } from "react";
import { getDb, saveDb } from "@/lib/db";

const MOODS = ["😊 Good", "😐 Neutral", "😔 Low", "😤 Stressed", "🥳 Great"];

export default function EntryForm({ onSaved }: { onSaved: () => void }) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(MOODS[1]);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);

    const db = await getDb();
    const today = new Date().toISOString().split("T")[0];

    db.run(
      "INSERT INTO entries (date, content, mood) VALUES (?, ?, ?)",
      [today, content, mood]
    );
    saveDb();

    setContent("");
    setSaving(false);
    onSaved();
  }

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5 space-y-4 shadow-lg shadow-black/20">
      <textarea
        className="w-full bg-transparent border border-white/10 rounded-xl p-3 min-h-[120px] text-soft placeholder:text-muted focus:outline-none focus:border-amber/60 transition-colors resize-none"
        placeholder="What's on your mind today?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-2 flex-wrap">
        {MOODS.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              mood === m
                ? "bg-amber text-ink border-amber"
                : "border-white/10 text-muted hover:border-amber/50 hover:text-soft"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving || !content.trim()}
        className="bg-amber text-ink font-medium px-5 py-2.5 rounded-full hover:bg-amber/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {saving ? "Saving..." : "Save Entry"}
      </button>
    </div>
  );
}