"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  endTime: number;
  startTime: number;
  status: string;
}

export function CountdownTimer({ endTime, startTime, status }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [isEnding, setIsEnding] = useState(false);

  useEffect(() => {
    function updateTimer() {
      const now = Date.now();
      const targetTime = status === "upcoming" ? startTime : endTime;
      
      if (status === "ended" || (status === "upcoming" && now < startTime) || (status === "active" && now < endTime)) {
        const difference = Math.max(0, targetTime - now);
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days, hours, minutes, seconds });
        
        // Set isEnding flag if less than 1 hour remains for active auctions
        if (status === "active" && difference < 1000 * 60 * 60) {
          setIsEnding(true);
        }
      }
    }
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [endTime, startTime, status]);
  
  if (status === "ended") {
    return <p className="text-lg font-medium text-muted-foreground">Auction ended</p>;
  }
  
  const TimeDigit = ({ value, label }: { value: number, label: string }) => (
    <div className="flex flex-col items-center">
      <motion.div
        key={value}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-10 h-10 flex items-center justify-center font-mono rounded-md ${
          isEnding ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"
        }`}
      >
        {value.toString().padStart(2, "0")}
      </motion.div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
  
  return (
    <div className={`flex items-center gap-1.5 justify-end ${isEnding ? "text-red-500" : ""}`}>
      <TimeDigit value={timeLeft.days} label="days" />
      <span className="pb-4">:</span>
      <TimeDigit value={timeLeft.hours} label="hrs" />
      <span className="pb-4">:</span>
      <TimeDigit value={timeLeft.minutes} label="min" />
      <span className="pb-4">:</span>
      <TimeDigit value={timeLeft.seconds} label="sec" />
    </div>
  );
}