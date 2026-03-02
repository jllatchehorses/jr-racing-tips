"use client";

import { useState } from "react";

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    racecourse: "",
    race_time: "", // solo informativo (puedes quitarlo si quieres)
    race: "",
    horse: "",
    odds: "",
    stake: "",
    analysis: "",
    race_datetime: "", // input datetime-local
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePublish = async (type: "regular" | "daily") => {
    setLoading(true);
    setMessage("");

    if (!form.race_datetime) {
      setMessage("Debes indicar fecha y hora de la carrera");
      setLoading(false);
      return;
    }

    // 🔥 Aquí está la clave
    const [race_date, race_time_from_datetime] =
      form.race_datetime.split("T");

    const res = await fetch("/api/admin/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        racecourse: form.racecourse,
        race_date,                     // ✅ ahora enviamos fecha
        race_time: race_time_from_datetime, // ✅ ahora enviamos hora
        race: form.race,
        horse: form.horse,
        odds: form.odds,
        stake: form.stake,
        analysis: form.analysis,
        type,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Error al publicar");
      setLoading(false);
      return;
    }

    setMessage("Pronóstico publicado correctamente ✅");

    setForm({
      racecourse: "",
      race_time: "",
      race: "",
      horse: "",
      odds: "",
      stake: "",
      analysis: "",
      race_datetime: "",
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-20">
      <div className="max-w-3xl mx-auto bg-slate-900 p-10 rounded-2xl border border-slate-800 shadow-lg">

        <h1 className="text-3xl font-bold mb-10 text-green-400">
          Panel de Administración
        </h1>

        <div className="space-y-5">

          <input
            name="racecourse"
            placeholder="Hipódromo"
            value={form.racecourse}
            onChange={handleChange}
            className="input"
          />

          {/* 🔥 Solo dejamos datetime-local */}
          <input
            type="datetime-local"
            name="race_datetime"
            value={form.race_datetime}
            onChange={handleChange}
            className="input"
            required
          />

          <input
            name="race"
            placeholder="Carrera (ej: 3ª)"
            value={form.race}
            onChange={handleChange}
            className="input"
          />

          <input
            name="horse"
            placeholder="Caballo"
            value={form.horse}
            onChange={handleChange}
            className="input"
          />

          <input
            name="odds"
            placeholder="Cuota (ej: 3.20)"
            value={form.odds}
            onChange={handleChange}
            className="input"
          />

          <input
            name="stake"
            placeholder="Stake (ej: 2/10)"
            value={form.stake}
            onChange={handleChange}
            className="input"
          />

          <textarea
            name="analysis"
            placeholder="Análisis"
            value={form.analysis}
            onChange={handleChange}
            rows={4}
            className="input"
          />

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => handlePublish("regular")}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 py-4 rounded-lg font-semibold"
            >
              Publicar Pronóstico
            </button>

            <button
              onClick={() => handlePublish("daily")}
              disabled={loading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 py-4 rounded-lg font-semibold text-black"
            >
              Publicar Apuesta del Día
            </button>
          </div>

          {message && (
            <p className="text-sm mt-4 text-center text-slate-300">
              {message}
            </p>
          )}

        </div>
      </div>
    </div>
  );
}