"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9"
        disabled
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      </Button>
    );
  }

  // Determine the next theme to cycle through
  const nextTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  // Determine which icon to display based on resolved theme
  const renderIcon = () => {
    switch (resolvedTheme) {
      case "dark":
        return (
          <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300" />
        );
      case "light":
        return (
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300" />
        );
      default:
        return (
          <Monitor className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300" />
        );
    }
  };

  // Determine tooltip text
  const getTooltipText = () => {
    switch (theme) {
      case "light":
        return "Light mode (click to switch to Dark)";
      case "dark":
        return "Dark mode (click to switch to System)";
      case "system":
        return `System theme - ${resolvedTheme === "dark" ? "Dark" : "Light"} (click to switch to Light)`;
      default:
        return "Toggle theme";
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 relative transition-all duration-200 hover:bg-accent"
            onClick={nextTheme}
            aria-label={`Current theme: ${theme}. Click to cycle through themes.`}
          >
            {renderIcon()}
            <span className="sr-only">
              {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"} theme
            </span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {getTooltipText()}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
