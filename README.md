# 🔒 Quiet — A Privacy-First AI Journal

> Your thoughts, your device, your AI. Nothing ever leaves your laptop.

**🔗 Live Demo:** [https://privacy-journal-delta.vercel.app/](https://privacy-journal-delta.vercel.app/)

*(Note: writing entries and viewing your mood chart works fully on the live link. The AI "Reflect" feature only works when you run the project locally — explained in detail below, this is intentional, not a bug!)*

![Home Screen](./Home.png)

---

## 📖 Table of Contents

1. [Introduction & Problem Statement](#1-introduction--problem-statement)
2. [Architecture](#2-architecture)
3. [Tech Stack & Why Each Tool Was Chosen](#3-tech-stack--why-each-tool-was-chosen)
4. [Project Structure](#4-project-structure)
5. [Concepts You'll Learn](#5-concepts-youll-learn)
6. [Local Setup Guide (Step-by-Step)](#6-local-setup-guide-step-by-step)
7. [Full Code Walkthrough — Every File Explained](#7-full-code-walkthrough--every-file-explained)
8. [Styling & Design System](#8-styling--design-system)
9. [Deployment Guide (GitHub + Vercel)](#9-deployment-guide-github--vercel)
10. [Known Limitations](#10-known-limitations)
11. [What You Could Build Next](#11-what-you-could-build-next)
12. [Screenshots](#12-screenshots)

---

## 1. Introduction & Problem Statement

### What is this?

**Quiet** is a personal journaling app. You write daily entries, tag your mood, and can ask an AI to reflect on patterns across your recent entries — like a gentle companion noticing how you've been feeling lately.

### The problem

Most "AI journal" apps work like this: you write your most private thoughts, the app sends that text to a company's cloud servers (usually OpenAI or similar), an AI model runs *there*, and a response comes back. That means a company's infrastructure processes your stress, your relationships, your secrets — every single time you write.

That's backwards for something that's supposed to be a private journal. A journal should be the one digital space that's unconditionally yours.

### The question this project answers

**Can AI genuinely help with self-reflection without ever sending your data anywhere?**

Yes — and this project proves it. Every entry you write is stored only in your own browser. The AI that reflects on your entries is a small language model running directly on your computer via a tool called **Ollama** — not a cloud API, not a subscription, not a server anywhere. If you disconnect your WiFi entirely, the AI reflection still works.

---

## 2. Architecture

Here's the full data flow, end to end:

```
┌─────────────────────────────────────────────────────────────┐
│                         YOUR BROWSER                         │
│                                                               │
│   ┌─────────────┐      ┌──────────────┐      ┌────────────┐ │
│   │ EntryForm   │─────▶│  SQLite WASM │◀─────│ EntryList  │ │
│   │ (write)     │      │  (lib/db.ts) │      │ (read)     │ │
│   └─────────────┘      └──────┬───────┘      └─────┬──────┘ │
│                                │ persists to         │        │
│                         localStorage          MoodChart      │
│                                                       │        │
└───────────────────────────────────────────────────────┼────────┘
                                                          │
                                              "Reflect" clicked
                                                          │
                                                          ▼
                                          ┌───────────────────────┐
                                          │  Next.js API Route     │
                                          │  /api/reflect           │
                                          │  (runs on your machine, │
                                          │   server-side)          │
                                          └───────────┬────────────┘
                                                       │
                                                       ▼
                                          ┌───────────────────────┐
                                          │  Ollama (localhost)    │
                                          │  Llama 3.2 1B model     │
                                          │  — runs entirely        │
                                          │  on your hardware       │
                                          └───────────┬────────────┘
                                                       │
                                          generated reflection text
                                                       │
                                                       ▼
                                          back to EntryList → displayed
```

**The key architectural decision:** the browser never talks to Ollama directly. It talks to our *own* Next.js server (`/api/reflect`), which then talks to Ollama. This avoids browser CORS restrictions and keeps all AI logic in one place server-side, which is just good practice even outside this project.

---

## 3. Tech Stack & Why Each Tool Was Chosen

| Tool | What It Does Here | Why This Specifically |
|---|---|---|
| **Next.js 16 (App Router) + TypeScript** | Framework for pages, routing, and the API route | Has built-in backend API routes, so we don't need a separate server. TypeScript catches mistakes before runtime. |
| **sql.js (SQLite → WebAssembly)** | The database | Lets a real SQL database run entirely *inside the browser*, so journal data never needs a server. |
| **Ollama** | Runs the AI model locally | Simplest way to download and run open-source LLMs on your own machine with a local API — no API key, no cost, no cloud. |
| **Llama 3.2 (1B parameters)** | Generates the reflections | Small enough to run smoothly on any laptop (no GPU needed), while still capable of warm, coherent writing. |
| **Tailwind CSS v4** | All styling | Utility-first CSS with a CSS-native theme system (`@theme`) — fast to build a custom design without separate stylesheets. |
| **Recharts** | The mood trend line chart | Well-documented React charting library, easy to theme to match our dark design. |

---

## 4. Project Structure

```
privacy-journal/
├── app/
│   ├── page.tsx                  → Landing page
│   ├── layout.tsx                → Root layout (fonts, metadata)
│   ├── globals.css               → Design tokens + Tailwind setup
│   ├── journal/
│   │   └── page.tsx              → The actual journal app page
│   └── api/
│       └── reflect/
│           └── route.ts          → Server route that calls Ollama
├── components/
│   ├── EntryForm.tsx              → Write a new entry + pick mood
│   ├── EntryList.tsx              → Shows entries + Reflect button
│   └── MoodChart.tsx              → Mood-over-time line chart
├── lib/
│   ├── db.ts                      → Local SQLite (WASM) database setup
│   ├── ollama.ts                   → Calls our own /api/reflect route
│   ├── export.ts                   → Backup/restore as a downloadable file
│   └── moodScore.ts                 → Converts mood emoji → number
├── public/
│   └── *.wasm                       → SQLite WebAssembly engine files
└── README.md
```

---

## 5. Concepts You'll Learn

1. Running a local LLM (Ollama) entirely offline
2. WebAssembly databases — a real SQL database running inside a browser
3. Building your own Next.js API route as a lightweight backend
4. Client-side persistence with `localStorage` and its limitations
5. File-based backup/restore patterns
6. Prompt engineering basics
7. Custom design systems with Tailwind v4's CSS-based theming
8. Charting with Recharts, themed to match a custom UI

---

## 6. Local Setup Guide (Step-by-Step)

### Step 1: Install the required tools

1. **Node.js** (v18+): [nodejs.org](https://nodejs.org)
2. **Git**: [git-scm.com](https://git-scm.com)
3. **Ollama**: [ollama.com](https://ollama.com)

Check they're installed:
```bash
node -v
git -v
```

### Step 2: Clone the project

```bash
git clone https://github.com/SrijaVuppala295/privacy-journal.git
cd privacy-journal
```

### Step 3: Install dependencies

```bash
npm install
```

### Step 4: Copy the SQLite WASM engine files into `public/`

```bash
# Windows PowerShell
Copy-Item node_modules\sql.js\dist\*.wasm public\

# Mac/Linux
cp node_modules/sql.js/dist/*.wasm public/
```

### Step 5: Download the local AI model (one-time, ~1.3GB)

```bash
ollama pull llama3.2:1b
```

### Step 6: Start the AI model (keep this terminal open)

```bash
ollama run llama3.2:1b
```

Wait for the `>>>` prompt — that means it's ready. Leave it running.

### Step 7: Start the app (in a new terminal)

```bash
npm run dev
```

### Step 8: Open it

```
http://localhost:3000
```

Click "Start Writing," write an entry, click "🪞 Reflect on Recent Entries."

---

## 7. Full Code Walkthrough — Every File Explained

### `app/layout.tsx` — Root Layout

```tsx
import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Quiet — A Private Journal",
  description: "Your thoughts, kept on your device. No cloud, no accounts, no tracking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-body bg-ink text-soft`}>
        {children}
      </body>
    </html>
  );
}
```

**What it does:** every page in a Next.js App Router project is wrapped by this layout. It loads two Google Fonts (`Fraunces` for headlines, `Inter` for body text) and exposes them as CSS variables (`--font-display`, `--font-body`), which our Tailwind theme references. It also sets the page `<title>` and description (used by browsers and search engines), and applies our base background/text colors globally so every page starts with the right theme.

---

### `app/globals.css` — Design Tokens

```css
@import "tailwindcss";

@theme {
  --color-ink: #16151D;
  --color-surface: #211F2B;
  --color-amber: #E8A65C;
  --color-soft: #F2EEE6;
  --color-muted: #8C8898;

  --font-display: var(--font-display), serif;
  --font-body: var(--font-body), sans-serif;
}

body {
  background: var(--color-ink);
  color: var(--color-soft);
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}
.animate-pulse-slow {
  animation: pulse-slow 6s ease-in-out infinite;
}
```

**What it does:** Tailwind CSS v4 introduced a CSS-native way to define design tokens using `@theme`, instead of the old `tailwind.config.js` JavaScript file. Every variable defined here (like `--color-amber`) automatically becomes usable as a utility class (`bg-amber`, `text-amber`, `border-amber`) anywhere in the project. The `@keyframes` block defines a custom slow pulsing animation used for the ambient glow on the landing page.

---

### `app/page.tsx` — Landing Page

```tsx
import Link from "next/link";

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] bg-amber/10 rounded-full blur-[120px] -top-40 -right-20 animate-pulse-slow" />
      <div className="absolute w-[400px] h-[400px] bg-amber/5 rounded-full blur-[100px] bottom-0 left-10" />

      <div className="relative z-10 max-w-xl text-center">
        <p className="text-muted text-sm tracking-widest uppercase mb-6">
          A private space to think
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-medium leading-tight mb-6">
          Write it down.
          <br />
          <span className="text-amber italic">Keep it yours.</span>
        </h1>
        <p className="text-muted text-lg mb-10 leading-relaxed">
          Quiet is a journal that never leaves your device. No accounts,
          no cloud, no one reading your words — including the AI that
          reflects on them.
        </p>

        <Link
          href="/journal"
          className="inline-block bg-amber text-ink font-medium px-8 py-3 rounded-full hover:bg-amber/90 transition-colors"
        >
          Start writing →
        </Link>

        <div className="mt-16 grid grid-cols-3 gap-6 text-left">
          <div>
            <p className="font-display text-amber text-2xl mb-1">100%</p>
            <p className="text-muted text-sm">Stored on your device</p>
          </div>
          <div>
            <p className="font-display text-amber text-2xl mb-1">0</p>
            <p className="text-muted text-sm">Servers involved</p>
          </div>
          <div>
            <p className="font-display text-amber text-2xl mb-1">Local</p>
            <p className="text-muted text-sm">AI reflections, on-device</p>
          </div>
        </div>
      </div>
    </main>
  );
}
```

**What it does:** this is the marketing/pitch page — the first thing visitors see. The two `absolute`-positioned divs with `blur` and `animate-pulse-slow` create the signature ambient glow effect behind the headline, giving the page a calm, candlelit feel rather than a sharp corporate look. The three-column grid at the bottom (`100% / 0 / Local`) communicates the privacy pitch visually instead of just in a paragraph.

---

### `app/journal/page.tsx` — The Journal App

```tsx
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
```

**What it does:** this is the "real app" page. It's marked `"use client"` because it uses React state (`useState`) and event handlers, which only work in client-rendered components in the App Router. The `refreshKey` state is a simple trick: every time a new entry is saved, we increment this number, which we pass down to `EntryList` — since it's a prop, React re-runs `EntryList`'s data-loading effect whenever it changes, refreshing the displayed entries without any complex state management library.

---

### `app/api/reflect/route.ts` — The AI Backend Route

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { entries } = await req.json();

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json({ error: "No entries provided." }, { status: 400 });
    }

    const combinedText = entries.join("\n---\n");

    const prompt = `You are a gentle, thoughtful journaling companion. 
Below are someone's last few journal entries. Read them and offer a short, 
warm reflection (2-3 sentences) noticing any patterns in mood or themes. 
Do not give advice unless it feels natural. Be human, not clinical.

Entries:
${combinedText}

Reflection:`;

    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3.2:1b", prompt, stream: false }),
    });

    if (!ollamaRes.ok) {
      throw new Error("Ollama did not respond. Is it running?");
    }

    const data = await ollamaRes.json();
    return NextResponse.json({ reflection: data.response });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate reflection. Make sure Ollama is running locally (ollama run llama3.2:1b)." },
      { status: 500 }
    );
  }
}
```

**What it does:** this file lives at `app/api/reflect/route.ts`, and in Next.js's App Router, any file named `route.ts` inside `app/api/...` automatically becomes a backend HTTP endpoint — here, `POST /api/reflect`. It receives the journal entries from the frontend, builds one carefully worded prompt instructing the AI to act warm and pattern-aware (this single paragraph *is* the entire "AI agent" — no complex framework needed), sends it to Ollama's local API at `localhost:11434`, and returns the generated text. The `try/catch` ensures that if Ollama isn't running, the user gets a clear, specific error message instead of a vague crash.

---

### `lib/db.ts` — Local Database Setup

```typescript
import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

export async function getDb(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `/${file}`,
  });

  const savedData = localStorage.getItem('journal-db');
  if (savedData) {
    const buffer = Uint8Array.from(JSON.parse(savedData));
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        content TEXT NOT NULL,
        mood TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);
  }

  return db;
}

export function saveDb() {
  if (!db) return;
  const data = db.export();
  localStorage.setItem('journal-db', JSON.stringify(Array.from(data)));
}
```

**What it does:** `initSqlJs` boots up a full SQLite engine compiled to WebAssembly, directly inside the browser. `locateFile` points it at our own `public/` folder for the `.wasm` engine files instead of fetching them from the internet — keeping the *entire* stack local, including the database engine itself. On first load, if no saved database exists in `localStorage`, we create a new one with a single `entries` table. `saveDb()` exports the whole database back into `localStorage` as a JSON array of bytes — this is what makes your entries survive a page refresh.

---

### `lib/ollama.ts` — Frontend AI Helper

```typescript
export async function getReflection(entries: string[]): Promise<string> {
  const res = await fetch("/api/reflect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entries }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to get reflection.");
  }

  const data = await res.json();
  return data.reflection;
}
```

**What it does:** a small, clean wrapper function the UI components call instead of writing `fetch` logic directly inside a component. It calls our *own* `/api/reflect` route (a relative path — no CORS issue, since it's the same origin), and either returns the reflection text or throws a clear error that the UI can catch and display.

---

### `lib/export.ts` — Backup & Restore

```typescript
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
  localStorage.setItem("journal-db", JSON.stringify(Array.from(bytes)));
  window.location.reload();
}
```

**What it does:** `exportDb()` converts the live database into raw bytes, wraps them in a `Blob` (browser-native file-like object), and simulates a click on an invisible download link — triggering a real `.db` file download named with today's date. `importDb()` does the reverse: reads an uploaded file's bytes and overwrites what's stored in `localStorage`, then reloads the page so `getDb()` picks up the restored data fresh. This gives users a literal, portable file they own — proof of "your data, your control."

---

### `lib/moodScore.ts` — Mood-to-Number Mapping

```typescript
const MOOD_SCORES: Record<string, number> = {
  "😔 Low": 1,
  "😤 Stressed": 2,
  "😐 Neutral": 3,
  "😊 Good": 4,
  "🥳 Great": 5,
};

export function moodToScore(mood: string): number {
  return MOOD_SCORES[mood] ?? 3;
}
```

**What it does:** charts need numbers, not emoji strings. This tiny lookup table maps each mood option to a 1–5 scale so `MoodChart.tsx` can plot a meaningful line. The `?? 3` fallback means if an unrecognized mood string ever sneaks in, it defaults to "Neutral" rather than crashing.

---

### `components/EntryForm.tsx` — Writing a New Entry

```tsx
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
```

**What it does:** a controlled form — `content` and `mood` are React state, updated as the user types/clicks. `handleSave` runs a parameterized SQL `INSERT` (the `?` placeholders prevent SQL injection by safely substituting actual values), persists the database, clears the textbox, and calls `onSaved()` — the callback passed in from the parent page that bumps `refreshKey`, telling `EntryList` to reload.

---

### `components/EntryList.tsx` — Displaying Entries + Reflect

```tsx
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
      columns.forEach((col, i) => { obj[col] = row[i]; });
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
```

**What it does:** on mount (and whenever `refreshKey` changes), `loadEntries()` runs a `SELECT *` query against the local database. `sql.js` returns raw `columns` and `values` arrays rather than friendly objects, so we manually zip them into `{date, content, mood}`-shaped objects React can render normally. `handleReflect()` takes the 7 most recent entries' text, sends them through `getReflection()`, and displays the result in a highlighted box — with explicit error handling if Ollama isn't reachable.

---

### `components/MoodChart.tsx` — Mood Trend Visualization

```tsx
"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { moodToScore } from "@/lib/moodScore";

type Entry = { date: string; mood: string };

export default function MoodChart({ entries }: { entries: Entry[] }) {
  const chartData = [...entries]
    .reverse()
    .map((e) => ({ date: e.date.slice(5), score: moodToScore(e.mood), mood: e.mood }));

  if (chartData.length < 2) {
    return <p className="text-muted text-sm mb-6">Write a few more entries to see your mood trend here.</p>;
  }

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5 mb-6">
      <p className="text-amber text-xs font-medium tracking-wide uppercase mb-4">Mood Trend</p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="date" stroke="#8C8898" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} stroke="#8C8898" fontSize={12} tickLine={false} axisLine={false} width={20} />
          <Tooltip
            contentStyle={{ background: "#211F2B", border: "1px solid #ffffff20", borderRadius: "8px", color: "#F2EEE6" }}
            formatter={(_value, _name, props) => [props.payload.mood, "Mood"]}
          />
          <Line type="monotone" dataKey="score" stroke="#E8A65C" strokeWidth={2} dot={{ fill: "#E8A65C", r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**What it does:** `entries.reverse()` flips the order so the chart reads left-to-right, oldest to newest (the natural reading direction for a timeline). `moodToScore` converts each emoji mood into a 1–5 number for the Y-axis. Every visual property — grid lines, axis colors, tooltip background — is manually themed to match our amber/ink palette instead of using Recharts' default blue/green styling.

---

## 8. Styling & Design System

| Token | Value | Reasoning |
|---|---|---|
| `ink` | `#16151D` | Deep, calm near-black — quiet, low-stimulation, not a bright "appy" feel |
| `surface` | `#211F2B` | Slightly lighter than background, used for cards — subtle depth |
| `amber` | `#E8A65C` | Warm, candlelight-like accent, used sparingly for buttons/highlights |
| `soft` | `#F2EEE6` | Warm off-white text, easier on the eyes than pure white |
| `muted` | `#8C8898` | Secondary text — dates, labels |

**Fonts:** `Fraunces` (serif, characterful) for headlines — feels literary/handwritten, fitting a journal. `Inter` (clean sans-serif) for functional UI text — buttons, entries, labels — prioritizing readability.

---

## 9. Deployment Guide (GitHub + Vercel)

> **Important:** Ollama runs on *your* computer, not in the cloud. Vercel has no access to your local machine. The deployed site fully supports writing entries and viewing the mood chart (all client-side), but the AI "Reflect" feature only works for visitors who clone the repo and run Ollama locally. This is explained directly in the deployed UI.

### A. Push to GitHub

**1. Add a `.gitignore`:**
```
node_modules/
.next/
out/
.env*.local
.env
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel
*.tsbuildinfo
next-env.d.ts
```

**2. Create the GitHub repo** at [github.com/new](https://github.com/new) — name it, keep it public, don't initialize with a README (you already have one).

**3. Push:**
```bash
git init
git add .
git commit -m "Initial commit: privacy-first AI journal"
git branch -M main
git remote add origin https://github.com/SrijaVuppala295/privacy-journal.git
git push -u origin main
```

### B. Deploy to Vercel

1. Sign up at [vercel.com](https://vercel.com) using your GitHub account
2. **Add New → Project**, import `privacy-journal`
3. Leave default Next.js settings, click **Deploy**
4. Live in ~1-2 minutes at a URL like `privacy-journal-yourname.vercel.app`

**Live deployment for this project:** [https://privacy-journal-delta.vercel.app/](https://privacy-journal-delta.vercel.app/)

---

## 10. Known Limitations

- AI reflections require Ollama running locally — by design
- Data lives in browser `localStorage`; clearing site data or switching browsers loses entries unless backed up first
- `llama3.2:1b` trades some sophistication for speed and accessibility on any hardware

---

## 11. What You Could Build Next

- Semantic search over past entries using local embeddings
- Voice-to-text journaling
- Password-encrypted backup exports
- Model picker (swap in a bigger local model if hardware allows)
- Weekly/monthly mood summaries

---

## 12. Screenshots

| Landing Page | Journal View | Mood Reflection |
|---|---|---|
| ![Landing](./screenshots/Home.png) | ![Journal](./screenshots/Journal.png) | ![Reflection](./screenshots/Reflection.png) |

| Mood Trend Chart |
|---|
| ![Graph](./screenshots/Graph.png) |

---

Built for the [Codédex](https://codedex.io) Project Tutorial Monthly Challenge. 🌱
