"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Pattern, DangerWindow, Nudge, Persona } from "@/types";
import { Badge } from "@/components/ui/badge";

// ─── Risk Colors ────────────────────────────────────────────
const riskChip = {
  high: "bg-red-500/15 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  low: "bg-green-500/15 text-green-400 border-green-500/20",
};

const riskBorder = {
  high: "border-l-red-500",
  medium: "border-l-yellow-500",
  low: "border-l-green-500",
};

const riskGlow = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

// ─── Animations ─────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function ResultPage() {
  const router = useRouter();
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [windows, setWindows] = useState<DangerWindow[]>([]);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loadingNudges, setLoadingNudges] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const analysisRaw = sessionStorage.getItem("analysis");
    const personaRaw = sessionStorage.getItem("persona");
    if (!analysisRaw || !personaRaw) {
      router.push("/");
      return;
    }
    try {
      const analysis = JSON.parse(analysisRaw);
      setPatterns(analysis.patterns || []);
      setWindows(analysis.windows || []);
      setPersona(JSON.parse(personaRaw));
      setReady(true);
    } catch {
      router.push("/");
    }
  }, [router]);

  const generateNudges = async () => {
    if (!persona || windows.length === 0) return;
    setLoadingNudges(true);
    try {
      const res = await fetch("/api/nudges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, windows }),
      });
      const data = await res.json();
      setNudges(data.nudges || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingNudges(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        <span className="inline-block w-5 h-5 border-2 border-gray-600 border-t-teal-400 rounded-full animate-spin mr-3" />
        Loading your analysis...
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-500/[0.06] rounded-full blur-[120px]" />
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="w-full px-6 md:px-12 h-14 flex items-center justify-between">
          <span className="font-bold text-lg tracking-tight">
            TriggerNudge<span className="text-teal-400">⚡</span>
          </span>
          <button
            onClick={() => router.push("/")}
            className="text-sm text-gray-400 hover:text-white transition-colors border border-white/10 px-4 py-1.5 rounded-full hover:border-white/20"
          >
            ← New Analysis
          </button>
        </div>
      </nav>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full px-6 md:px-12 py-8 border-b border-white/[0.06]"
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Your Analysis{" "}
          <span className="bg-gradient-to-r from-teal-400 to-violet-400 bg-clip-text text-transparent">
            Results
          </span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Based on your recent behavior
        </p>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-12 py-10 space-y-14">
        {/* Patterns + Danger side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Patterns */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-teal-400 rounded-full" />
              Detected Patterns
            </h2>
            {patterns.map((p, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-xl p-5 space-y-3 hover:border-white/15 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">{p.name}</h3>
                  <Badge
                    variant="outline"
                    className={`shrink-0 uppercase text-[10px] font-bold tracking-wider ${riskChip[p.risk]}`}
                  >
                    {p.risk}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {p.timeRange} · {p.mood}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.foods.map((food, fi) => (
                    <span
                      key={fi}
                      className="text-xs bg-white/[0.06] text-gray-300 px-2 py-0.5 rounded-full"
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.section>

          {/* Danger Windows */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <span className="w-1 h-6 bg-red-400 rounded-full" />
              Danger Windows ⚠️
            </h2>

            <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-sm text-gray-400">
              Most of your unhealthy decisions happen during these time windows.
            </div>

            <div className="relative space-y-0">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-white/10" />
              {windows.map((w, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  className="relative flex gap-4 pb-5 last:pb-0"
                >
                  <div
                    className={`relative z-10 mt-1.5 w-[22px] h-[22px] shrink-0 rounded-full border-2 border-[#0a0a0f] ${riskGlow[w.risk]} shadow-sm`}
                  />
                  <div
                    className={`flex-1 border-l-4 ${riskBorder[w.risk]} bg-white/[0.04] backdrop-blur-sm p-4 rounded-r-xl`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-bold text-base">{w.timeRange}</h4>
                      <Badge
                        variant="outline"
                        className={`shrink-0 uppercase text-[10px] font-bold ${riskChip[w.risk]}`}
                      >
                        {w.risk} risk
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{w.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Nudges */}
        <section className="space-y-6">
          {nudges.length === 0 ? (
            <div className="max-w-xl">
              <button
                onClick={generateNudges}
                disabled={loadingNudges}
                className="w-full py-4 rounded-xl font-bold text-base bg-gradient-to-r from-teal-500 to-violet-500 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-40 disabled:hover:scale-100"
              >
                {loadingNudges ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating your fixes...
                  </span>
                ) : (
                  "Fix My Habits 🎯"
                )}
              </button>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-1 h-6 bg-green-400 rounded-full" />
                Personalized Nudges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nudges.map((n, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="group relative"
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                    <div className="relative bg-white/[0.04] backdrop-blur-sm border border-green-500/10 rounded-2xl p-5 hover:border-green-500/20 transition-colors h-full">
                      <h3 className="font-bold text-green-300 mb-2">
                        {n.title}
                      </h3>
                      <p className="text-sm text-gray-300 mb-3 leading-relaxed">
                        👉 {n.action}
                      </p>
                      <div className="text-xs text-teal-400/80 bg-teal-500/10 px-3 py-1.5 rounded-lg inline-block">
                        💡 {n.benefit}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </section>

        {/* Tagline */}
        {nudges.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-sm text-gray-500 pt-6 pb-8 border-t border-white/[0.06] italic"
          >
            We don&apos;t track calories — we redesign habits.
          </motion.p>
        )}
      </div>
    </div>
  );
}
