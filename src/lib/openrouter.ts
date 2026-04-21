const SYSTEM_PROMPT = `You are a structured-output AI agent inside a production system.

Your ONLY job is to return valid JSON that strictly matches the provided schema.

Rules:
- Output ONLY raw JSON.
- Do NOT include markdown, code fences, explanations, or extra text.
- Do NOT prefix or suffix anything.
- If unsure, return the closest valid JSON structure.
- Never return null. Always return all required fields.
- Keep values concise and realistic for Indian college students.`;

/**
 * Call Gemma via OpenRouter as a fallback when Gemini is unavailable.
 * Uses google/gemma-3-27b-it for structured JSON output.
 */
export async function callGemma(prompt: string): Promise<any> {
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://triggernudge.app",
      "X-Title": "TriggerNudge",
    },
    body: JSON.stringify({
      model: "google/gemma-3-27b-it:free",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("OpenRouter/Gemma error:", errorBody);
    throw new Error(`Gemma API failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  let text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("Empty response from Gemma");
  }

  // Gemma is less strict — aggressively clean the output
  text = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .replace(/^[^{[]*/, "")     // strip any text before the JSON
    .replace(/[^}\]]*$/, "")    // strip any text after the JSON
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Raw Gemma output:", text);
    throw new Error("Invalid JSON from Gemma");
  }
}
