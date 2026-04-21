# TriggerNudge ⚡

**AI-powered behavioral nutrition for Indian college students.**

TriggerNudge is a practical food coach that identifies "danger windows" in a student's day—like the 11 PM Maggi craze or the 5 PM Samosa spiral—and provides realistic, budget-friendly nudges to improve energy, focus, and sleep.

![TriggerNudge Landing Page](public/screenshot_hero.png) *(Note: Add your screenshot here)*

## ✨ Features

- **Gen-Z Styled UI**: Clean, dark-mode landing page with neon gradients and smooth animations.
- **Voice-to-Log**: Hands-free meal logging using the Web Speech API (optimized for Indian English/Hinglish).
- **Multi-Agent AI Pipeline**:
  - **Pattern Agent**: Extracts behavioral eating habits from free-form logs.
  - **Danger Agent**: Identifies high-risk windows where energy crashes happen.
  - **Nudge Agent**: Provides realistic canteen/hostel-safe swaps.
- **Indestructible Demo Architecture**:
  - **Primary**: Gemini 2.5 Flash.
  - **Fallback**: Gemma 3 via OpenRouter.
  - **Safe Mode**: Automatic high-quality mock data if all AI APIs hit rate limits.
- **Privacy First**: No database, no tracking. We don't track calories — we redesign habits.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **AI Models**: Google Gemini 2.5 Flash, Gemma (OpenRouter)

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/trigger-nudge.git
cd trigger-nudge
npm install
```

### 2. Set Up Environment
Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```
Add your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Run Locally
```bash
npm run dev
```

## 🚢 Deployment (Google Cloud Run)

The project is pre-configured for **Google Cloud Run**.

### One-Click Deploy (Windows/PowerShell)
```powershell
.\deploy.ps1
```

### Manual Deploy (Linux/macOS)
1. Ensure `gcloud` CLI is authenticated and project is set.
2. Run the build and deploy script:
```bash
chmod +x deploy.sh
./deploy.sh
```

## 🛡️ License
MIT

---
Built at **AMD Slingshot Prompt-a-thon** 🚀
