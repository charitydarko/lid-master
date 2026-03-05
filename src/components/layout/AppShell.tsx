"use client";

import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomDock } from "./BottomDock";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-64 pb-20 lg:pb-0">
        <div className="min-h-screen">{children}</div>
      </main>

      {/* Mobile bottom dock */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomDock />
      </nav>
    </div>
  );
}
