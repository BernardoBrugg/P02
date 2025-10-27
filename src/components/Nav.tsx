"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";

export function Nav() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link
          href="/"
          className="hover:scale-105 transition-transform duration-300"
        >
          <Image
            src="/cronAppLogo.png"
            alt="Aplicativo de Teoria de Filas"
            width={40}
            height={40}
            className="h-10 w-auto rounded-lg"
          />
        </Link>
        <div className="flex items-center space-x-6">
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
      </div>
    </nav>
  );
}
