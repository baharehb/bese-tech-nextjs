"use client";

import { useEffect, useRef, useState } from "react";
import type { Language } from "@/lib/i18n/translations";
import styles from "./manufacturing.module.css";

export function ManufacturingMotion({ lang }: { lang: Language }) {
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const control = useRef<{ pause: (value: boolean) => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      // Keep the renderer and geometry out of the initial page bundle.
      void import("@/lib/manufacturing/renderer.mjs").then(({ startManufacturing }) => {
        if (cancelled) return;
        const runtime = startManufacturing(() => { if (!cancelled) setReady(true); });
        if (!runtime) return;
        control.current = runtime;
        dispose = runtime.dispose;
      }).catch(() => {
        // Optional artwork must never prevent navigation or form use.
      });
    });
    document.querySelectorAll("[data-manufacturing-part]").forEach(canvas => observer.observe(canvas));
    return () => { cancelled = true; observer.disconnect(); dispose?.(); control.current = null; };
  }, []);

  function toggle() {
    const next = !paused;
    setPaused(next);
    control.current?.pause(next);
  }

  return ready ? (
    <div className={styles.controls}>
      <button type="button" onClick={toggle} aria-pressed={paused}>
        {lang === "fr"
          ? paused ? "Reprendre l’animation" : "Mettre l’animation en pause"
          : paused ? "Resume background animation" : "Pause background animation"}
      </button>
    </div>
  ) : null;
}
