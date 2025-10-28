"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-4 py-4">
        <Link
          href="/"
          className="hover:scale-105 transition-transform duration-300"
          onClick={() => setIsMenuOpen(false)}
        >
          <Image
            src="/cronAppLogo.png"
            alt="Aplicativo de Teoria de Filas"
            width={40}
            height={40}
            className="h-8 w-auto rounded-lg sm:h-10"
          />
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-purple-400 transition-colors duration-300 font-medium relative group"
          >
            Início
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/chronometers"
            className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-purple-400 transition-colors duration-300 font-medium relative group"
          >
            Cronômetros
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/data"
            className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-purple-400 transition-colors duration-300 font-medium relative group"
          >
            Dados
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/dashboards"
            className="text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-purple-400 transition-colors duration-300 font-medium relative group"
          >
            Painéis
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            suppressHydrationWarning
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
        </div>
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            suppressHydrationWarning
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/chronometers"
              className="block text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Cronômetros
            </Link>
            <Link
              href="/data"
              className="block text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dados
            </Link>
            <Link
              href="/dashboards"
              className="block text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-purple-400 transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Painéis
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
