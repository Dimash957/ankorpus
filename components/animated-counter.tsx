"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export function AnimatedCounter({ value, prefix = "", suffix = "", label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.45 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) {
      return;
    }

    const controls = animate(0, value, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplay(Math.floor(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <div ref={ref} className="rounded-2xl border border-subtle bg-bg-card/70 px-5 py-4">
      <p className="text-2xl font-semibold text-text-primary sm:text-3xl">
        {prefix}
        {display.toLocaleString("kk-KZ")}
        {suffix}
      </p>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-text-secondary">{label}</p>
    </div>
  );
}
