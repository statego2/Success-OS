"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, type Habit } from "@/lib/store";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";

const PRESET_HABITS = [
  { title: "Workout", icon: "◆" },
  { title: "Read / Study", icon: "◇" },
  { title: "Deep Work", icon: "▪" },
  { title: "Grooming", icon: "○" },
  { title: "No Porn", icon: "□" },
  { title: "Sleep on Time", icon: "◈" },
  { title: "Walk", icon: "△" },
  { title: "Journal", icon: "▫" },
  { title: "Clean Eating", icon: "◎" },
  { title: "Supplements", icon: "·" },
  { title: "Meditation", icon: "◯" },
  { title: "Cold Shower", icon: "▽" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["06:00", "07:00", "08:00", "09:00", "10:00", "17:00", "18:00", "19:00", "20:00", "21:00"];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [mission, setMission] = useState("");
  const [seasonFocus, setSeasonFocus] = useState("");
  const [weekFocus, setWeekFocus] = useState("");
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [reviewDay, setReviewDay] = useState("Sunday");
  const [reviewTime, setReviewTime] = useState("19:00");

  const store = useAppStore();

  const toggleHabit = (title: string) => {
    setSelectedHabits((prev) =>
      prev.includes(title) ? prev.filter((h) => h !== title) : [...prev, title]
    );
  };

  const complete = () => {
    store.setMissionProfile({
      missionStatement: mission || "Build a strong, clear, disciplined life with meaningful success.",
      seasonFocus: seasonFocus
        ? seasonFocus.split(",").map((s) => s.trim()).filter(Boolean)
        : ["Rebuild order", "Strengthen foundations"],
      currentWeekFocus: weekFocus || "Stability and momentum",
      currentWeekNonNegotiable: "",
      currentWeekMainWin: "",
      reflectionPrompt: "What would make this week feel respectable?",
    });

    const habits: Habit[] = selectedHabits.map((title, i) => {
      const preset = PRESET_HABITS.find((p) => p.title === title);
      return {
        id: `habit-${Date.now()}-${i}`,
        title,
        icon: preset?.icon || "◆",
        frequencyType: "daily",
        frequencyValue: 7,
        isActive: true,
        createdAt: new Date().toISOString(),
        displayOrder: i,
      };
    });

    store.resetHabits(habits);
    store.setWeeklyReviewSchedule(reviewDay, reviewTime);
    store.setOnboardingCompleted(true);
  };

  const fadeVariant = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div
      className="fixed inset-0 flex flex-col bg-background overflow-hidden"
      data-design-id="onboarding-container"
    >
      <div className="absolute inset-0 opacity-[0.03]" data-design-id="onboarding-bg-texture">
        <div className="w-full h-full" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, hsl(220 15% 16%) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }} />
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="welcome"
            variants={fadeVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 flex flex-col items-center justify-center px-8 relative z-10"
          >
            <div className="text-center" data-design-id="onboarding-welcome-content">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                data-design-id="onboarding-welcome-logo"
              >
                <div className="w-16 h-16 mx-auto mb-8 rounded-2xl bg-primary/5 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-primary/30" />
                </div>
              </motion.div>

              <h1 className="font-heading text-4xl font-light tracking-tight mb-4" data-design-id="onboarding-welcome-title">
                Success OS
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-[260px] mx-auto mb-12" data-design-id="onboarding-welcome-subtitle">
                Your mission. Your habits.<br />Your weekly clarity.
              </p>

              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
                data-design-id="onboarding-welcome-cta"
              >
                Begin
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="mission"
            variants={fadeVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 flex flex-col px-6 pt-16 pb-8 relative z-10"
          >
            <button
              onClick={() => setStep(0)}
              className="absolute top-6 left-4 p-2 text-muted-foreground"
              data-design-id="onboarding-mission-back"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex-1" data-design-id="onboarding-mission-content">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2" data-design-id="onboarding-mission-step-label">
                Step 1 of 3
              </p>
              <h2 className="font-heading text-2xl font-light mb-8" data-design-id="onboarding-mission-title">
                Define your direction
              </h2>

              <div className="space-y-6">
                <div data-design-id="onboarding-mission-statement-field">
                  <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Your Mission
                  </label>
                  <textarea
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Build a strong, beautiful, disciplined life with wealth, clarity, health, and meaningful success."
                    rows={3}
                    className="w-full bg-transparent border-b border-border/60 pb-3 text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors resize-none"
                  />
                </div>

                <div data-design-id="onboarding-season-focus-field">
                  <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Current Season Focus
                  </label>
                  <input
                    type="text"
                    value={seasonFocus}
                    onChange={(e) => setSeasonFocus(e.target.value)}
                    placeholder="Order, finances, body, mind"
                    className="w-full bg-transparent border-b border-border/60 pb-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                  <p className="text-[11px] text-muted-foreground/50 mt-1">Separate with commas</p>
                </div>

                <div data-design-id="onboarding-week-focus-field">
                  <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    This Week&apos;s Priority
                  </label>
                  <input
                    type="text"
                    value={weekFocus}
                    onChange={(e) => setWeekFocus(e.target.value)}
                    placeholder="Rebuild rhythm with a clear mind and basic wins"
                    className="w-full bg-transparent border-b border-border/60 pb-3 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/40 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium tracking-wide hover:opacity-90 transition-opacity mt-6"
              data-design-id="onboarding-mission-next"
            >
              Continue
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="habits"
            variants={fadeVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 flex flex-col px-6 pt-16 pb-8 relative z-10"
          >
            <button
              onClick={() => setStep(1)}
              className="absolute top-6 left-4 p-2 text-muted-foreground"
              data-design-id="onboarding-habits-back"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex-1 overflow-y-auto" data-design-id="onboarding-habits-content">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2" data-design-id="onboarding-habits-step-label">
                Step 2 of 3
              </p>
              <h2 className="font-heading text-2xl font-light mb-2" data-design-id="onboarding-habits-title">
                Choose core practices
              </h2>
              <p className="text-sm text-muted-foreground mb-6" data-design-id="onboarding-habits-subtitle">
                Select 3–7 habits that keep you aligned.
              </p>

              <div className="grid grid-cols-2 gap-3" data-design-id="onboarding-habits-grid">
                {PRESET_HABITS.map((habit) => {
                  const selected = selectedHabits.includes(habit.title);
                  return (
                    <button
                      key={habit.title}
                      onClick={() => toggleHabit(habit.title)}
                      className={`relative flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-200 ${
                        selected
                          ? "border-primary/30 bg-primary/5"
                          : "border-border/50 bg-card/50 hover:border-border"
                      }`}
                      data-design-id={`onboarding-habit-${habit.title.toLowerCase().replace(/[\s\/]/g, "-")}`}
                    >
                      <span className="text-xs text-muted-foreground/60">{habit.icon}</span>
                      <span className="text-sm">{habit.title}</span>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <Check size={12} className="text-accent" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={selectedHabits.length === 0}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium tracking-wide hover:opacity-90 transition-opacity mt-6 disabled:opacity-40"
              data-design-id="onboarding-habits-next"
            >
              Continue{selectedHabits.length > 0 ? ` (${selectedHabits.length})` : ""}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="schedule"
            variants={fadeVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1 flex flex-col px-6 pt-16 pb-8 relative z-10"
          >
            <button
              onClick={() => setStep(2)}
              className="absolute top-6 left-4 p-2 text-muted-foreground"
              data-design-id="onboarding-schedule-back"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex-1" data-design-id="onboarding-schedule-content">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2" data-design-id="onboarding-schedule-step-label">
                Step 3 of 3
              </p>
              <h2 className="font-heading text-2xl font-light mb-2" data-design-id="onboarding-schedule-title">
                Weekly reset time
              </h2>
              <p className="text-sm text-muted-foreground mb-8" data-design-id="onboarding-schedule-subtitle">
                When should your weekly review reminder arrive?
              </p>

              <div className="space-y-6">
                <div data-design-id="onboarding-schedule-day-picker">
                  <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
                    Day
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day) => (
                      <button
                        key={day}
                        onClick={() => setReviewDay(day)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          reviewDay === day
                            ? "bg-primary text-primary-foreground"
                            : "bg-card/80 border border-border/50 text-muted-foreground hover:border-border"
                        }`}
                        data-design-id={`onboarding-day-${day.toLowerCase()}`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                <div data-design-id="onboarding-schedule-time-picker">
                  <label className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3">
                    Time
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map((time) => (
                      <button
                        key={time}
                        onClick={() => setReviewTime(time)}
                        className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                          reviewTime === time
                            ? "bg-primary text-primary-foreground"
                            : "bg-card/80 border border-border/50 text-muted-foreground hover:border-border"
                        }`}
                        data-design-id={`onboarding-time-${time.replace(":", "")}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={complete}
              className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium tracking-wide hover:opacity-90 transition-opacity mt-6"
              data-design-id="onboarding-schedule-complete"
            >
              Enter Success OS
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step > 0 && step < 4 && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-20" data-design-id="onboarding-step-dots">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? "bg-primary/60 w-4" : "bg-border"
              }`}
              data-design-id={`onboarding-dot-${s}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}