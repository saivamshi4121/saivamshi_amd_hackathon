import { callGemma } from "./openrouter";

// ─── Primary: Gemini 2.5 Flash ──────────────────────────────
async function callGeminiDirect(prompt: string): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("Gemini API error:", errorBody);
    throw new Error(`Gemini API failed: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  let text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Empty response from Gemini");
  }

  text = text.replace(/```json\n?/g, "").replace(/\n?```/g, "").trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Raw Gemini output:", text);
    throw new Error("Invalid JSON from Gemini");
  }
}

// ─── Retry wrapper for Gemini ───────────────────────────────
async function callGeminiWithRetry(
  prompt: string,
  maxRetries = 1
): Promise<any> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await callGeminiDirect(prompt);
    } catch (err: any) {
      lastError = err;
      const isRetryable =
        err.message?.includes("503") || err.message?.includes("429");

      if (isRetryable && attempt < maxRetries) {
        const delay = 1000 * Math.pow(2, attempt);
        console.log(
          `Gemini transient error. Retrying in ${delay}ms (${attempt + 1}/${maxRetries})...`
        );
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
  throw lastError;
}

// ─── Exported: Gemini → Gemma fallback chain ────────────────

import { MOCK_PATTERNS, MOCK_WINDOWS, MOCK_NUDGES } from "./mockData";


/**
 * Primary call path:
 *   1. Try Gemini 2.5 Flash (with 1 retry on 503/429)
 *   2. If Gemini fails entirely, fall back to Gemma via OpenRouter
 *   3. If Gemma fails (Rate limited), return high-quality Mock Data (Safe Mode)
 */
export async function callGemini(prompt: string): Promise<any> {
  try {
    return await callGeminiWithRetry(prompt, 1);
  } catch (geminiError: any) {
    console.warn(
      `⚠ Gemini failed (${geminiError.message}). Falling back to Gemma...`
    );

    try {
      return await callGemma(prompt);
    } catch (gemmaError: any) {
      console.error(`✗ Gemma fallback failed: ${gemmaError.message}`);
      
      // --- EMERGENCY FALLBACK (Safe Mode for Demo) ---
      console.warn("🛡️ ENTERING SAFE MODE: Returning mock data to prevent demo crash.");
      
      // Determine which mock data to return based on the prompt content
      if (prompt.includes("Group into 2–5 patterns")) {
        return { patterns: MOCK_PATTERNS };
      }
      if (prompt.includes("Identify high-risk eating windows")) {
        return { windows: MOCK_WINDOWS };
      }
      if (prompt.includes("Generate realistic food nudges")) {
        return { nudges: MOCK_NUDGES };
      }

      // Default fallback
      return { patterns: [], windows: [], nudges: [] };
    }
  }
}
