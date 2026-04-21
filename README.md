# TriggerNudge ⚡
> **Behavioral Nutrition for the Indian Campus.**

TriggerNudge is an AI-powered coach designed to help Indian college students fix their eating habits without the guilt of calorie counting. We focus on **Behavioral Design**—identifying the specific "Danger Windows" in a student's day and providing realistic, budget-friendly nudges.

---

## 🚩 The Problem Statement

### The "Canteen-to-Cram" Cycle
Indian college students, especially those in hostels, face a unique set of nutritional challenges:
1.  **Erratic Schedules**: Late-night labs, midnight study sessions, and morning-rush classes.
2.  **The Canteen Trap**: Cheap, fried snacks (Samosas, Maggi, Bread Pakora) are the only available options during peak hunger.
3.  **Stress Eating**: Academic pressure leads to "revenge bedtime procrastination" and late-night junk food spirals.
4.  **Ineffective Tracking**: Existing apps focus on calorie counting and "perfect diets" which are impossible to maintain on a mess-food budget.

**The result?** Students face constant energy crashes, brain fog during exams, and poor long-term metabolic health.

---

## 📝 The Example: A Day in the Life

**The Input Log:**
> "Woke up at 9:30 AM for a 10 AM lab, so skipped breakfast. Had 3 cups of coffee to stay awake. By 2 PM I was starving and had a double-plate of Chole Bhature at the mess. Felt like a zombie afterward and slept till 5 PM. Woke up groggy, had a Samosa and Chai while studying. At 11 PM, I made Maggi with extra masala because I couldn't focus on my assignment."

**The TriggerNudge Analysis:**
- **Pattern Found**: *The Hunger Trap*. Skipping breakfast leads to a high-carb lunch "overcompensation," causing a massive insulin spike and subsequent energy crash (the 3 PM zombie state).
- **Danger Window**: **11 PM – 12 AM**. High-risk zone where fatigue-induced hunger leads to instant noodle consumption.

---

## 💡 The Solution: TriggerNudge AI

TriggerNudge doesn't tell you to "eat more salad." It uses a **Multi-Agent AI Pipeline** to redesign your habits:

1.  **Voice-First Interface**: Students can speak their food log in Hinglish/Indian English, making logging as easy as sending a voice note to a friend.
2.  **Danger Window Identification**: Instead of tracking every meal, we find the **two hours** in your day where 80% of your bad decisions happen.
3.  **Realistic Nudges**: We suggest swaps that are actually available in an Indian hostel:
    - *Don't have Maggi?* "Add an egg or a handful of peanuts to your Maggi to slow down the sugar spike."
    - *Skipped Breakfast?* "Grab a banana or a handful of almonds from the gate stall before your 10 AM lab."

---

## ⚙️ How it Works (Technical Architecture)

TriggerNudge is built on a resilient, multi-model AI architecture:

- **Primary Agent (Gemini 2.5 Flash)**: Handles complex behavioral pattern recognition and danger window mapping using structured JSON output.
- **Fallback Agent (Gemma 3 via OpenRouter)**: Injected with a strict system prompt to handle requests if Gemini hits rate limits or latency issues.
- **Emergency Safe Mode**: If all APIs fail, a hardcoded behavioral logic engine kicks in to ensure the student always receives high-quality guidance.
- **Frontend**: Next.js 14 with Framer Motion for a "Gen-Z" dark-mode aesthetic.

---

## 🚀 Deployment

The app is containerized with **Docker** and ready for **Google Cloud Run**.

### Quick Start
1. `npm install`
2. Set `GEMINI_API_KEY` in `.env.local`
3. `npm run dev`

### One-Command Deploy
```powershell
.\deploy.ps1
```

---

## 🎯 Conclusion

TriggerNudge is more than an app; it's a behavioral intervention. By focusing on the **context** of eating (timing, mood, and budget) rather than just the content, we help students regain their energy and focus. 

**Fix your food habits. Not your vibe.** ⚡

---
Built for the **AMD Slingshot Prompt-a-thon** 🚀
