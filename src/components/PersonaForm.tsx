"use client";

import { useState } from "react";
import { Persona } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const EXAM_WEEK_LOG = `Monday: Woke up late around 9:30am, skipped breakfast. Had a heavy thali at mess around 2pm — rice, dal, aloo sabzi, 2 rotis. Felt sleepy after. Around 5pm had samosa and chai from canteen because I was stressed about the exam. Studied till 11pm then had Maggi and another chai. Couldn't sleep until 2am.

Tuesday: Same pattern. Skipped breakfast again. Had poha from a stall around 11am. Lunch was late at 3pm — rajma chawal. Evening was a packet of chips and Frooti while revising. At midnight made instant noodles with extra masala and had 2 cups of coffee to stay awake. Felt jittery and anxious. Slept around 3am.`;

const CODER_LOG = `Saturday: Woke up at 11am, had just black coffee. Started coding my project around noon. By 3pm I was starving, ordered a butter chicken meal from Swiggy. Felt really heavy after. Had biscuits and another coffee around 6pm. Dinner was at 10pm — just bread and butter because I didn't want to leave my laptop. Coded until 3am with multiple chai breaks and a pack of chips.

Sunday: Woke at noon again. Had Maggi for brunch. Felt low energy but kept going. Ordered pizza for lunch around 3pm with a Coke. Had a headache by evening. Dinner was just a sandwich from the hostel canteen at 9pm. Back to coding with instant coffee and namkeen until 4am.`;

interface PersonaFormProps {
  onSubmit: (persona: Persona, log: string) => void;
  loading: boolean;
}

export function PersonaForm({ onSubmit, loading }: PersonaFormProps) {
  const [log, setLog] = useState("");
  const [persona, setPersona] = useState<Persona>({
    sleepTime: "1:00 AM",
    wakeTime: "8:00 AM",
    studentType: "hostel",
    goal: "focus",
    budget: "low",
  });

  const update = (key: keyof Persona, value: string) => {
    setPersona((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!log.trim()) return;
    onSubmit(persona, log);
  };

  return (
    <div className="space-y-6">
      {/* Persona Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sleepTime">Sleep Time</Label>
              <Input
                id="sleepTime"
                value={persona.sleepTime}
                onChange={(e) => update("sleepTime", e.target.value)}
                placeholder="e.g. 1:00 AM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wakeTime">Wake Time</Label>
              <Input
                id="wakeTime"
                value={persona.wakeTime}
                onChange={(e) => update("wakeTime", e.target.value)}
                placeholder="e.g. 8:00 AM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Student Type</Label>
            <div className="flex gap-4">
              {(["hostel", "day"] as const).map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-colors ${
                    persona.studentType === type
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="studentType"
                    value={type}
                    checked={persona.studentType === type}
                    onChange={() => update("studentType", type)}
                    className="sr-only"
                  />
                  {type === "hostel" ? "Hosteller" : "Day Scholar"}
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Primary Goal</Label>
              <Select
                value={persona.goal}
                onValueChange={(v) => update("goal", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="energy">Energy</SelectItem>
                  <SelectItem value="focus">Focus</SelectItem>
                  <SelectItem value="weight">Weight Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Budget</Label>
              <Select
                value={persona.budget}
                onValueChange={(v) => update("budget", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Mess only)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High (Can order)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Log Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Describe your last 1–2 days of eating and mood
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={log}
            onChange={(e) => setLog(e.target.value)}
            placeholder="What did you eat? When? How did you feel? Be specific about times and foods..."
            className="min-h-[160px]"
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLog(EXAM_WEEK_LOG)}
              type="button"
            >
              📝 Use Exam Week Sample
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLog(CODER_LOG)}
              type="button"
            >
              💻 Use Late-Night Coder Sample
            </Button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !log.trim()}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing your habits...
              </span>
            ) : (
              "Analyze my habits"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
