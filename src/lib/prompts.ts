export const PATTERN_PROMPT = (log: string) => `
Task: Analyze a student's food log and extract behavioral eating patterns.

Context:
- Indian college student
- hostel/campus environment
- typical foods: maggi, samosa, chai, biryani, snacks

Input:
${log}

Instructions:
1. Extract events:
   - time
   - food
   - mood
   - context (exam, boredom, friends, etc.)

2. Group into 2–5 patterns:
   - name (max 5 words)
   - timeRange (e.g., "11pm-1am")
   - foods (array)
   - mood (dominant)
   - risk: "low" | "medium" | "high"

Risk rules:
- high → late-night + fried/sugary + frequent
- medium → moderate timing or food
- low → balanced or daytime light meals

Output JSON:
{
  "patterns": [
    {
      "name": "",
      "timeRange": "",
      "foods": [],
      "mood": "",
      "risk": "low" | "medium" | "high"
    }
  ]
}
`;

export const DANGER_PROMPT = (patterns: string) => `
Task: Identify high-risk eating windows.

Input:
${patterns}

Instructions:
- Merge patterns into 2–3 danger windows
- Each window:
  - timeRange
  - reason (short, behavioral explanation)
  - risk

Risk logic:
- high → late-night + heavy food + stress
- medium → moderate timing or frequency
- low → occasional or low-impact

Output JSON:
{
  "windows": [
    {
      "timeRange": "",
      "reason": "",
      "risk": "low" | "medium" | "high"
    }
  ]
}
`;

export const NUDGE_PROMPT = (persona: string, windows: string) => `
Task: Generate realistic food nudges for Indian students.

Input:
Persona:
${persona}

Danger Windows:
${windows}

Constraints:
- Use Indian hostel/canteen food
- No extreme diets
- Suggest swaps or small changes
- Respect budget: low/medium/high

Instructions:
- For each window, give 1–2 nudges
- Keep actions practical this week

Output JSON:
{
  "nudges": [
    {
      "title": "",
      "action": "",
      "benefit": ""
    }
  ]
}
`;
