"use client";

import { useState, useEffect } from "react";

export function TimestampCard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--element-bg)] border border-[var(--element-border)] p-6 rounded-2xl shadow-md mb-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-[var(--accent)] mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
          Hora Atual
        </h2>
      </div>
      <p className="text-2xl font-mono text-[var(--text-secondary)] font-bold">
        {currentTime.toLocaleString()}
      </p>
    </div>
  );
}
