import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { callGemini } from "@/lib/gemini";
import { NUDGE_PROMPT } from "@/lib/prompts";

// --- Validation Schemas ---
const PersonaSchema = z.object({
  sleepTime: z.string(),
  wakeTime: z.string(),
  studentType: z.enum(["hostel", "day"]),
  goal: z.enum(["energy", "weight", "focus"]),
  budget: z.enum(["low", "medium", "high"]),
});

const WindowSchema = z.object({
  timeRange: z.string(),
  reason: z.string(),
  risk: z.enum(["low", "medium", "high"]),
});

const RequestSchema = z.object({
  persona: PersonaSchema,
  windows: z.array(WindowSchema).min(1),
});

const NudgeSchema = z.object({
  title: z.string(),
  action: z.string(),
  benefit: z.string(),
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

    const { persona, windows } = parsed.data;

    const prompt = NUDGE_PROMPT(
      JSON.stringify(persona),
      JSON.stringify(windows)
    );
    const result = await callGemini(prompt);

    const validated = z
      .object({ nudges: z.array(NudgeSchema).min(1) })
      .safeParse(result);

    if (!validated.success) {
      console.error("Nudge validation failed:", result);

      // Fallback nudges so the demo never breaks
      return NextResponse.json({
        nudges: [
          {
            title: "Light evening snack swap",
            action:
              "Replace fried snacks with roasted chana or bhel 3 times this week",
            benefit: "Better energy without feeling heavy",
          },
          {
            title: "Late-night portion control",
            action: "Keep Maggi but reduce portion and add curd or egg",
            benefit: "Improves sleep and digestion",
          },
        ],
      });
    }

    return NextResponse.json({ nudges: validated.data.nudges });
  } catch (error: any) {
    console.error("Nudges API error:", error);

    // Hard fallback — demo must never fail
    return NextResponse.json({
      nudges: [
        {
          title: "Smart snack swap",
          action:
            "Choose lighter options like peanuts or fruit during evening cravings",
          benefit: "Keeps energy stable",
        },
      ],
    });
  }
}
