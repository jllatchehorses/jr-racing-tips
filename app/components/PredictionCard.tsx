"use client";

import { useState, useEffect } from "react";

export default function PredictionCard({ prediction }: any) {
  const [open, setOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const raceDate = new Date(prediction.race_datetime);
  const isDaily = prediction.type === "daily";

  const formattedRace =
    prediction.race && !isNaN(Number(prediction.race))
      ? `${prediction.race}ª Carrera`
      : prediction.race;

  /* =========================
     ⏳ COUNTDOWN
  ========================== */

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = raceDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("En juego o finalizado");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor(
        (diff % (1000 * 60 * 60)) / (1000 * 60)
      );

      setTimeLeft(`⏳ ${hours}h ${minutes}m`);
    }, 60000);

    return () => clearInterval(interval);
  }, [prediction.race_datetime]);

  return (
    <div
      className={`rounded-2xl shadow-md overflow-hidden transition border ${
        isDaily
          ? "bg-yellow-500/10 border-yellow-400/40"
          : "bg-slate-900 border-slate-800"
      }`}
    >
      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-6 text-left hover:bg-slate-800/60 transition"
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <p className="text-xl font-bold">
                🐎 {prediction.horse}
              </p>

              {isDaily && (
                <span className="text-xs bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold">
                  Apuesta del Día
                </span>
              )}
            </div>

            <p className="text-sm text-slate-400">
              📍 {prediction.racecourse}
            </p>

            {formattedRace && (
              <p className="text-xs text-slate-500 mt-1">
                🏁 {formattedRace}
              </p>
            )}

            {prediction.result === "pending" && (
              <p className="text-xs text-green-400 mt-2">
                {timeLeft}
              </p>
            )}
          </div>

          <span
            className={`text-slate-400 transition-transform duration-300 mt-1 ${
              open ? "rotate-180" : ""
            }`}
          >
            ▾
          </span>
        </div>
      </button>

      {/* BODY */}
      {open && (
        <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-6">
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <p className="text-slate-400 text-xs mb-1">
                Fecha y hora
              </p>
              <p>
                📅{" "}
                {raceDate.toLocaleString("es-ES", {
                  timeZone: "Europe/Madrid",
                })}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-xs mb-1">
                Cuota
              </p>
              <p className="font-semibold text-white">
                💰 {prediction.odds}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-xs mb-1">
                Stake
              </p>
              <p>📊 {prediction.stake}</p>
            </div>

            <div>
              <p className="text-slate-400 text-xs mb-1">
                Estado
              </p>
              <p
                className={`font-semibold ${
                  prediction.result === "won"
                    ? "text-green-400"
                    : prediction.result === "lost"
                    ? "text-red-400"
                    : prediction.result === "void"
                    ? "text-yellow-400"
                    : "text-slate-400"
                }`}
              >
                {prediction.result === "pending" && "Pendiente"}
                {prediction.result === "won" && "Ganado"}
                {prediction.result === "lost" && "Perdido"}
                {prediction.result === "void" && "Nulo"}
              </p>
            </div>
          </div>

          {prediction.description && (
            <div className="bg-slate-800/60 p-5 rounded-xl text-sm text-slate-300 border border-slate-700">
              <p className="text-slate-400 text-xs mb-2">
                Análisis
              </p>
              {prediction.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
}