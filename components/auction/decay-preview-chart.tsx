"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DecayPreviewChartProps {
  startPrice: number;
  reservedPrice: number;
  duration: number;
  decayFactor: number;
  decayType: "linear" | "exponential" | "logarithmic";
}

export function DecayPreviewChart({
  startPrice,
  reservedPrice,
  duration,
  decayFactor,
  decayType,
}: DecayPreviewChartProps) {
  const [visibleCurves, setVisibleCurves] = useState({
    linear: true,
    exponential: true,
    logarithmic: true,
  });

  // Only show the selected decayType curve as active
  useEffect(() => {
    setVisibleCurves({
      linear: decayType === "linear",
      exponential: decayType === "exponential",
      logarithmic: decayType === "logarithmic",
    });
  }, [decayType]);

  const generateChartData = () => {
    // Return empty if invalid inputs
    if (!startPrice || !duration) return [];
    
    const data = [];
    const steps = 50;
    const safeReserve = reservedPrice || 0;
    console.log(decayFactor)
    decayFactor= (decayFactor * 1.0);
    console.log(decayFactor)

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * duration;
      const progress = t / duration;

      // Linear decay
      let linearPrice = startPrice - (startPrice - safeReserve) * t / duration;
      if (linearPrice < safeReserve) linearPrice = safeReserve;

      // Exponential decay
      let exponentialPrice = safeReserve;
      if (decayFactor > 0) {
        exponentialPrice = safeReserve + 
          (startPrice - safeReserve) * Math.exp(-decayFactor * t);
        if (exponentialPrice < safeReserve) exponentialPrice = safeReserve;
      }

      // Logarithmic decay
      let logarithmicPrice = startPrice;
      if (decayFactor > 0) {
        const logBase = 1 + decayFactor * duration;
        logarithmicPrice = startPrice - 
          ((startPrice - safeReserve) * 
            Math.log(1 + decayFactor * t)) / 
            Math.log(logBase);
        if (logarithmicPrice < safeReserve) logarithmicPrice = safeReserve;
      }

      data.push({
        time: t,
        linear: decayType === "linear" ? linearPrice : null,
        exponential: decayType === "exponential" ? exponentialPrice : null,
        logarithmic: decayType === "logarithmic" ? logarithmicPrice : null
      });
    }
    return data;
  };

  const chartData = generateChartData();

  if (!chartData.length) {
    return (
      <div className="bg-card/30 backdrop-blur-md border rounded-xl p-6 text-center text-muted-foreground">
        Configure auction parameters to see price decay preview
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/30 backdrop-blur-md border rounded-xl p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Price Decay Preview</h3>
        <UITooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              This chart shows how the price will decrease over time based on the
              selected decay type and parameters.
            </p>
          </TooltipContent>
        </UITooltip>
      </div>

      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer>
          <LineChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="time"
              tickFormatter={(value) => {
                if (duration >= 86400) return `${Math.round(value/86400)}d`;
                if (duration >= 3600) return `${Math.round(value/3600)}h`;
                if (duration >= 60) return `${Math.round(value/60)}m`;
                return `${value}s`;
              }}
            />
            <YAxis
              domain={[
                (dataMin: number) => Math.floor(dataMin * 0.9 * 100) / 100,
                (dataMax: number) => Math.ceil(dataMax * 1.1 * 100) / 100
              ]}
              tickFormatter={(value) => value.toFixed(2)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-background border rounded-lg p-2 shadow-lg">
                    <div className="text-sm font-medium">
                      Price: {typeof payload[0].value === "number" ? payload[0].value.toFixed(3) : payload[0].value} ETH
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Time: {payload[0].payload.time}s
                    </div>
                  </div>
                );
              }}
            />
            {decayType === "linear" && (
              <Line
                type="monotone"
                dataKey="linear"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
            {decayType === "exponential" && (
              <Line
                type="monotone"
                dataKey="exponential"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
            {decayType === "logarithmic" && (
              <Line
                type="monotone"
                dataKey="logarithmic"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}