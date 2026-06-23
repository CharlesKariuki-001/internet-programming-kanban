import React from 'react';
import { motion } from 'framer-motion';
export interface LinePoint {
  label: string;
  value: number;
}
interface LineChartProps {
  data: LinePoint[];
  height?: number;
}
export function LineChart({ data, height = 160 }: LineChartProps) {
  const width = 600;
  const pad = {
    top: 16,
    right: 12,
    bottom: 28,
    left: 12
  };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const points = data.map((d, i) => ({
    x: pad.left + i * stepX,
    y: pad.top + innerH - d.value / max * innerH,
    ...d
  }));
  const pathD = points.
  map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).
  join(' ');
  const areaD = `${pathD} L ${pad.left + innerW} ${pad.top + innerH} L ${pad.left} ${pad.top + innerH} Z`;
  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        preserveAspectRatio="none">
        
        <defs>
          <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(34,211,238,0.3)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </linearGradient>
          <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[0.25, 0.5, 0.75].map((g) =>
        <line
          key={g}
          x1={pad.left}
          x2={pad.left + innerW}
          y1={pad.top + innerH * g}
          y2={pad.top + innerH * g}
          stroke="rgba(255,255,255,0.04)"
          strokeDasharray="2 4" />

        )}

        {/* Area */}
        <motion.path
          d={areaD}
          fill="url(#lineFill)"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.6
          }} />
        

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#lineStroke)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{
            pathLength: 0
          }}
          animate={{
            pathLength: 1
          }}
          transition={{
            duration: 1.2,
            ease: 'easeOut'
          }}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.5))'
          }} />
        

        {/* Dots */}
        {points.map((p, i) =>
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={3}
          fill="#22d3ee"
          initial={{
            opacity: 0,
            scale: 0
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: 0.6 + i * 0.04,
            duration: 0.3
          }} />

        )}

        {/* X labels */}
        {points.map((p, i) => {
          // Show every other label for readability
          if (data.length > 8 && i % 2 !== 0 && i !== points.length - 1)
          return null;
          return (
            <text
              key={`l-${i}`}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="fill-slate-500"
              fontSize="10">
              
              {p.label}
            </text>);

        })}
      </svg>
    </div>);

}