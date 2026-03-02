"use client";

import { useState } from "react";

export default function Collapsible({ header, children }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden transition-all">
      
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex justify-between items-center text-left hover:bg-slate-800/70 transition group"
      >
        <div className="flex-1">{header}</div>

        <span
          className={`ml-4 text-sm text-slate-400 transition-transform duration-300 group-hover:text-white ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-5 pb-5 pt-3 border-t border-slate-800 text-sm text-slate-300 bg-slate-900/60">
          {children}
        </div>
      </div>
    </div>
  );
}