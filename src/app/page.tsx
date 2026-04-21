"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Sparkles } from "lucide-react";
import { Persona } from "@/types";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Sample Data ────────────────────────────────────────────
const EXAM_WEEK_LOG = `Monday: Woke up late around 9:30am, skipped breakfast. Had a heavy thali at mess around 2pm — rice, dal, aloo sabzi, 2 rotis. Felt sleepy after. Around 5pm had samosa and chai from canteen because I was stressed about the exam. Studied till 11pm then had Maggi and another chai. Couldn't sleep until 2am.

Tuesday: Same pattern. Skipped breakfast again. Had poha from a stall around 11am. Lunch was late at 3pm — rajma chawal. Evening was a packet of chips and Frooti while revising. At midnight made instant noodles with extra masala and had 2 cups of coffee to stay awake. Felt jittery and anxious. Slept around 3am.`;

const CODER_LOG = `Saturday: Woke up at 11am, had just black coffee. Started coding my project around noon. By 3pm I was starving, ordered a butter chicken meal from Swiggy. Felt really heavy after. Had biscuits and another coffee around 6pm. Dinner was at 10pm — just bread and butter because I didn't want to leave my laptop. Coded until 3am with multiple chai breaks and a pack of chips.

Sunday: Woke at noon again. Had Maggi for brunch. Felt low energy but kept going. Ordered pizza for lunch around 3pm with a Coke. Had a headache by evening. Dinner was just a sandwich from the hostel canteen at 9pm. Back to coding with instant coffee and namkeen until 4am.`;

const EXAM_PERSONA: Persona = {
  sleepTime: "2:00 AM",
  wakeTime: "9:30 AM",
  studentType: "hostel",
  goal: "focus",
  budget: "low",
};

const CODER_PERSONA: Persona = {
  sleepTime: "3:00 AM",
  wakeTime: "11:00 AM",
  studentType: "hostel",
  goal: "energy",
  budget: "medium",
};

// ─── Animation Helpers ──────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Danger Chip (Hero Visual) ──────────────────────────────
function DangerChip({
  time,
  label,
  detail,
  color,
  delay,
}: {
  time: string;
  label: string;
  detail: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className="group relative"
    >
      <div
        className={`absolute inset-0 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 ${color}`}
      />
      <div className="relative bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:scale-[1.03] transition-transform duration-300 cursor-default">
        <div className="flex items-center gap-3 mb-1.5">
          <span className="text-xs font-mono text-gray-400">{time}</span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${color} bg-opacity-20`}
          >
            {label}
          </span>
        </div>
        <p className="text-sm text-gray-300">{detail}</p>
      </div>
    </motion.div>
  );
}

// ─── Step Card (How It Works) ───────────────────────────────
function StepCard({
  step,
  emoji,
  title,
  desc,
  delay,
}: {
  step: number;
  emoji: string;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <RevealSection delay={delay}>
      <div className="group relative h-full">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/10 via-violet-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
        <div className="relative h-full bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 hover:border-white/20 transition-colors duration-300">
          <div className="text-3xl mb-3">{emoji}</div>
          <div className="text-xs font-mono text-teal-400 mb-1">
            Step {step}
          </div>
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
        </div>
      </div>
    </RevealSection>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function HomePage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);
  const [persona, setPersona] = useState<Persona>({
    sleepTime: "1:00 AM",
    wakeTime: "8:00 AM",
    studentType: "hostel",
    goal: "focus",
    budget: "low",
  });

  const {
    isSupported,
    isListening,
    transcript,
    startListening,
    stopListening,
  } = useSpeechToText();

  // Update log when transcript is received
  useEffect(() => {
    if (transcript) {
      setLog((prev) => (prev ? `${prev} ${transcript}` : transcript));
    }
  }, [transcript]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  useEffect(() => {
    // Check if user has seen intro in this session
    const hasSeenIntro = sessionStorage.getItem("triggernudge_intro_seen");
    if (!hasSeenIntro) {
      setShowWelcome(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    sessionStorage.setItem("triggernudge_intro_seen", "true");
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prefillExam = () => {
    setPersona(EXAM_PERSONA);
    setLog(EXAM_WEEK_LOG);
    scrollToForm();
  };

  const prefillCoder = () => {
    setPersona(CODER_PERSONA);
    setLog(CODER_LOG);
    scrollToForm();
  };

  const update = (key: keyof Persona, value: string) => {
    setPersona((p) => ({ ...p, [key]: value }));
  };

  const handleAnalyze = async () => {
    if (!log.trim()) return;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, log }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }
      const data = await res.json();
      sessionStorage.setItem("analysis", JSON.stringify(data));
      sessionStorage.setItem("persona", JSON.stringify(persona));
      router.push("/result");
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f]">
      {/* ── Welcome Overlay ──────────────────────────────── */}
      <WelcomeScreen onComplete={handleWelcomeComplete} />

      <AnimatePresence>
        {!showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* ── Ambient Background Glows ─────────────────────── */}
            <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/[0.07] rounded-full blur-[120px]" />
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/[0.07] rounded-full blur-[120px]" />
              <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-pink-500/[0.05] rounded-full blur-[100px]" />
            </div>

            {/* ── Nav ──────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-white/[0.06]">
              <div className="w-full px-6 md:px-12 h-14 flex items-center justify-between">
                <span className="font-bold text-lg tracking-tight">
                  TriggerNudge
                  <span className="text-teal-400">⚡</span>
                </span>
                <span className="text-xs text-gray-500 hidden sm:block">
                  Built with Gemini + Antigravity
                </span>
              </div>
            </nav>

            {/* ── HERO ─────────────────────────────────────────── */}
            <section className="relative z-10 w-full px-6 md:px-12 pt-16 md:pt-24 pb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left: Copy */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="space-y-6"
                >
                  <span className="inline-block text-xs font-mono uppercase tracking-widest text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">
                    AI Coach for Campus Food Habits
                  </span>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                    Find your{" "}
                    <span className="bg-gradient-to-r from-teal-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                      danger windows.
                    </span>
                    <br />
                    Fix your food habits,
                    <br className="hidden sm:block" /> not your vibe.
                  </h1>

                  <p className="text-gray-400 text-lg max-w-lg leading-relaxed">
                    TriggerNudge spots the two hours in your day where most bad food
                    decisions happen, then nudges you with realistic swaps for more{" "}
                    <span className="text-teal-300">energy</span>,{" "}
                    <span className="text-violet-300">focus</span>, and{" "}
                    <span className="text-pink-300">sleep</span>.
                  </p>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      onClick={prefillExam}
                      className="group relative px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-r from-teal-500 to-violet-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-105 active:scale-[0.98] transition-all duration-300"
                    >
                      Start with Exam Week
                    </button>
                    <button
                      onClick={scrollToForm}
                      className="px-6 py-3 rounded-full font-semibold text-sm border border-white/15 text-gray-300 hover:border-white/30 hover:text-white hover:scale-105 active:scale-[0.98] transition-all duration-300"
                    >
                      Or describe your own week
                    </button>
                  </div>
                </motion.div>

                {/* Right: Animated Visual */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                  className="space-y-4 lg:pl-8"
                >
                  <div className="relative bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-3xl p-6 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                      <span className="ml-2 text-xs text-gray-500 font-mono">
                        danger-windows.ai
                      </span>
                    </div>

                    <DangerChip
                      time="4pm – 6pm"
                      label="medium risk"
                      detail="Post-lab fatigue → samosa + chai spiral. Stress + fried + sugar combo."
                      color="text-yellow-400"
                      delay={0}
                    />
                    <DangerChip
                      time="11pm – 1am"
                      label="high risk"
                      detail="Late-night Maggi zone. Exam stress + instant carbs + caffeine loop."
                      color="text-red-400"
                      delay={0.8}
                    />
                    <DangerChip
                      time="Morning"
                      label="high risk"
                      detail="Breakfast skip → energy crash → heavy lunch overcompensation."
                      color="text-red-400"
                      delay={1.6}
                    />
                  </div>
                </motion.div>
              </div>
            </section>

            {/* ── HOW IT WORKS ─────────────────────────────────── */}
            <section className="relative z-10 w-full px-6 md:px-12 py-20 border-t border-white/[0.05]">
              <RevealSection className="text-center mb-12">
                <span className="text-xs font-mono uppercase tracking-widest text-violet-400 bg-violet-400/10 px-3 py-1 rounded-full">
                  How it works
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold mt-4">
                  Three steps. Zero guilt.
                </h2>
              </RevealSection>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StepCard
                  step={1}
                  emoji="📝"
                  title="Drop your week"
                  desc="Paste 1–2 days of how you actually eat and feel. Or tap our exam-week preset — no typing needed."
                  delay={0}
                />
                <StepCard
                  step={2}
                  emoji="🔍"
                  title="We find your danger windows"
                  desc="Our AI agents spot late-night and stress-eating patterns that kill your energy and focus."
                  delay={0.15}
                />
                <StepCard
                  step={3}
                  emoji="🎯"
                  title="You get realistic nudges"
                  desc='Not "no sugar forever". Just small swaps that your mess, canteen, and wallet can handle.'
                  delay={0.3}
                />
              </div>
            </section>

            {/* ── ONBOARDING FORM ──────────────────────────────── */}
            <section
              ref={formRef}
              className="relative z-10 w-full px-6 md:px-12 py-20 border-t border-white/[0.05]"
            >
              <RevealSection className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold">
                  Try TriggerNudge on{" "}
                  <span className="bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">
                    your week
                  </span>
                </h2>
                <p className="text-gray-400 mt-2">
                  We don&apos;t track calories — we redesign habits.
                </p>
              </RevealSection>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Left: Persona */}
                <RevealSection delay={0.1}>
                  <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 space-y-5 h-full">
                    <h3 className="font-semibold text-lg border-b border-white/10 pb-3">
                      Your Profile
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">Sleep Time</Label>
                        <Input
                          value={persona.sleepTime}
                          onChange={(e) => update("sleepTime", e.target.value)}
                          className="bg-white/[0.06] border-white/10 text-white placeholder:text-gray-600"
                          placeholder="e.g. 1:00 AM"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">Wake Time</Label>
                        <Input
                          value={persona.wakeTime}
                          onChange={(e) => update("wakeTime", e.target.value)}
                          className="bg-white/[0.06] border-white/10 text-white placeholder:text-gray-600"
                          placeholder="e.g. 8:00 AM"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-400 text-xs">Student Type</Label>
                      <div className="flex gap-3">
                        {(["hostel", "day"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => update("studentType", t)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                              persona.studentType === t
                                ? "bg-gradient-to-r from-teal-500/20 to-violet-500/20 border-teal-400/40 text-teal-300"
                                : "bg-white/[0.03] border-white/10 text-gray-400 hover:border-white/20"
                            }`}
                          >
                            {t === "hostel" ? "Hosteller" : "Day Scholar"}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">Primary Goal</Label>
                        <Select
                          value={persona.goal}
                          onValueChange={(v) => update("goal", v)}
                        >
                          <SelectTrigger className="bg-white/[0.06] border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                            <SelectItem value="energy">⚡ Energy</SelectItem>
                            <SelectItem value="focus">🎯 Focus</SelectItem>
                            <SelectItem value="weight">⚖️ Weight</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-gray-400 text-xs">Budget</Label>
                        <Select
                          value={persona.budget}
                          onValueChange={(v) => update("budget", v)}
                        >
                          <SelectTrigger className="bg-white/[0.06] border-white/10 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                            <SelectItem value="low">💰 Low (Mess)</SelectItem>
                            <SelectItem value="medium">💵 Medium</SelectItem>
                            <SelectItem value="high">💳 High (Orders)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </RevealSection>

                {/* Right: Log Input */}
                <RevealSection delay={0.2}>
                  <div className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-6 space-y-5 h-full flex flex-col">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-semibold text-lg">
                        Describe your last 1–2 days
                      </h3>
                      
                      {/* Voice Input Button */}
                      <button
                        onClick={toggleListening}
                        disabled={!isSupported}
                        title={!isSupported ? "Voice works best in Chrome/Edge" : ""}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                          !isSupported
                            ? "opacity-30 cursor-not-allowed border-white/10 text-gray-500"
                            : isListening
                            ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isListening ? (
                          <>
                            <Mic size={14} />
                            <span>Listening...</span>
                          </>
                        ) : (
                          <>
                            <Mic size={14} className={!isSupported ? "" : "group-hover:text-teal-400"} />
                            <span>{isSupported ? "Speak" : "No Voice Support"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={prefillExam}
                        className="text-xs px-3 py-1.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition-colors"
                      >
                        📝 Auto-fill Exam Week
                      </button>
                      <button
                        onClick={prefillCoder}
                        className="text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-colors"
                      >
                        💻 Auto-fill Late-Night Coder
                      </button>
                    </div>

                    <Textarea
                      value={log}
                      onChange={(e) => setLog(e.target.value)}
                      placeholder="What did you eat yesterday? When? How did you feel? Be as honest as you'd be with a friend..."
                      className="flex-1 min-h-[200px] bg-white/[0.06] border-white/10 text-white placeholder:text-gray-600 resize-none"
                    />

                    <button
                      onClick={handleAnalyze}
                      disabled={loading || !log.trim()}
                      className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-teal-500 to-violet-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Analyzing your habits...
                        </span>
                      ) : (
                        "Analyze my habits →"
                      )}
                    </button>
                  </div>
                </RevealSection>
              </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────────── */}
            <footer className="relative z-10 border-t border-white/[0.06] py-6 px-6 md:px-12">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                <span>TriggerNudge · Built at AMD Slingshot Prompt-a-thon</span>
                <span className="italic">
                  We don&apos;t track calories — we redesign habits.
                </span>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
