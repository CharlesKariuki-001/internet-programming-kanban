import React from 'react';
import { motion } from 'framer-motion';
export interface BarDatum {
  label: string;
  value: number;
  color: string; // tailwind bg- or rgb()
  glow?: string; // box-shadow
}
interface BarChartProps {
  data: BarDatum[];
  max?: number;
  unit?: string;
}
export function BarChart({ data, max, unit = '' }: BarChartProps) {
  const computedMax = max ?? Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex flex-col gap-3">
      {data.map((d, i) => {
        const percent = d.value / computedMax * 100;
        return (
          <div key={d.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">{d.label}</span>
              <span className="text-slate-400 tabular-nums">
                {d.value}
                {unit}
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{
                  width: 0
                }}
                animate={{
                  width: `${percent}%`
                }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.05,
                  ease: 'easeOut'
                }}
                className={`absolute inset-y-0 left-0 rounded-full ${d.color}`}
                style={{
                  boxShadow: d.glow
                }} />
              
            </div>
          </div>);

      })}
    </div>);

}