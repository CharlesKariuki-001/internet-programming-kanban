import React from 'react';
import { motion } from 'framer-motion';
interface ProgressRingProps {
  percent: number;
  size?: number;
  stroke?: number;
}
export function ProgressRing({
  percent,
  size = 72,
  stroke = 6
}: ProgressRingProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - percent / 100 * circumference;
  return (
    <div
      className="relative flex-shrink-0"
      style={{
        width: size,
        height: size
      }}>
      
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%">
            
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
          fill="none" />
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          initial={{
            strokeDashoffset: circumference
          }}
          animate={{
            strokeDashoffset: offset
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut'
          }}
          style={{
            filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.4))'
          }} />
        
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          key={percent}
          initial={{
            opacity: 0,
            y: 4
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="text-sm font-bold text-white tracking-tight">
          
          {Math.round(percent)}%
        </motion.span>
      </div>
    </div>);

}