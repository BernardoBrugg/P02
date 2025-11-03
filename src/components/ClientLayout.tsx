"use client";

import { Nav } from "../components/Nav";
import Footer from "../components/Footer";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="pt-16">{children}</div>
      <Footer />
    </>
  );
}
