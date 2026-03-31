import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface MissionProfile {
  missionStatement: string;
  seasonFocus: string[];
  currentWeekFocus: string;
  currentWeekNonNegotiable: string;
  currentWeekMainWin: string;
  reflectionPrompt: string;
  updatedAt: string;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  frequencyType: "daily" | "weekly";
  frequencyValue: number;
  isActive: boolean;
  createdAt: string;
  displayOrder: number;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  completedAt: string | null;
}

export interface WeeklyReview {
  id: string;
  weekStartDate: string;
  winsText: string;
  failuresText: string;
  heavinessText: string;
  truthText: string;
  avoidanceText: string;
  driftText: string;
  prideText: string;
  alignedActionText: string;
  nextWeekFocusText: string;
  nextWeekNonNegotiableText: string;
  nextWeekRemoveText: string;
  nextWeekMoveForwardText: string;
  resetStatementText: string;
  completedAt: string | null;
  currentStep: number;
}

export interface AppState {
  onboardingCompleted: boolean;
  missionProfile: MissionProfile;
  habits: Habit[];
  habitLogs: HabitLog[];
  weeklyReviews: WeeklyReview[];
  weeklyReviewDay: string;
  weeklyReviewTime: string;
  activeTab: "mission" | "habits" | "review";

  setOnboardingCompleted: (completed: boolean) => void;
  setMissionProfile: (profile: Partial<MissionProfile>) => void;
  addHabit: (habit: Habit) => void;
  removeHabit: (id: string) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  toggleHabitLog: (habitId: string, date: string) => void;
  getHabitLogsForDate: (date: string) => HabitLog[];
  getHabitLogsForWeek: (weekStart: string) => HabitLog[];
  saveWeeklyReview: (review: WeeklyReview) => void;
  getCurrentWeekReview: () => WeeklyReview | undefined;
  getLatestCompletedReview: () => WeeklyReview | undefined;
  setWeeklyReviewSchedule: (day: string, time: string) => void;
  setActiveTab: (tab: "mission" | "habits" | "review") => void;
  resetHabits: (habits: Habit[]) => void;
}

function getWeekStartDate(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split("T")[0];
}

function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

export { getWeekStartDate, getTodayString };

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      onboardingCompleted: false,
      missionProfile: {
        missionStatement: "",
        seasonFocus: [],
        currentWeekFocus: "",
        currentWeekNonNegotiable: "",
        currentWeekMainWin: "",
        reflectionPrompt: "What would make this week feel respectable?",
        updatedAt: new Date().toISOString(),
      },
      habits: [],
      habitLogs: [],
      weeklyReviews: [],
      weeklyReviewDay: "Sunday",
      weeklyReviewTime: "19:00",
      activeTab: "mission",

      setOnboardingCompleted: (completed) =>
        set({ onboardingCompleted: completed }),

      setMissionProfile: (profile) =>
        set((state) => ({
          missionProfile: {
            ...state.missionProfile,
            ...profile,
            updatedAt: new Date().toISOString(),
          },
        })),

      addHabit: (habit) =>
        set((state) => ({ habits: [...state.habits, habit] })),

      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          habitLogs: state.habitLogs.filter((l) => l.habitId !== id),
        })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),

      toggleHabitLog: (habitId, date) =>
        set((state) => {
          const existing = state.habitLogs.find(
            (l) => l.habitId === habitId && l.date === date
          );
          if (existing) {
            if (existing.completed) {
              return {
                habitLogs: state.habitLogs.filter((l) => l.id !== existing.id),
              };
            }
            return {
              habitLogs: state.habitLogs.map((l) =>
                l.id === existing.id
                  ? {
                      ...l,
                      completed: true,
                      completedAt: new Date().toISOString(),
                    }
                  : l
              ),
            };
          }
          return {
            habitLogs: [
              ...state.habitLogs,
              {
                id: `${habitId}-${date}-${Date.now()}`,
                habitId,
                date,
                completed: true,
                completedAt: new Date().toISOString(),
              },
            ],
          };
        }),

      getHabitLogsForDate: (date) => {
        return get().habitLogs.filter((l) => l.date === date);
      },

      getHabitLogsForWeek: (weekStart) => {
        const start = new Date(weekStart);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return get().habitLogs.filter((l) => {
          const logDate = new Date(l.date);
          return logDate >= start && logDate < end;
        });
      },

      saveWeeklyReview: (review) =>
        set((state) => {
          const existing = state.weeklyReviews.findIndex(
            (r) => r.weekStartDate === review.weekStartDate
          );
          if (existing >= 0) {
            const updated = [...state.weeklyReviews];
            updated[existing] = review;
            return { weeklyReviews: updated };
          }
          return { weeklyReviews: [...state.weeklyReviews, review] };
        }),

      getCurrentWeekReview: () => {
        const weekStart = getWeekStartDate();
        return get().weeklyReviews.find((r) => r.weekStartDate === weekStart);
      },

      getLatestCompletedReview: () => {
        const completed = get().weeklyReviews.filter((r) => r.completedAt);
        if (completed.length === 0) return undefined;
        return completed.sort(
          (a, b) =>
            new Date(b.completedAt!).getTime() -
            new Date(a.completedAt!).getTime()
        )[0];
      },

      setWeeklyReviewSchedule: (day, time) =>
        set({ weeklyReviewDay: day, weeklyReviewTime: time }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      resetHabits: (habits) => set({ habits }),
    }),
    {
      name: "success-os-storage",
    }
  )
);