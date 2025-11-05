"use client";

import { useState, useEffect } from "react";

interface TimestampCardProps {
  currentTime?: Date;
}

export function TimestampCard({ currentTime }: TimestampCardProps) {
  const [displayTime, setDisplayTime] = useState(new Date());

  useEffect(() => {
    if (!currentTime) {
      const interval = setInterval(() => {
        setDisplayTime(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [currentTime]);

  const timeToDisplay = currentTime || displayTime;

  return (
    <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-md mb-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Horário Atual
        </h2>
      </div>
      <p className="text-2xl text-[var(--text-secondary)] font-bold">
        {timeToDisplay.toLocaleString()}
      </p>
    </div>
  );
}
