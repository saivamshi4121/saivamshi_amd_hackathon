import { Pattern, DangerWindow, Nudge } from "@/types";

export const MOCK_PATTERNS: Pattern[] = [
  {
    name: "Late-night Study Fuel",
    timeRange: "11pm-1am",
    foods: ["Maggi", "Chai", "Biscuits"],
    mood: "Stressed / Focused",
    risk: "high",
  },
  {
    name: "Evening Canteen Spiral",
    timeRange: "4pm-6pm",
    foods: ["Samosa", "Cold Coffee", "Chips"],
    mood: "Tired / Bored",
    risk: "medium",
  },
];

export const MOCK_WINDOWS: DangerWindow[] = [
  {
    timeRange: "11pm-1am",
    reason: "Late-night stress leads to high-carb instant food consumption, disrupting sleep and next-day energy.",
    risk: "high",
  },
  {
    timeRange: "4pm-6pm",
    reason: "Post-lab fatigue triggers fried snack cravings as a quick energy fix.",
    risk: "medium",
  },
];

export const MOCK_NUDGES: Nudge[] = [
  {
    title: "The Maggi Pivot",
    action: "Add an egg or some veggies to your Maggi to slow down glucose spikes.",
    benefit: "Better sleep and no morning brain fog.",
  },
  {
    title: "Canteen Swap",
    action: "Swap the Samosa for roasted peanuts or a fruit from the stall.",
    benefit: "Stable energy for your evening study session.",
  },
];
