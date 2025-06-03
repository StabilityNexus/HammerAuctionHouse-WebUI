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

  const generateChartData = () => {
    const data = [];
    const steps = 50; // Number of points to plot

    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * duration;
      const progress = t / duration;

      const linearPrice = startPrice - (startPrice - reservedPrice) * t / duration;

      const exponentialPrice =
        reservedPrice +
        (startPrice - reservedPrice) * Math.pow(2, -decayFactor * t);

      const logarithmicPrice =
        startPrice -
        ((startPrice - reservedPrice) *
          Math.log2(1 + decayFactor * t)) /
          Math.log2(1 + decayFactor * duration);

      data.push({
        time: t,
        linear: linearPrice,
        exponential: exponentialPrice,
        logarithmic: logarithmicPrice,
      });
    }

    return data;
  };

  const chartData = generateChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-background/95 backdrop-blur-lg border rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium mb-1">Time: {label}s</p>
        {payload.map((entry: any) => (
          <p
            key={entry.dataKey}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {entry.dataKey}: {entry.value.toFixed(2)} ETH
          </p>
        ))}
      </div>
    );
  };

  const toggleCurve = (curve: keyof typeof visibleCurves) => {
    setVisibleCurves((prev) => ({
      ...prev,
      [curve]: !prev[curve],
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/30 backdrop-blur-md border rounded-xl p-6 space-y-6"
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

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
            <XAxis
              dataKey="time"
              tickFormatter={(value) => `${value}s`}
              stroke="currentColor"
              className="text-xs text-muted-foreground"
            />
            <YAxis
              stroke="currentColor"
              className="text-xs text-muted-foreground"
              tickFormatter={(value) => `${value} ETH`}
              domain={[reservedPrice * 0.9, startPrice * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              content={({ payload }) => (
                <div className="flex justify-center gap-4 pt-4">
                  {payload?.map((entry: any) => (
                    <Button
                      key={entry.value}
                      variant="ghost"
                      size="sm"
                      className={`gap-2 ${
                        visibleCurves[entry.value.toLowerCase() as keyof typeof visibleCurves]
                          ? "opacity-100"
                          : "opacity-50"
                      }`}
                      onClick={() =>
                        toggleCurve(entry.value.toLowerCase() as keyof typeof visibleCurves)
                      }
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.value}
                    </Button>
                  ))}
                </div>
              )}
            />
            <AnimatePresence>
              {visibleCurves.linear && (
                <Line
                  type="monotone"
                  dataKey="linear"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                  name="Linear"
                />
              )}
              {visibleCurves.exponential && (
                <Line
                  type="monotone"
                  dataKey="exponential"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                  name="Exponential"
                />
              )}
              {visibleCurves.logarithmic && (
                <Line
                  type="monotone"
                  dataKey="logarithmic"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  dot={false}
                  name="Logarithmic"
                />
              )}
            </AnimatePresence>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}