"use client";

import { Nav } from "../components/Nav";
import Footer from "../components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div className="pt-16">{children}</div>
      <Footer />
      <ToastContainer />
    </>
  );
}
