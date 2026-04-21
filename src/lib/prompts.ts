const MASTER_SYSTEM_PROMPT = `
You are a production-grade AI system used in a hackathon evaluation.

Your goals:
- Provide structured, reliable, and explainable outputs
- Be concise but meaningful
- Avoid hallucinations
- Always return valid JSON

Rules:
- Output ONLY JSON
- No markdown, no explanation outside JSON
- Always include reasoning in short form
- Ensure outputs are realistic for Indian college students
`;

export const PATTERN_PROMPT = (log: string) => `
${MASTER_SYSTEM_PROMPT}

Task: Analyze a student's eating log and extract behavioral patterns.

Input:
${log}

Steps:
1. Extract events:
- time
- food
- mood
- context

2. Group into patterns:
- name (max 5 words)
- timeRange
- foods (array)
- mood
- risk (low/medium/high)
- reasoning (why this pattern is risky)

Risk Rules:
- high → late night + heavy + frequent
- medium → moderate timing or food
- low → balanced or occasional

Output JSON:
{
  "patterns": [
    {
      "name": "",
      "timeRange": "",
      "foods": [],
      "mood": "",
      "risk": "low" | "medium" | "high",
      "reasoning": ""
    }
  ]
}
`;

export const DANGER_PROMPT = (patterns: string) => `
${MASTER_SYSTEM_PROMPT}

Task: Identify the most critical eating risk windows.

Input:
${patterns}

Steps:
- Merge patterns into 2–3 key time windows
- Focus on behavioral triggers

Each window must include:
- timeRange
- risk
- reason (behavioral cause)
- impact (how it affects energy, sleep, or focus)

Output JSON:
{
  "windows": [
    {
      "timeRange": "",
      "risk": "low" | "medium" | "high",
      "reason": "",
      "impact": ""
    }
  ]
}
`;

export const NUDGE_PROMPT = (persona: string, windows: string) => `
${MASTER_SYSTEM_PROMPT}

Task: Generate practical nudges for improving eating behavior.

Input:
Persona:
${persona}

Danger Windows:
${windows}

Constraints:
- Use Indian hostel/canteen food
- No strict dieting
- Respect budget
- Focus on small realistic changes

For each window:
- 1–2 nudges

Each nudge must include:
- title
- action
- benefit (energy/focus/sleep)
- reasoning (why this works)

Output JSON:
{
  "nudges": [
    {
      "title": "",
      "action": "",
      "benefit": "energy" | "focus" | "sleep",
      "reasoning": ""
    }
  ]
}
`;
