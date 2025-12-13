"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Simple 2-state theme toggle (light <-> dark).
 */
export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Avoid SSR mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" aria-hidden>
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
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

      {/* Sun / Moon layered with simple transitions */}
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all duration-150 ${
          isDark ? "opacity-0 scale-90" : "opacity-100 scale-100"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-150 ${
          isDark ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      />
    </Button>
  );
}