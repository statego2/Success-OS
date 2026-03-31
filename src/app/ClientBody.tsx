"use client";

import { useEffect, useState } from "react";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    document.body.className = "antialiased";

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (standalone) {
      setIsStandalone(true);
      document.documentElement.classList.add("pwa-standalone");
    }

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const scrollable = target.closest("[data-scrollable]");
      if (!scrollable && standalone) {
        e.preventDefault();
      }
    };

    if (standalone) {
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    return () => {
      if (standalone) {
        document.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, []);

  return (
    <div
      className={`antialiased max-w-[430px] mx-auto h-[100dvh] relative overflow-hidden ${isStandalone ? "safe-top" : ""}`}
      style={{ contain: "layout" }}
    >
      <div className="h-full overflow-y-auto" data-scrollable>
        {children}
      </div>
    </div>
  );
}
