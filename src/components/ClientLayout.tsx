"use client";

import { useEffect } from "react";
import { Nav } from "../components/Nav";
import Footer from "../components/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-scroll-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll("[data-scroll]");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto snap-y snap-mandatory">
      <Nav />
      <div className="pt-16 snap-start" data-scroll>
        {children}
      </div>
      <Footer />
    </div>
  );
}
