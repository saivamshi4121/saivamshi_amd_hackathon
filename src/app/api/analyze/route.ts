import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callGemini } from "@/lib/gemini";
import { PATTERN_PROMPT, DANGER_PROMPT } from "@/lib/prompts";

// --- Validation Schemas ---
const RequestSchema = z.object({
  persona: z.object({
    sleepTime: z.string(),
    wakeTime: z.string(),
    studentType: z.enum(["hostel", "day"]),
    goal: z.enum(["energy", "weight", "focus"]),
    budget: z.enum(["low", "medium", "high"]),
  }),
  log: z.string().min(10, "Log is too short"),
});

const PatternSchema = z.object({
  name: z.string(),
  timeRange: z.string(),
  foods: z.array(z.string()),
  mood: z.string(),
  risk: z
    .string()
    .transform((v) => v.toLowerCase() as "low" | "medium" | "high")
    .pipe(z.enum(["low", "medium", "high"])),
});

const WindowSchema = z.object({
  timeRange: z.string(),
  reason: z.string(),
  risk: z
    .string()
    .transform((v) => v.toLowerCase() as "low" | "medium" | "high")
    .pipe(z.enum(["low", "medium", "high"])),
});

// --- Route Handler ---
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { log } = parsed.data;

    // 1. Pattern Agent
    const patternResult = await callGemini(PATTERN_PROMPT(log));
    const validatedPatterns = z
      .object({ patterns: z.array(PatternSchema) })
      .safeParse(patternResult);

    if (!validatedPatterns.success) {
      console.error("Pattern validation failed:", patternResult);
      return NextResponse.json(
        { error: "Invalid pattern response from AI" },
        { status: 500 }
      );
    }

    const patterns = validatedPatterns.data.patterns;

    // 2. Danger Agent
    const dangerResult = await callGemini(
      DANGER_PROMPT(JSON.stringify(patterns))
    );
    const validatedWindows = z
      .object({ windows: z.array(WindowSchema) })
      .safeParse(dangerResult);

    if (!validatedWindows.success) {
      console.error("Window validation failed:", dangerResult);
      return NextResponse.json(
        { error: "Invalid danger window response from AI" },
        { status: 500 }
      );
    }

    const windows = validatedWindows.data.windows;

    return NextResponse.json({ patterns, windows });
  } catch (error: any) {
    console.error("Analyze API error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
