"use client";

import { ThemeProvider } from "next-themes";
import { Nav } from "../components/Nav";
import Footer from "../components/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Nav />
      <div className="pt-16">{children}</div>
      <Footer />
    </ThemeProvider>
  );
}
