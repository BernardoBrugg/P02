"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState } from "react";

export function Nav() {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--element-bg)] border-b border-[var(--element-border)] shadow-lg">
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
            className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium relative group"
          >
            Início
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/chronometers"
            className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium relative group"
          >
            Cronômetros
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/data"
            className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium relative group"
          >
            Dados
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/dashboards"
            className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium relative group"
          >
            Painéis
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/about"
            className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium relative group"
          >
            Sobre
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)] group-hover:w-full transition-all duration-300"></span>
          </Link>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-[var(--text-secondary)] hover:bg-[var(--text-muted)] transition-colors duration-300"
            suppressHydrationWarning
          >
            {theme === "light" ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-full bg-[var(--text-secondary)] hover:bg-[var(--text-muted)] transition-colors duration-300"
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-[var(--element-bg)] border-t border-[var(--element-border)] shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <Link
              href="/"
              className="block text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/chronometers"
              className="block text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Cronômetros
            </Link>
            <Link
              href="/data"
              className="block text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Dados
            </Link>
            <Link
              href="/dashboards"
              className="block text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Painéis
            </Link>
            <Link
              href="/about"
              className="block text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <button
              onClick={() => {
                setTheme(theme === "light" ? "dark" : "light");
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors duration-300 font-medium"
              suppressHydrationWarning
            >
              {theme === "light" ? (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span>{theme === "light" ? "Modo Escuro" : "Modo Claro"}</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
