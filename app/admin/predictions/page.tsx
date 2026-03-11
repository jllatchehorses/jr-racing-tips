"use client";

import { useEffect, useState } from "react";

export default function AdminPredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPredictions();
  }, []);

  async function fetchPredictions() {
    const res = await fetch("/api/admin/get-predictions");
    const data = await res.json();

    let preds = data.predictions || [];

    // ordenar pending primero
    preds.sort((a: any, b: any) => {
      if (a.result === "pending" && b.result !== "pending") return -1;
      if (a.result !== "pending" && b.result === "pending") return 1;

      const dateA = new Date(a.race_datetime || a.created_at).getTime();
      const dateB = new Date(b.race_datetime || b.created_at).getTime();

      return dateA - dateB;
    });

    setPredictions(preds);
    setLoading(false);
  }

  async function updateResult(id: string, result: string) {
    const confirmAction = confirm(
      "¿Seguro que quieres cerrar este pronóstico?"
    );

    if (!confirmAction) return;

    await fetch("/api/admin/update-result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, result }),
    });

    fetchPredictions();
  }

  if (loading) return <div className="p-10 text-white">Cargando...</div>;

  const filteredPredictions = predictions.filter((p: any) => {
    if (filter === "pending") return p.result === "pending";
    if (filter === "won") return p.result === "won";
    if (filter === "lost") return p.result === "lost";
    if (filter === "daily") return p.type === "daily";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Panel Admin — Pronósticos
      </h1>

      {/* FILTROS */}
      <div className="flex gap-4 mb-8 flex-wrap">

        <FilterButton label="Todos" value="all" filter={filter} setFilter={setFilter} />
        <FilterButton label="Pending" value="pending" filter={filter} setFilter={setFilter} />
        <FilterButton label="Ganados" value="won" filter={filter} setFilter={setFilter} />
        <FilterButton label="Perdidos" value="lost" filter={filter} setFilter={setFilter} />
        <FilterButton label="Daily" value="daily" filter={filter} setFilter={setFilter} />

      </div>

      {/* LISTADO */}
      <div className="space-y-6">

        {filteredPredictions.map((p: any) => {

          const raceDate = p.race_datetime
            ? new Date(p.race_datetime)
            : new Date(p.created_at);

          const now = new Date();
          const raceStarted = raceDate.getTime() <= now.getTime();

          return (
            <div
              key={p.id}
              className={`p-6 rounded-xl border shadow-sm ${
                p.type === "daily"
                  ? "bg-yellow-500/10 border-yellow-500/40"
                  : "bg-slate-900 border-slate-800"
              }`}
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-4">

                <div>
                  <h2 className="text-xl font-bold">
                    🐎 {p.horse}
                  </h2>

                  <p className="text-sm text-slate-400">
                    {raceDate.toLocaleString("es-ES", {
                      timeZone: "Europe/Madrid",
                    })}
                  </p>
                </div>

                <div className="flex gap-3 items-center">

                  {p.type === "daily" && (
                    <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-semibold">
                      Daily
                    </span>
                  )}

                  {p.result === "pending" && (
                    <span className="text-slate-400 text-sm">
                      Pendiente
                    </span>
                  )}

                  {p.result === "won" && (
                    <span className="text-green-400 font-semibold">
                      Ganado
                    </span>
                  )}

                  {p.result === "lost" && (
                    <span className="text-red-400 font-semibold">
                      Perdido
                    </span>
                  )}

                  {p.result === "void" && (
                    <span className="text-yellow-400 font-semibold">
                      Nulo
                    </span>
                  )}

                </div>

              </div>

              {/* INFO */}
              <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300 mb-5">

                <div className="space-y-1">
                  <p>📍 Hipódromo: {p.racecourse}</p>
                  <p>🏁 Carrera: {p.race}</p>
                  <p>🕒 Hora: {p.race_time}</p>
                </div>

                <div className="space-y-1">
                  <p>💰 Cuota: {p.odds}</p>
                  <p>📊 Stake: {p.stake}</p>

                  {/* NUEVO: contador usuarios */}
                  <p className="text-blue-400 text-xs">
                    👥 Usuarios: {p.users_count || 0}
                  </p>

                  {p.result === "pending" && (
                    raceStarted ? (
                      <p className="text-red-400 text-xs">
                        Carrera iniciada
                      </p>
                    ) : (
                      <p className="text-green-400 text-xs">
                        Carrera pendiente
                      </p>
                    )
                  )}

                </div>

              </div>

              {/* BOTONES */}
              {p.result === "pending" && (
                <div className="flex gap-4">

                  <button
                    onClick={() => updateResult(p.id, "won")}
                    className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    ✅ Ganado
                  </button>

                  <button
                    onClick={() => updateResult(p.id, "lost")}
                    className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    ❌ Perdido
                  </button>

                  <button
                    onClick={() => updateResult(p.id, "void")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    ⚖️ Nulo
                  </button>

                </div>
              )}

            </div>
          );
        })}

      </div>

    </div>
  );
}

function FilterButton({ label, value, filter, setFilter }: any) {
  return (
    <button
      onClick={() => setFilter(value)}
      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
        filter === value
          ? "bg-green-500 text-black"
          : "bg-slate-800 hover:bg-slate-700"
      }`}
    >
      {label}
    </button>
  );
}