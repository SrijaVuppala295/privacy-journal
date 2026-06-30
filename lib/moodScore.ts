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