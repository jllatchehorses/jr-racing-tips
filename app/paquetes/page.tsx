"use client";

import { useEffect, useState } from "react";

export default function PaquetesPage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const flexiblePacks = [
    {
      id: "pack1",
      name: "Pack 1 Pronóstico",
      price: "2,5€",
      features: [
        "1 pronóstico",
        "Stake recomendado",
        "Envío por WhatsApp o email",
        "Validez 48h",
      ],
    },
    {
      id: "pack2",
      name: "Pack 2 Pronósticos",
      price: "4€",
      features: [
        "2 pronósticos",
        "Stake recomendado",
        "Envío por WhatsApp o email",
        "Validez 48h",
      ],
    },
    {
      id: "pack5",
      name: "Pack 5 Pronósticos",
      price: "6€",
      features: [
        "5 pronósticos",
        "Stake recomendado",
        "Envío por WhatsApp o email",
        "Validez 48h",
      ],
    },
    {
      id: "pack10",
      name: "Pack 10 Pronósticos",
      price: "9€",
      features: [
        "10 pronósticos",
        "Stake recomendado",
        "Envío por WhatsApp o email",
        "Validez 5 días",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className={`text-center mb-24 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h1 className="text-4xl font-bold mb-6">
            Paquetes Disponibles
          </h1>

          <p className="text-slate-400 max-w-2xl mx-auto">
            Diferentes modalidades adaptadas a tu ritmo.
            Sin compromisos en los packs individuales.
            Rigor, disciplina y gestión profesional del stake.
          </p>
        </div>

        {/* APUESTA DEL DÍA */}
        <div className={`bg-gradient-to-br from-green-600/20 to-slate-900 border border-green-500 rounded-2xl p-12 mb-24 shadow-xl hover:scale-[1.02] transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="text-xs bg-green-500 text-black px-3 py-1 rounded-full font-semibold">
            GARANTÍA DE DEVOLUCIÓN
          </span>

          <h2 className="text-3xl font-semibold mt-6 mb-4">
            🎯 Apuesta del Día
          </h2>

          <p className="text-5xl font-bold text-green-400 mb-6">
            1,50€
          </p>

          <ul className="space-y-3 text-slate-300 mb-6">
            <li>✔ 1 pronóstico trabajado en profundidad</li>
            <li>✔ Stake recomendado</li>
            <li>✔ Envío por WhatsApp o email</li>
            <li>✔ Devolución del importe si se falla</li>
          </ul>

          <p className="text-slate-400 mb-8">
            Publicada únicamente cuando se detecta valor real.
          </p>

          <button
            data-pack="daily"
            className="bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 text-black font-semibold px-10 py-4 rounded-lg transition-all duration-300"
          >
            CONTRATAR
          </button>

          <p className="text-xs text-slate-500 mt-4">
            Pago seguro. Sin compromiso.
          </p>
        </div>

        {/* PACKS FLEXIBLES */}
        <h2 className="text-2xl font-semibold text-center mb-14">
          Packs Flexibles
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mb-28">
          {flexiblePacks.map((pack, index) => (
            <div
              key={pack.id}
              className={`bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-green-500 hover:scale-105 transition-all duration-300 shadow-md ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="text-lg font-semibold mb-4">
                {pack.name}
              </h3>

              <p className="text-3xl font-bold text-green-400 mb-6">
                {pack.price}
              </p>

              <ul className="space-y-3 text-slate-300 mb-6">
                {pack.features.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>

              <p className="text-xs text-slate-500 mb-6">
                * La Apuesta del Día se contrata de forma independiente.
              </p>

              <button
                data-pack={pack.id}
                className="w-full bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 text-black font-semibold py-3 rounded-lg transition-all duration-300"
              >
                CONTRATAR
              </button>

              <p className="text-xs text-slate-500 mt-4">
                Pago único. Sin renovación automática.
              </p>
            </div>
          ))}
        </div>

        {/* PACK MENSUAL */}
        <div className={`bg-slate-900 border-2 border-green-500 rounded-2xl p-14 shadow-2xl text-center hover:scale-[1.02] transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="text-xs bg-green-500 text-black px-3 py-1 rounded-full font-semibold">
            MÁS ELEGIDO
          </span>

          <h2 className="text-3xl font-semibold mt-6 mb-4">
            🏆 Pack Mensual – Acceso Completo
          </h2>

          <p className="text-6xl font-bold text-green-400 mb-6">
            15€
          </p>

          <ul className="space-y-3 text-slate-300 mb-8 max-w-xl mx-auto">
            <li>✔ Acceso ilimitado a todos los pronósticos</li>
            <li>✔ Incluye Apuesta del Día</li>
            <li>✔ Envío diario</li>
            <li>✔ Mínimo 70 pronósticos al mes</li>
            <li>✔ Renovación automática mensual</li>
          </ul>

          <p className="text-slate-400 mb-8">
            Comprar 70 pronósticos de forma individual superaría ampliamente los 100€.
            El pack mensual concentra todo por solo 15€.
          </p>

          <button
            data-pack="monthly"
            className="bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 text-black font-semibold px-14 py-5 rounded-lg transition-all duration-300 text-lg"
          >
            ACCESO COMPLETO
          </button>

          <p className="text-xs text-slate-500 mt-4">
            Suscripción mensual. Cancelable en cualquier momento.
          </p>
        </div>

        {/* DISCLAIMER */}
        <div className="text-center text-xs text-slate-500 max-w-3xl mx-auto mt-24">
          Los pronósticos se basan en análisis propio.
          No se garantiza beneficio económico.
          <br /><br />
          * Las devoluciones de la Apuesta del Día se gestionarán mediante PayPal o Bizum.
        </div>

      </div>
    </div>
  );
}