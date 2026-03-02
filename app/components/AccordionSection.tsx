"use client";

import { useState } from "react";

export default function AccordionSection({ title, children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-slate-800/60 transition"
      >
        <h2 className="text-lg font-semibold text-green-400">
          {title}
        </h2>

        <span
          className={`text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="px-8 pb-8 pt-2 border-t border-slate-800 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}