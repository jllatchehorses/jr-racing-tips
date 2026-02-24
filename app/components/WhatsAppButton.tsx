"use client";

import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const phoneNumber = "34600000000"; // 🔴 Cambiar mañana
  const message = "Hola, tengo una consulta sobre JR Racing Tips.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  const [pulse, setPulse] = useState(false);

  // Animación suave cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 800);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl text-white bg-green-500 hover:bg-green-600 transition-all duration-300 ${
          pulse ? "scale-110" : ""
        }`}
      >
        💬
      </a>

      {/* Tooltip */}
      <div className="absolute bottom-16 right-0 bg-slate-900 text-xs text-white px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap border border-slate-700">
        Atención al cliente
      </div>
    </div>
  );
}