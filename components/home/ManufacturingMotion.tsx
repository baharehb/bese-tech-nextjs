"use client";

import { useEffect } from "react";

export function ManufacturingMotion() {
  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      // Keep the renderer and geometry out of the initial page bundle.
      void import("@/lib/manufacturing/renderer.mjs").then(({ startManufacturing }) => {
        if (cancelled) return;
        const runtime = startManufacturing();
        if (!runtime) return;
        dispose = runtime.dispose;
      }).catch(() => {
        // Optional artwork must never prevent navigation or form use.
      });
    });
    document.querySelectorAll("[data-manufacturing-part]").forEach(canvas => observer.observe(canvas));
    return () => { cancelled = true; observer.disconnect(); dispose?.(); };
  }, []);

  return null;
}
