"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";

const tabs = [
  { id: "mission" as const, label: "Mission", icon: "◎" },
  { id: "habits" as const, label: "Habits", icon: "◆" },
  { id: "review" as const, label: "Review", icon: "↻" },
];

export default function BottomNav() {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50 bg-background/90 backdrop-blur-xl border-t border-border/30"
      data-design-id="bottom-nav"
    >
      <div className="flex items-center justify-around px-4 pt-2.5 pb-6 safe-bottom no-select no-callout" data-design-id="bottom-nav-inner">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-col items-center gap-1 px-6 py-2 transition-colors"
              data-design-id={`bottom-nav-tab-${tab.id}`}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-[2px] bg-primary rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  data-design-id={`bottom-nav-indicator-${tab.id}`}
                />
              )}
              <span
                className={`text-base transition-all duration-200 ${
                  isActive ? "opacity-100" : "opacity-30"
                }`}
                data-design-id={`bottom-nav-icon-${tab.id}`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.15em] transition-all duration-200 ${
                  isActive ? "text-foreground" : "text-muted-foreground/50"
                }`}
                data-design-id={`bottom-nav-label-${tab.id}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}