"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  // Close on resize to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 768) setOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        className="mobile-nav-toggle"
        onClick={() => setOpen(true)}
        style={{
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#374151",
          padding: 4,
          borderRadius: 6,
        }}
      >
        <Menu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="mobile-nav-overlay"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 300,
            backdropFilter: "blur(2px)",
          }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* Slide-out sidebar */}
      <div
        className="mobile-nav-drawer"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: 240,
          zIndex: 301,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "none",
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          style={{
            position: "absolute",
            top: 12,
            right: -44,
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.5)",
            border: "none",
            cursor: "pointer",
            color: "#e2e8f0",
            display: open ? "flex" : "none",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 302,
          }}
        >
          <X size={18} />
        </button>

        {/* Reuse the existing Sidebar — override width to fill drawer */}
        <div
          onClick={(e) => {
            // Close drawer when a nav action is taken
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest("a")) {
              setTimeout(() => setOpen(false), 150);
            }
          }}
          style={{ height: "100%" }}
        >
          <Sidebar mobile />
        </div>
      </div>
    </>
  );
}
