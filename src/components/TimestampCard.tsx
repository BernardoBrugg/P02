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
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 mb-8 text-center">
      <div className="flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-blue-500 mr-3"
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
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Hora Atual
        </h2>
      </div>
      <p className="text-2xl font-mono text-gray-700 dark:text-gray-300 font-bold">
        {currentTime.toLocaleString()}
      </p>
    </div>
  );
}
