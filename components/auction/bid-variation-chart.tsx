"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Bid } from "@/lib/mock-data";

interface BidVariationChartProps {
  bids: Bid[];
}

export function BidVariationChart({ bids }: BidVariationChartProps) {
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const chartData = bids.map((bid) => ({
    timestamp: bid.timestamp,
    amount: bid.amount,
    bidder: bid.bidder,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;

    const bid = payload[0].payload;
    return (
      <div className="bg-background/95 backdrop-blur-lg border rounded-lg p-3 shadow-xl">
        <p className="font-medium">{bid.amount} ETH</p>
        <p className="text-sm text-muted-foreground">
          by {`${bid.bidder.substring(0, 6)}...${bid.bidder.substring(38)}`}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(bid.timestamp, { addSuffix: true })}
        </p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card/30 backdrop-blur-md border rounded-xl p-6 space-y-4"
    >
      <h3 className="font-semibold">Bid History Chart</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-10" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp);
                return `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
              }}
              stroke="currentColor"
              className="text-xs text-muted-foreground"
            />
            <YAxis
              stroke="currentColor"
              className="text-xs text-muted-foreground"
              tickFormatter={(value) => `${value} ETH`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{
                stroke: "hsl(var(--chart-1))",
                strokeWidth: 2,
                r: 4,
                fill: "hsl(var(--background))",
              }}
              activeDot={{
                stroke: "hsl(var(--chart-1))",
                strokeWidth: 2,
                r: 6,
                fill: "hsl(var(--background))",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-muted-foreground text-right">
        Last updated: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
      </p>
    </motion.div>
  );
}