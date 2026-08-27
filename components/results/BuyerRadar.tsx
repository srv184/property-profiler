"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { BuyerDNA } from "@/types/buyerProfile";

interface Props {
  dna: BuyerDNA;
}

const AXIS_ORDER: { key: keyof BuyerDNA; label: string }[] = [
  { key: "nature", label: "Nature" },
  { key: "privacy", label: "Privacy" },
  { key: "accessibility", label: "Accessibility" },
  { key: "investment", label: "Investment" },
  { key: "luxury", label: "Luxury" },
  { key: "maintenance", label: "Maintenance" },
  { key: "community", label: "Community" },
  { key: "flexibility", label: "Flexibility" },
];

export function BuyerRadar({ dna }: Props) {
  const data = AXIS_ORDER.map(({ key, label }) => ({
    axis: label,
    value: dna[key],
  }));

  return (
    <div className="h-[320px] w-full sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#e6e1d6" />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ fill: "#3a3733", fontSize: 12.5 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "#726c63", fontSize: 10 }}
            tickCount={5}
            axisLine={false}
          />
          <Radar
            name="Buyer DNA"
            dataKey="value"
            stroke="#8a6a3f"
            strokeWidth={2}
            fill="#8a6a3f"
            fillOpacity={0.22}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
