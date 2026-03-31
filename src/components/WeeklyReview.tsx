"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, getWeekStartDate, type WeeklyReview as WeeklyReviewType } from "@/lib/store";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const STEPS = [
  {
    title: "What happened",
    subtitle: "Look back at the past seven days.",
    fields: [
      { key: "winsText", label: "What went well this week?", placeholder: "Small wins, moments of clarity, progress..." },
      { key: "failuresText", label: "What did not go well?", placeholder: "What fell short, what drained you..." },
      { key: "heavinessText", label: "What felt heavy or chaotic?", placeholder: "The weight you carried..." },
    ],
  },
  {
    title: "Truth",
    subtitle: "Be honest with yourself.",
    fields: [
      { key: "truthText", label: "What is the real issue right now?", placeholder: "The thing beneath the surface..." },
      { key: "avoidanceText", label: "What am I avoiding?", placeholder: "What you know but haven't faced..." },
      { key: "driftText", label: "Where did I drift?", placeholder: "Where you lost your axis..." },
    ],
  },
  {
    title: "Wins",
    subtitle: "Acknowledge what kept you aligned.",
    fields: [
      { key: "prideText", label: "What am I proud of?", placeholder: "Actions that showed self-respect..." },
      { key: "alignedActionText", label: "Which action kept me aligned?", placeholder: "The practice that held the line..." },
    ],
  },
  {
    title: "Next week",
    subtitle: "Build the next seven days deliberately.",
    fields: [
      { key: "nextWeekFocusText", label: "Main focus for next week", placeholder: "One direction, one intention..." },
      { key: "nextWeekNonNegotiableText", label: "One non-negotiable", placeholder: "The line you will not cross..." },
      { key: "nextWeekRemoveText", label: "One thing to remove", placeholder: "What no longer serves you..." },
      { key: "nextWeekMoveForwardText", label: "One thing to move forward decisively", placeholder: "The action that matters most..." },
    ],
  },
  {
    title: "Reset",
    subtitle: "Write the standard for the week ahead.",
    fields: [
      { key: "resetStatementText", label: "This week I return to...", placeholder: "My axis, my center, my standard..." },
    ],
  },
];

function getEmptyReview(weekStart: string): WeeklyReviewType {
  return {
    id: `review-${weekStart}`,
    weekStartDate: weekStart,
    winsText: "",
    failuresText: "",
    heavinessText: "",
    truthText: "",
    avoidanceText: "",
    driftText: "",
    prideText: "",
    alignedActionText: "",
    nextWeekFocusText: "",
    nextWeekNonNegotiableText: "",
    nextWeekRemoveText: "",
    nextWeekMoveForwardText: "",
    resetStatementText: "",
    completedAt: null,
    currentStep: 0,
  };
}

export default function WeeklyReview() {
  const weekStart = getWeekStartDate();
  const { weeklyReviews, saveWeeklyReview, setMissionProfile, missionProfile, setActiveTab } = useAppStore();

  const existingReview = weeklyReviews.find((r) => r.weekStartDate === weekStart);
  const [review, setReview] = useState<WeeklyReviewType>(
    existingReview || getEmptyReview(weekStart)
  );
  const [currentStep, setCurrentStep] = useState(existingReview?.currentStep || 0);
  const [completed, setCompleted] = useState(existingReview?.completedAt != null);

  const autosave = useCallback(() => {
    saveWeeklyReview({ ...review, currentStep });
  }, [review, currentStep, saveWeeklyReview]);

  useEffect(() => {
    const timer = setTimeout(autosave, 1000);
    return () => clearTimeout(timer);
  }, [autosave]);

  const updateField = (key: string, value: string) => {
    setReview((prev) => ({ ...prev, [key]: value }));
  };

  const completeReview = () => {
    const completedReview = {
      ...review,
      completedAt: new Date().toISOString(),
      currentStep: 4,
    };
    saveWeeklyReview(completedReview);
    setCompleted(true);

    if (review.nextWeekFocusText) {
      setMissionProfile({
        currentWeekFocus: review.nextWeekFocusText,
        currentWeekNonNegotiable: review.nextWeekNonNegotiableText,
      });
    }
  };

  const goNext = () => {
    if (currentStep < 4) {
      autosave();
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startNewReview = () => {
    const fresh = getEmptyReview(weekStart);
    setReview(fresh);
    setCurrentStep(0);
    setCompleted(false);
    saveWeeklyReview(fresh);
  };

  const fadeVariant = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
  };

  if (completed) {
    return (
      <motion.div
        className="px-6 pt-14 pb-28 max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        data-design-id="review-completed"
      >
        <div className="text-center pt-12" data-design-id="review-completed-content">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/10 flex items-center justify-center"
            data-design-id="review-completed-icon"
          >
            <Check size={24} className="text-accent" />
          </motion.div>

          <h2 className="font-heading text-2xl font-light mb-3" data-design-id="review-completed-title">
            Week reviewed
          </h2>
          <p className="text-sm text-muted-foreground/60 mb-8 max-w-[240px] mx-auto leading-relaxed" data-design-id="review-completed-subtitle">
            Your direction is set. Return to your axis.
          </p>

          {review.resetStatementText && (
            <div className="bg-card/60 border border-border/30 rounded-2xl p-5 mb-8 text-left" data-design-id="review-completed-reset">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" data-design-id="review-completed-reset-label">
                Reset Statement
              </p>
              <p className="font-heading text-base font-light italic text-foreground/70 leading-relaxed" data-design-id="review-completed-reset-text">
                &ldquo;{review.resetStatementText}&rdquo;
              </p>
            </div>
          )}

          {review.nextWeekFocusText && (
            <div className="bg-card/60 border border-border/30 rounded-2xl p-5 mb-8 text-left" data-design-id="review-completed-next-week">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 mb-2" data-design-id="review-completed-focus-label">
                Next Week Focus
              </p>
              <p className="text-sm leading-relaxed" data-design-id="review-completed-focus-text">
                {review.nextWeekFocusText}
              </p>
              {review.nextWeekNonNegotiableText && (
                <div className="mt-3 pt-3 border-t border-border/20">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40 mb-1" data-design-id="review-completed-nn-label">Non-negotiable</p>
                  <p className="text-sm text-foreground/70" data-design-id="review-completed-nn-text">{review.nextWeekNonNegotiableText}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3" data-design-id="review-completed-actions">
            <button
              onClick={() => setActiveTab("mission")}
              className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium tracking-wide"
              data-design-id="review-completed-goto-mission"
            >
              Return to Mission
            </button>
            <button
              onClick={startNewReview}
              className="py-3 px-4 rounded-xl border border-border/50 text-sm text-muted-foreground"
              data-design-id="review-completed-redo"
            >
              Redo
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const step = STEPS[currentStep];

  return (
    <div className="px-6 pt-14 pb-28 max-w-md mx-auto" data-design-id="weekly-review">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        data-design-id="review-header"
      >
        <div className="mb-6" data-design-id="review-header-content">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 mb-1" data-design-id="review-header-label">
            Weekly Review
          </p>
          <div className="w-8 h-[1px] bg-border/60" data-design-id="review-header-divider" />
        </div>

        <div className="flex items-center gap-2 mb-8" data-design-id="review-progress">
          {STEPS.map((_, i) => (
            <div
              key={`step-${i}`}
              className={`flex-1 h-[3px] rounded-full transition-all duration-500 ${
                i <= currentStep ? "bg-primary/40" : "bg-border/40"
              }`}
              data-design-id={`review-progress-step-${i}`}
            />
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          variants={fadeVariant}
          initial="initial"
          animate="animate"
          exit="exit"
          data-design-id={`review-step-${currentStep}`}
        >
          <div className="mb-8" data-design-id={`review-step-${currentStep}-header`}>
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/40 mb-1" data-design-id={`review-step-${currentStep}-number`}>
              Step {currentStep + 1} of 5
            </p>
            <h2 className="font-heading text-2xl font-light mb-1" data-design-id={`review-step-${currentStep}-title`}>
              {step.title}
            </h2>
            <p className="text-sm text-muted-foreground/50" data-design-id={`review-step-${currentStep}-subtitle`}>
              {step.subtitle}
            </p>
          </div>

          <div className="space-y-6" data-design-id={`review-step-${currentStep}-fields`}>
            {step.fields.map((field) => (
              <div key={field.key} data-design-id={`review-field-${field.key}`}>
                <label className="block text-xs text-muted-foreground/60 mb-2 leading-relaxed" data-design-id={`review-field-label-${field.key}`}>
                  {field.label}
                </label>
                <textarea
                  value={(review as Record<string, string>)[field.key] || ""}
                  onChange={(e) => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={currentStep === 4 ? 4 : 3}
                  className="w-full bg-card/60 border border-border/30 rounded-xl px-4 py-3 text-sm leading-relaxed placeholder:text-muted-foreground/30 focus:outline-none focus:border-primary/20 transition-colors resize-none"
                  data-design-id={`review-field-input-${field.key}`}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center gap-3 mt-8" data-design-id="review-navigation">
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          className="p-3 rounded-xl border border-border/40 text-muted-foreground disabled:opacity-20 transition-opacity"
          data-design-id="review-nav-prev"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex-1">
          {currentStep < 4 ? (
            <button
              onClick={goNext}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              data-design-id="review-nav-next"
            >
              Continue
              <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={completeReview}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium tracking-wide hover:opacity-90 transition-opacity"
              data-design-id="review-nav-complete"
            >
              Complete Review
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-[10px] text-muted-foreground/30 mt-4" data-design-id="review-autosave-label">
        Autosaved
      </p>
    </div>
  );
}