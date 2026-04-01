"use client";

import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Simple 2-state theme toggle (light <-> dark).
 */
export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => setMounted(true), []);

  // Avoid SSR mismatch
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        type="button"
        disabled
        aria-label="Toggle theme"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    // Restart animation if it's already running
    if (isSwitching) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setIsSwitching(false);
      // small tick to allow CSS animation to restart
      window.setTimeout(() => {
        setIsSwitching(true);
      }, 20);
    } else {
      setIsSwitching(true);
    }

    setTheme(isDark ? "light" : "dark");

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIsSwitching(false);
      timeoutRef.current = null;
    }, 1800);
  };

  return (
    <Button
      onClick={handleToggle}
      variant="ghost"
      size="icon"
      className="h-9 w-9 relative"
      aria-label={`Toggle color scheme (current: ${resolvedTheme ?? "light"})`}
    >
      {/* Accessible label */}
      <span className="sr-only">Toggle theme</span>

      <div
        className={`relative inline-flex items-center justify-center h-[1.2rem] w-[1.2rem] ${
          isSwitching ? "rotate-anim" : ""
        }`}
      >
        <Sun
          className={`absolute inset-0 m-auto h-[1.2rem] w-[1.2rem] mode-toggle-icon ${
            isDark ? "opacity-0 scale-90" : "opacity-100 scale-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 m-auto h-[1.2rem] w-[1.2rem] mode-toggle-icon ${
            isDark ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        />
      </div>
    </Button>
  );
}