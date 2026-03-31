"use client";

import { useAppStore } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";

const Onboarding = dynamic(() => import("@/components/Onboarding"), { ssr: false });
const MissionDashboard = dynamic(() => import("@/components/MissionDashboard"), { ssr: false });
const HabitTracker = dynamic(() => import("@/components/HabitTracker"), { ssr: false });
const WeeklyReview = dynamic(() => import("@/components/WeeklyReview"), { ssr: false });
const BottomNav = dynamic(() => import("@/components/BottomNav"), { ssr: false });

export default function Home() {
  const { onboardingCompleted, activeTab } = useAppStore();

  if (!onboardingCompleted) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-full bg-background relative flex flex-col" data-design-id="app-shell">
      <AnimatePresence mode="wait">
        {activeTab === "mission" && (
          <motion.div
            key="mission"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-design-id="screen-mission"
          >
            <MissionDashboard />
          </motion.div>
        )}
        {activeTab === "habits" && (
          <motion.div
            key="habits"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-design-id="screen-habits"
          >
            <HabitTracker />
          </motion.div>
        )}
        {activeTab === "review" && (
          <motion.div
            key="review"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-design-id="screen-review"
          >
            <WeeklyReview />
          </motion.div>
        )}
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
