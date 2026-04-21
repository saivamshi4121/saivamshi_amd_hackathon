export type Persona = {
  sleepTime: string;
  wakeTime: string;
  studentType: "hostel" | "day";
  goal: "energy" | "weight" | "focus";
  budget: "low" | "medium" | "high";
};

export type Pattern = {
  name: string;
  timeRange: string;
  foods: string[];
  mood: string;
  risk: "low" | "medium" | "high";
};

export type DangerWindow = {
  timeRange: string;
  reason: string;
  risk: "low" | "medium" | "high";
};

export type Nudge = {
  title: string;
  action: string;
  benefit: string;
};
