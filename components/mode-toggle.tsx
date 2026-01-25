"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            aria-label="Toggle theme"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <motion.div
              key={resolvedTheme}
              initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </motion.div>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>
            Switch to {isDark ? "Light" : "Dark"} mode
          </span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
