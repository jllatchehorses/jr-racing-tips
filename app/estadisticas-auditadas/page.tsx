"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function EstadisticasPage() {
  const [selectedMonth, setSelectedMonth] = useState("total");
  const [showOthers, setShowOthers] = useState(false);

  const monthlyData = {
    total: {
      roi: 18.4,
      pronosticos: 120,
      profit: 45.6,
      aciertos: 78,
      fallos: 42,
      yield: 21,
    },
    "2026-02": {
      roi: 18.4,
      pronosticos: 21,
      profit: 18.4,
      aciertos: 18,
      fallos: 3,
      yield: 34,
    },
  } as const;

  const data = monthlyData[selectedMonth as keyof typeof monthlyData];

  const circuitosDestacados = [
    { nombre: "ASCOT", roi: 31, pronosticos: 12 },
    { nombre: "KEMPTON", roi: 25, pronosticos: 9 },
    { nombre: "CHELTENHAM", roi: 40, pronosticos: 7 },
    { nombre: "LINGFIELD", roi: 18, pronosticos: 6 },
    { nombre: "NEWMARKET", roi: 12, pronosticos: 5 },
    { nombre: "SOUTHWELL", roi: 16, pronosticos: 4 },
  ];

  const otrosCircuitos = [
    { nombre: "GOODWOOD", roi: 8, pronosticos: 3 },
    { nombre: "YORK", roi: 14, pronosticos: 2 },
    { nombre: "SANDOWN", roi: -5, pronosticos: 2 },
  ];

  const evolucionMensual = [
    { mes: "Ene", roi: 12 },
    { mes: "Feb", roi: 18 },
    { mes: "Mar", roi: 9 },
    { mes: "Abr", roi: 22 },
  ];

  return (
    <div className="space-y-20">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <div>
          <h1 className="text-4xl font-bold">Estadísticas Auditadas</h1>
          <p className="text-slate-400 mt-3">
            Transparencia absoluta. Datos reales. Rendimiento verificable.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-700 rounded-xl px-6 py-4">
          <p className="text-xs text-slate-400 mb-2">Seleccionar período</p>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-md px-4 py-2 text-sm"
          >
            <option value="total">Total Histórico</option>
            <option value="2026-02">Febrero 2026</option>
          </select>
        </div>
      </div>

      {/* KPI */}
      <section className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
        <StatCard title="ROI" value={`${data.roi}%`} />
        <StatCard title="Pronósticos" value={data.pronosticos} />
        <StatCard title="Profit" value={`${data.profit} ud`} />
        <StatCard title="Aciertos" value={data.aciertos} />
        <StatCard title="Fallos" value={data.fallos} />
        <StatCard title="Yield" value={`${data.yield}%`} />
      </section>

      {/* GRÁFICO */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.2)]">
        <h2 className="text-xl font-semibold mb-6">Evolución ROI</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={evolucionMensual}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="mes" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="roi"
              stroke="#22c55e"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* CIRCUITOS DESTACADOS */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Circuitos Destacados</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circuitosDestacados.map((circuito, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]"
            >
              <p className="font-semibold mb-4">🏁 {circuito.nombre}</p>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">ROI</span>
                <span className="text-green-400 font-semibold">
                  {circuito.roi}%
                </span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-slate-400">Pronósticos</span>
                <span>{circuito.pronosticos}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OTROS CIRCUITOS */}
      <section className="space-y-4">
        <button
          onClick={() => setShowOthers(!showOthers)}
          className="text-base font-semibold text-slate-300 hover:text-green-400 transition"
        >
          {showOthers ? "▼ Ocultar otros circuitos" : "▶ Ver otros circuitos"}
        </button>

        {showOthers && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.2)]">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-800 text-slate-400">
                <tr>
                  <th className="text-left py-2">Circuito</th>
                  <th className="text-left py-2">Pronósticos</th>
                  <th className="text-left py-2">ROI</th>
                </tr>
              </thead>
              <tbody>
                {otrosCircuitos.map((circuito, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-800 hover:bg-slate-800/40 transition"
                  >
                    <td className="py-2">{circuito.nombre}</td>
                    <td className="py-2">{circuito.pronosticos}</td>
                    <td className="py-2 text-green-400 font-semibold">
                      {circuito.roi}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

    </div>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:border-green-500 hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-xl font-bold mt-2 text-green-400">{value}</p>
    </div>
  );
}