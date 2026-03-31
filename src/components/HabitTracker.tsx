"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, getTodayString, getWeekStartDate, type Habit } from "@/lib/store";
import { Plus, X, Check } from "lucide-react";

const WEEKDAYS_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(weekStart: string): string[] {
  const dates: string[] = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

function AddHabitModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (title: string) => void;
}) {
  const [title, setTitle] = useState("");

  const submit = () => {
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
      onClose();
    }
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md bg-background border-t border-border/40 rounded-t-2xl p-6"
        onClick={(e) => e.stopPropagation()}
        data-design-id="add-habit-modal"
      >
        <div className="flex items-center justify-between mb-6" data-design-id="add-habit-modal-header">
          <h3 className="font-heading text-lg font-light">New practice</h3>
          <button onClick={onClose} className="p-1 text-muted-foreground">
            <X size={18} />
          </button>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Morning walk"
          className="w-full bg-card/80 rounded-xl px-4 py-3 text-sm border border-border/40 focus:outline-none focus:border-primary/30 mb-4"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && submit()}
          data-design-id="add-habit-modal-input"
        />

        <button
          onClick={submit}
          disabled={!title.trim()}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium tracking-wide disabled:opacity-40 transition-opacity"
          data-design-id="add-habit-modal-submit"
        >
          Add Habit
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function HabitTracker() {
  const [view, setView] = useState<"today" | "week">("today");
  const [showAdd, setShowAdd] = useState(false);
  const { habits, habitLogs, toggleHabitLog, addHabit, removeHabit } = useAppStore();

  const today = getTodayString();
  const weekStart = getWeekStartDate();
  const weekDates = getWeekDates(weekStart);
  const activeHabits = habits.filter((h) => h.isActive);

  const isCompleted = (habitId: string, date: string) => {
    return habitLogs.some(
      (l) => l.habitId === habitId && l.date === date && l.completed
    );
  };

  const getWeekCount = (habitId: string) => {
    return weekDates.filter((date) => isCompleted(habitId, date)).length;
  };

  const handleAdd = (title: string) => {
    const habit: Habit = {
      id: `habit-${Date.now()}`,
      title,
      icon: "◆",
      frequencyType: "daily",
      frequencyValue: 7,
      isActive: true,
      createdAt: new Date().toISOString(),
      displayOrder: activeHabits.length,
    };
    addHabit(habit);
  };

  const todayIndex = weekDates.indexOf(today);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="px-6 pt-14 pb-28 max-w-md mx-auto" data-design-id="habit-tracker">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        data-design-id="habit-header"
      >
        <div className="flex items-end justify-between mb-6" data-design-id="habit-header-row">
          <div data-design-id="habit-header-text">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1" data-design-id="habit-header-label">
              Habits
            </p>
            <div className="w-8 h-[1px] bg-border/60" data-design-id="habit-header-divider" />
          </div>

          <div className="flex bg-card/80 border border-border/40 rounded-lg p-0.5" data-design-id="habit-view-toggle">
            <button
              onClick={() => setView("today")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all duration-200 ${
                view === "today"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              data-design-id="habit-view-today-btn"
            >
              Today
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-4 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all duration-200 ${
                view === "week"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
              data-design-id="habit-view-week-btn"
            >
              Week
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === "today" ? (
          <motion.div
            key="today"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            data-design-id="habit-today-view"
          >
            {activeHabits.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="text-center py-16"
                data-design-id="habit-empty-state"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-card border border-border/40 flex items-center justify-center" data-design-id="habit-empty-icon">
                  <span className="text-muted-foreground/30 text-lg">◇</span>
                </div>
                <p className="text-sm text-muted-foreground/60 mb-1" data-design-id="habit-empty-title">No practices yet</p>
                <p className="text-xs text-muted-foreground/40" data-design-id="habit-empty-subtitle">Choose a few that keep you aligned.</p>
              </motion.div>
            ) : (
              <div className="space-y-3" data-design-id="habit-today-list">
                {activeHabits.map((habit) => {
                  const completed = isCompleted(habit.id, today);
                  const weekCount = getWeekCount(habit.id);
                  return (
                    <motion.div
                      key={habit.id}
                      variants={itemVariants}
                      layout
                      data-design-id={`habit-row-${habit.id}`}
                    >
                      <button
                        onClick={() => toggleHabitLog(habit.id, today)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 ${
                          completed
                            ? "bg-accent/5 border-accent/15"
                            : "bg-card/50 border-border/30 active:scale-[0.98]"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            completed
                              ? "bg-accent/15"
                              : "bg-muted/50"
                          }`}
                        >
                          {completed ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                              <Check size={14} className="text-accent" />
                            </motion.div>
                          ) : (
                            <span className="text-xs text-muted-foreground/30">{habit.icon}</span>
                          )}
                        </div>

                        <div className="flex-1 text-left">
                          <p className={`text-sm font-medium transition-colors duration-200 ${
                            completed ? "text-foreground/50" : "text-foreground"
                          }`}>
                            {habit.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground/40 mt-0.5">
                            {weekCount}/7 this week
                          </p>
                        </div>

                        <div className="flex gap-0.5">
                          {weekDates.map((date, i) => (
                            <div
                              key={date}
                              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                i === todayIndex
                                  ? completed
                                    ? "bg-accent"
                                    : "bg-primary/30"
                                  : isCompleted(habit.id, date)
                                    ? "bg-accent/50"
                                    : "bg-border/40"
                              }`}
                            />
                          ))}
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <motion.div variants={itemVariants} className="mt-6" data-design-id="habit-add-section">
              <button
                onClick={() => setShowAdd(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border/40 text-sm text-muted-foreground/50 hover:text-muted-foreground hover:border-border transition-colors"
                data-design-id="habit-add-btn"
              >
                <Plus size={14} />
                Add practice
              </button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="week"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            data-design-id="habit-week-view"
          >
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-7 gap-1 mb-4"
              data-design-id="habit-week-header"
            >
              {WEEKDAYS_SHORT.map((day, i) => (
                <div
                  key={day}
                  className={`text-center text-[10px] uppercase tracking-wider ${
                    i === todayIndex ? "text-foreground font-medium" : "text-muted-foreground/40"
                  }`}
                  data-design-id={`habit-week-day-${day.toLowerCase()}`}
                >
                  {day}
                </div>
              ))}
            </motion.div>

            <div className="space-y-2" data-design-id="habit-week-rows">
              {activeHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  variants={itemVariants}
                  className="bg-card/50 border border-border/30 rounded-xl p-4"
                  data-design-id={`habit-week-row-${habit.id}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium">{habit.title}</p>
                    <p className="text-[10px] text-muted-foreground/50">
                      {getWeekCount(habit.id)}/7
                    </p>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {weekDates.map((date, i) => {
                      const done = isCompleted(habit.id, date);
                      const isToday = date === today;
                      return (
                        <button
                          key={date}
                          onClick={() => toggleHabitLog(habit.id, date)}
                          className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-200 ${
                            done
                              ? "bg-accent/15"
                              : isToday
                                ? "bg-primary/5 border border-primary/10"
                                : "bg-muted/30"
                          }`}
                          data-design-id={`habit-week-cell-${habit.id}-${i}`}
                        >
                          {done && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                              <Check size={12} className="text-accent" />
                            </motion.div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            {activeHabits.length > 0 && (
              <motion.div variants={itemVariants} className="mt-4" data-design-id="habit-week-manage">
                <button
                  onClick={() => setShowAdd(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-border/40 text-sm text-muted-foreground/50 hover:text-muted-foreground hover:border-border transition-colors"
                  data-design-id="habit-week-add-btn"
                >
                  <Plus size={14} />
                  Add practice
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <AddHabitModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      </AnimatePresence>
    </div>
  );
}