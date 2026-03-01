"use client";

import { useEffect, useState } from "react";

export default function AdminPredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  async function fetchPredictions() {
    const res = await fetch("/api/admin/get-predictions");
    const data = await res.json();
    setPredictions(data.predictions || []);
    setLoading(false);
  }

  async function updateResult(id: string, result: string) {
    await fetch("/api/admin/update-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, result }),
    });

    fetchPredictions();
  }

  if (loading) return <div className="p-10 text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Panel Admin — Pronósticos
      </h1>

      <div className="space-y-6">
        {predictions.map((p: any) => (
          <div
            key={p.id}
            className="bg-slate-900 p-6 rounded-xl border border-slate-800"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">🐎 {p.horse}</h2>

              <span className="text-sm text-slate-400">
                {p.race_datetime
                  ? new Date(p.race_datetime).toLocaleString("es-ES", {
                      timeZone: "Europe/Madrid",
                    })
                  : new Date(p.created_at).toLocaleString("es-ES", {
                      timeZone: "Europe/Madrid",
                    })}
              </span>
            </div>

            <div className="text-sm text-slate-300 space-y-1 mb-4">
              <p>📍 {p.racecourse}</p>
              <p>🏁 {p.race}</p>
              <p>🕒 {p.race_time}</p>
              <p>💰 Cuota: {p.odds}</p>
              <p>📊 Stake: {p.stake}</p>
            </div>

            <div className="mb-4">
              {p.result === "pending" && (
                <span className="text-slate-400">Pendiente</span>
              )}
              {p.result === "won" && (
                <span className="text-green-400 font-semibold">Ganado</span>
              )}
              {p.result === "lost" && (
                <span className="text-red-400 font-semibold">Perdido</span>
              )}
              {p.result === "void" && (
                <span className="text-yellow-400 font-semibold">Nulo</span>
              )}
            </div>

            {p.result === "pending" && (
              <div className="flex gap-4">
                <button
                  onClick={() => updateResult(p.id, "won")}
                  className="bg-green-500 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  ✅ Ganado
                </button>

                <button
                  onClick={() => updateResult(p.id, "lost")}
                  className="bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  ❌ Perdido
                </button>

                <button
                  onClick={() => updateResult(p.id, "void")}
                  className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  ⚖️ Nulo
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}