"use client";

import { motion } from "framer-motion";

const samples = [
  {
    line: "Қалаға көктем үнсіз келді",
    tags: ["lemma:қала", "pos:NOUN", "ne:LOC"],
  },
  {
    line: "Ритм мені жаңа жолға алып тұр",
    tags: ["lemma:ритм", "pos:NOUN", "genre:электро-поп"],
  },
  {
    line: "Кең далада қоңыр дауыс тербелді",
    tags: ["lemma:дала", "pos:NOUN", "archive:дәстүрлі"],
  },
];

export function HeroFloatingCards() {
  return (
    <div className="relative hidden h-[380px] w-full max-w-xl lg:block">
      {samples.map((item, index) => (
        <motion.article
          key={item.line}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: [0, -8, 0] }}
          transition={{
            duration: 5 + index,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "mirror",
            delay: index * 0.3,
          }}
          className="absolute glass-card w-[280px] rounded-2xl border border-subtle bg-bg-card/75 p-4 shadow-soft"
          style={{
            top: `${index * 108}px`,
            left: `${index % 2 === 0 ? 0 : 120}px`,
          }}
        >
          <p className="text-sm leading-6 text-text-primary">{item.line}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-subtle bg-white/5 px-2.5 py-1 text-[11px] text-text-secondary"
              >
                {tag}
              </span>
            ))}
          </div>
        </motion.article>
      ))}
    </div>
  );
}
