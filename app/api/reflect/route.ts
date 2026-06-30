import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { entries } = await req.json();

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return NextResponse.json(
        { error: "No entries provided." },
        { status: 400 }
      );
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
      body: JSON.stringify({
        model: "llama3.2:1b",
        prompt,
        stream: false,
      }),
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