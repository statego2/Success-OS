"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, getTodayString, getWeekStartDate } from "@/lib/store";
import { Pencil, Check, X } from "lucide-react";

function EditableField({
  label,
  value,
  onSave,
  multiline,
  designId,
}: {
  label: string;
  value: string;
  onSave: (val: string) => void;
  multiline?: boolean;
  designId: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const save = () => {
    onSave(draft);
    setEditing(false);
  };

  const cancel = () => {
    setDraft(value);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="group" data-design-id={`${designId}-edit`}>
        {multiline ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full bg-card/80 rounded-lg px-3 py-2 text-sm leading-relaxed border border-border/60 focus:outline-none focus:border-primary/30 resize-none"
            rows={3}
            autoFocus
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full bg-card/80 rounded-lg px-3 py-2 text-sm border border-border/60 focus:outline-none focus:border-primary/30"
            autoFocus
          />
        )}
        <div className="flex gap-2 mt-2">
          <button onClick={save} className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Check size={14} />
          </button>
          <button onClick={cancel} className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      className="w-full text-left group"
      data-design-id={designId}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm leading-relaxed">{value || <span className="text-muted-foreground/40 italic">Tap to set...</span>}</span>
        <span className="opacity-0 group-hover:opacity-40 transition-opacity ml-2 mt-0.5 shrink-0">
          <Pencil size={12} />
        </span>
      </div>
    </button>
  );
}

export default function MissionDashboard() {
  const {
    missionProfile,
    setMissionProfile,
    habits,
    habitLogs,
    weeklyReviews,
    setActiveTab,
  } = useAppStore();

  const today = getTodayString();
  const weekStart = getWeekStartDate();

  const todayLogs = habitLogs.filter((l) => l.date === today && l.completed);
  const activeHabits = habits.filter((h) => h.isActive);
  const todayCompleted = todayLogs.length;
  const todayTotal = activeHabits.length;

  const weekLogs = habitLogs.filter((l) => {
    const logDate = new Date(l.date);
    const start = new Date(weekStart);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    return logDate >= start && logDate < end && l.completed;
  });

  const weekPossible = activeHabits.length * 7;
  const weekConsistency = weekPossible > 0 ? Math.round((weekLogs.length / weekPossible) * 100) : 0;

  const currentWeekReview = weeklyReviews.find((r) => r.weekStartDate === weekStart);
  const reviewCompleted = currentWeekReview?.completedAt != null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div
      className="px-6 pt-14 pb-28 max-w-md mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-design-id="mission-dashboard"
    >
      <motion.div variants={itemVariants} className="mb-10" data-design-id="mission-header">
        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1" data-design-id="mission-header-label">
          Mission
        </p>
        <div className="w-8 h-[1px] bg-border/60 mb-4" data-design-id="mission-header-divider" />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mb-10"
        data-design-id="mission-statement-block"
      >
        <h1 className="font-heading text-[22px] font-light leading-[1.4] tracking-tight" data-design-id="mission-statement-heading">
          <EditableField
            label="Mission"
            value={missionProfile.missionStatement}
            onSave={(val) => setMissionProfile({ missionStatement: val })}
            multiline
            designId="mission-statement-text"
          />
        </h1>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mb-8"
        data-design-id="season-focus-block"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-3" data-design-id="season-focus-label">
          Current Season
        </p>
        <div className="flex flex-wrap gap-2" data-design-id="season-focus-tags">
          {missionProfile.seasonFocus.map((focus, i) => (
            <span
              key={`${focus}-${i}`}
              className="px-3.5 py-1.5 rounded-lg bg-card border border-border/40 text-xs text-foreground/80 tracking-wide"
              data-design-id={`season-tag-${i}`}
            >
              {focus}
            </span>
          ))}
          {missionProfile.seasonFocus.length === 0 && (
            <button
              onClick={() => {
                const input = prompt("Enter season focus areas (comma-separated):");
                if (input) {
                  setMissionProfile({
                    seasonFocus: input.split(",").map((s) => s.trim()).filter(Boolean),
                  });
                }
              }}
              className="px-3.5 py-1.5 rounded-lg border border-dashed border-border/40 text-xs text-muted-foreground/40 tracking-wide"
              data-design-id="season-tag-empty"
            >
              + Add focus areas
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-card/60 border border-border/30 rounded-2xl p-5 mb-8"
        data-design-id="week-focus-card"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-4" data-design-id="week-focus-label">
          This Week
        </p>

        <div className="space-y-4" data-design-id="week-focus-fields">
          <div data-design-id="week-focus-primary">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40 mb-1">Primary Focus</p>
            <EditableField
              label="Primary focus"
              value={missionProfile.currentWeekFocus}
              onSave={(val) => setMissionProfile({ currentWeekFocus: val })}
              designId="week-focus-value"
            />
          </div>

          <div className="w-full h-[1px] bg-border/30" data-design-id="week-focus-sep-1" />

          <div data-design-id="week-main-win">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40 mb-1">Most Important Win</p>
            <EditableField
              label="Main win"
              value={missionProfile.currentWeekMainWin}
              onSave={(val) => setMissionProfile({ currentWeekMainWin: val })}
              designId="week-main-win-value"
            />
          </div>

          <div className="w-full h-[1px] bg-border/30" data-design-id="week-focus-sep-2" />

          <div data-design-id="week-non-negotiable">
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40 mb-1">Non-Negotiable</p>
            <EditableField
              label="Non-negotiable"
              value={missionProfile.currentWeekNonNegotiable}
              onSave={(val) => setMissionProfile({ currentWeekNonNegotiable: val })}
              designId="week-non-negotiable-value"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex items-center gap-4 mb-8"
        data-design-id="progress-summary"
      >
        <div className="flex-1 bg-card/60 border border-border/30 rounded-xl p-4 text-center" data-design-id="progress-today">
          <p className="text-2xl font-heading font-light" data-design-id="progress-today-value">
            {todayCompleted}<span className="text-muted-foreground/40 text-lg">/{todayTotal}</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mt-1" data-design-id="progress-today-label">
            Today
          </p>
        </div>

        <div className="flex-1 bg-card/60 border border-border/30 rounded-xl p-4 text-center" data-design-id="progress-week">
          <p className="text-2xl font-heading font-light" data-design-id="progress-week-value">
            {weekConsistency}<span className="text-muted-foreground/40 text-lg">%</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mt-1" data-design-id="progress-week-label">
            Week
          </p>
        </div>

        <button
          onClick={() => setActiveTab("review")}
          className={`flex-1 border rounded-xl p-4 text-center transition-colors ${
            reviewCompleted
              ? "bg-accent/5 border-accent/20"
              : "bg-card/60 border-border/30"
          }`}
          data-design-id="progress-review"
        >
          <p className="text-[11px] font-medium" data-design-id="progress-review-value">
            {reviewCompleted ? "Done" : "Pending"}
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mt-1" data-design-id="progress-review-label">
            Review
          </p>
        </button>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-card/40 border border-border/20 rounded-2xl p-5"
        data-design-id="reflection-block"
      >
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-3" data-design-id="reflection-label">
          Return Question
        </p>
        <p className="font-heading text-base font-light italic text-foreground/70 leading-relaxed" data-design-id="reflection-text">
          &ldquo;{missionProfile.reflectionPrompt}&rdquo;
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="flex gap-3 mt-8"
        data-design-id="mission-actions"
      >
        <button
          onClick={() => setActiveTab("habits")}
          className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
          data-design-id="mission-goto-habits"
        >
          Today&apos;s Habits
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className="flex-1 py-3 rounded-xl border border-border/50 text-sm font-medium tracking-wide hover:bg-card transition-colors"
          data-design-id="mission-goto-review"
        >
          Weekly Review
        </button>
      </motion.div>
    </motion.div>
  );
}