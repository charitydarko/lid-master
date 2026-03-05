"use client";

import { useCallback } from "react";

export function useConfetti() {
  const fire = useCallback(async (score: number) => {
    if (typeof window === "undefined") return;
    const confetti = (await import("canvas-confetti")).default;

    if (score === 100) {
      // Full cannon burst for perfect score
      const count = 200;
      const defaults = { origin: { y: 0.7 } };
      function fire(particleRatio: number, opts: object) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }
      fire(0.25, { spread: 26, startVelocity: 55, colors: ["#3b82f6", "#10b981"] });
      fire(0.2, { spread: 60, colors: ["#f59e0b", "#6366f1"] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#3b82f6", "#10b981", "#f59e0b"] });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, colors: ["#fff"] });
      fire(0.1, { spread: 120, startVelocity: 45, colors: ["#3b82f6"] });
    } else if (score >= 67) {
      // Gentle shower for passing
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#3b82f6"],
      });
    }
  }, []);

  return fire;
}
