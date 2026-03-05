"use client";

import { Settings, Trash2, Map, GraduationCap } from "lucide-react";
import { useProgressStore } from "@/store/progress";
import { useAllStates } from "@/hooks/useQuestions";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function SettingsPage() {
  const { selectedState, setSelectedState, resetProgress, totalAttempts } = useProgressStore();
  const states = useAllStates();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (confirmReset) {
      resetProgress();
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 5000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <header>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
            <Settings className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Settings</h1>
            <p className="text-xs text-muted-foreground">Preferences & data</p>
          </div>
        </div>
      </header>

      {/* About */}
      <div className="glass border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <GraduationCap className="w-5 h-5 text-primary" />
          <p className="text-sm font-semibold text-foreground">About LiD Master</p>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>Version 1.0.0 • Data source: BAMF Gesamtfragenkatalog (Stand 07.05.2025)</p>
          <p>300 general questions + 10 state-specific questions for all 16 Bundesländer.</p>
          <p className="text-[10px] opacity-70">
            Official exam: 33 questions (30 general + 3 state), 60 minutes, 67% pass rate.
          </p>
        </div>
      </div>

      {/* Default state */}
      <div className="glass border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Map className="w-4 h-4 text-emerald-400" />
          <p className="text-sm font-semibold text-foreground">Default Bundesland</p>
        </div>
        <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto">
          {states.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedState(s)}
              className={cn(
                "px-3 py-2 rounded-lg border text-xs text-left transition-all",
                selectedState === s
                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                  : "bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-foreground"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Danger zone */}
      <div className="glass border border-rose-500/15 rounded-2xl p-5">
        <p className="text-sm font-semibold text-foreground mb-1">Danger Zone</p>
        <p className="text-xs text-muted-foreground mb-4">
          Reset all progress data. This cannot be undone.
          {totalAttempts > 0 && ` You have ${totalAttempts} attempts recorded.`}
        </p>
        <button
          onClick={handleReset}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all",
            confirmReset
              ? "bg-rose-500 border-rose-500 text-white hover:bg-rose-600"
              : "bg-rose-500/10 border-rose-500/25 text-rose-400 hover:bg-rose-500/20"
          )}
        >
          <Trash2 className="w-4 h-4" />
          {confirmReset ? "Click again to confirm reset" : "Reset All Progress"}
        </button>
      </div>
    </div>
  );
}
