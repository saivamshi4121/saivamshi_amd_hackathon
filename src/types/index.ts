export interface Persona {
  sleepTime: string;
  wakeTime: string;
  studentType: "hostel" | "day";
  goal: "energy" | "focus" | "weight";
  budget: "low" | "medium" | "high";
}

export interface Pattern {
  name: string;
  timeRange: string;
  foods: string[];
  mood: string;
  risk: "low" | "medium" | "high";
  reasoning: string; // New: Explainable AI
}

export interface DangerWindow {
  timeRange: string;
  risk: "low" | "medium" | "high";
  reason: string;
  impact: string; // New: How it affects the student
}

export interface Nudge {
  title: string;
  action: string;
  benefit: "energy" | "focus" | "sleep";
  reasoning: string; // New: Why this swap works
}

export interface AnalysisResponse {
  patterns: Pattern[];
  windows: DangerWindow[];
}

export interface NudgeResponse {
  nudges: Nudge[];
}
