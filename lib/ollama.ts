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