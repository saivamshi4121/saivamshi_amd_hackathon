import { Pattern, DangerWindow, Nudge } from "@/types";

export const MOCK_PATTERNS: Pattern[] = [
  {
    name: "Late-night Study Fuel",
    timeRange: "11pm-1am",
    foods: ["Maggi", "Chai", "Biscuits"],
    mood: "Stressed / Focused",
    risk: "high",
    reasoning: "High-carb load late at night during peak stress inhibits quality sleep and spikes cortisol.",
  },
  {
    name: "Evening Canteen Spiral",
    timeRange: "4pm-6pm",
    foods: ["Samosa", "Cold Coffee", "Chips"],
    mood: "Tired / Bored",
    risk: "medium",
    reasoning: "Post-lab fatigue leads to seeking quick dopamine hits via fried snacks rather than real meals.",
  },
];

export const MOCK_WINDOWS: DangerWindow[] = [
  {
    timeRange: "11pm-1am",
    risk: "high",
    reason: "Academic stress meets availability of instant noodles.",
    impact: "Causes severe brain fog the next morning and disrupts the student's focus during morning lectures.",
  },
  {
    timeRange: "4pm-6pm",
    risk: "medium",
    reason: "The afternoon slump leading to poor snack choices.",
    impact: "Leads to a heavy calorie load just before dinner, ruining appetite for more nutritious mess food.",
  },
];

export const MOCK_NUDGES: Nudge[] = [
  {
    title: "The Protein-Boosted Maggi",
    action: "Add an egg or a few roasted peanuts to your Maggi cup.",
    benefit: "focus",
    reasoning: "Adding protein lowers the glycemic index of the meal, preventing the mid-study sugar crash.",
  },
  {
    title: "Hydration Over Dopamine",
    action: "Drink 500ml water before reaching for the Samosa.",
    benefit: "energy",
    reasoning: "Thirst is often mistaken for hunger during the 5 PM slump. Hydration improves immediate mental clarity.",
  },
];
