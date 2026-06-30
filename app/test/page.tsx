"use client";

import { useState } from "react";

export default function TestPage() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function runTest() {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/reflect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries: [
            "Today was stressful, had three meetings back to back.",
            "Felt a bit better today, went for a walk in the evening.",
            "Stressful day again, didn't get much sleep.",
          ],
        }),
      });

      const data = await res.json();
      setResult(data.reflection || data.error);
    } catch (err) {
      setResult("Request failed: " + String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "2rem" }}>
      <button onClick={runTest} disabled={loading}>
        {loading ? "Thinking..." : "Test Reflection API"}
      </button>
      <p style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>{result}</p>
    </div>
  );
}