"use client";

import { useEffect, useState } from "react";

export default function PaquetesPage() {
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  async function fetchBalance() {
    try {
      const res = await fetch("/api/get-balance");
      const data = await res.json();
      if (data.balance !== undefined) {
        setBalance(Number(data.balance));
      }
    } catch {
      console.error("Error obteniendo saldo");
    }
  }

  // ✅ UUID REALES
  const PACKAGE_IDS = {
    daily: "e8db1626-d6ce-4f95-9de5-e8f520edccf3",
    pack1: "e5bec699-70b8-4e48-92f0-c7d2367d36c6",
    pack2: "ac44e2d3-d6d1-4904-9cbf-45b8f5fc2f2c",
    pack5: "51d10ad6-ead5-4fb7-8606-1e3a7fc45f1e",
    pack10: "69c72226-89b4-4fe9-a42a-048ca5ffb76e",
    monthly: "a4f4e278-8743-413c-bd23-bca4b64c9b14",
  };

  // 🔥 Flujo profesional de compra
  async function handlePurchase(packageId: string, price: number) {
    if (balance >= price) {
      const useBalance = confirm(
        "Tienes saldo suficiente.\n\nAceptar → pagar con saldo\nCancelar → pagar con tarjeta"
      );

      if (useBalance) {
        const res = await fetch("/api/pay-with-balance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ packageId }),
        });

        const data = await res.json();

        if (data.success) {
          alert("Compra realizada con saldo correctamente.");
          window.location.reload();
        } else {
          alert(data.error || "Error procesando el pago.");
        }

        return;
      }
    }

    alert("Pago con tarjeta disponible próximamente.");
  }

  const flexiblePacks = [
    {
      name: "Pack 1 Pronóstico",
      price: 2.5,
      dbId: PACKAGE_IDS.pack1,
      features: [
        "1 pronóstico",
        "Stake recomendado",
        "Envío por WhatsApp o email",
      ],
    },
    {
      name: "Pack 2 Pronósticos",
      price: 4,
      dbId: PACKAGE_IDS.pack2,
      features: [
        "2 pronósticos",
        "Stake recomendado",
        "Envío por WhatsApp o email",
      ],
    },
    {
      name: "Pack 5 Pronósticos",
      price: 6,
      dbId: PACKAGE_IDS.pack5,
      features: [
        "5 pronósticos",
        "Stake recomendado",
        "Envío por WhatsApp o email",
      ],
    },
    {
      name: "Pack 10 Pronósticos",
      price: 9,
      dbId: PACKAGE_IDS.pack10,
      features: [
        "10 pronósticos",
        "Stake recomendado",
        "Envío por WhatsApp o email",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-24">
      <div className="max-w-6xl mx-auto">

        {/* SALDO */}
        <div className="bg-slate-900 border border-green-500 rounded-xl p-6 mb-20 text-center">
          <p className="text-lg">
            💰 Saldo disponible:{" "}
            <span className="text-green-400 font-bold">
              {balance.toFixed(2)}€
            </span>
          </p>
        </div>

        {/* APUESTA DEL DÍA */}
        <div className="flex justify-center mb-24">
          <div className="w-full max-w-3xl bg-gradient-to-br from-green-600/20 to-slate-900 border border-green-500 rounded-2xl p-12 shadow-xl text-center">

            <span className="text-xs bg-green-500 text-black px-3 py-1 rounded-full font-semibold">
              DEVOLUCIÓN EN SALDO
            </span>

            <h2 className="text-3xl font-semibold mt-6 mb-4">
              🎯 Apuesta del Día
            </h2>

            <p className="text-5xl font-bold text-green-400 mb-6">
              1,50€
            </p>

            <ul className="space-y-3 text-slate-300 mb-8">
              <li>✔ 1 pronóstico trabajado en profundidad</li>
              <li>✔ Stake recomendado</li>
              <li>✔ Envío por WhatsApp o email</li>
              <li>✔ En caso de fallo, devolución como saldo interno</li>
              <li>✔ Disponible para canje con saldo</li>
            </ul>

            <button
              onClick={() => handlePurchase(PACKAGE_IDS.daily, 1.5)}
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-10 py-4 rounded-lg transition"
            >
              CONTRATAR
            </button>
          </div>
        </div>

        {/* PACKS FLEXIBLES */}
        <h2 className="text-2xl font-semibold text-center mb-14">
          Packs Flexibles
        </h2>

        <div className="grid md:grid-cols-4 gap-8 mb-28">
          {flexiblePacks.map((pack, index) => (
            <div
              key={index}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-green-500 transition"
            >
              <h3 className="text-lg font-semibold mb-4">
                {pack.name}
              </h3>

              <p className="text-3xl font-bold text-green-400 mb-6">
                {pack.price}€
              </p>

              <ul className="space-y-3 text-slate-300 mb-6">
                {pack.features.map((feature, i) => (
                  <li key={i}>✔ {feature}</li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(pack.dbId, pack.price)}
                className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg transition"
              >
                CONTRATAR
              </button>

              {(pack.price === 6 || pack.price === 9) && (
                <p className="text-xs text-green-400 mt-3 text-center font-medium">
                  Disponible para canje con saldo
                </p>
              )}
            </div>
          ))}
        </div>

        {/* PACK MENSUAL */}
        <div className="bg-slate-900 border-2 border-green-500 rounded-2xl p-14 shadow-2xl text-center">
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
            <li>✔ Envío diario (Menos Domingos)</li>
            <li>✔ Mínimo 50 pronósticos al mes</li>
            <li>✔ Renovación automática mensual</li>
          </ul>

          <button
            onClick={() => handlePurchase(PACKAGE_IDS.monthly, 15)}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-14 py-5 rounded-lg text-lg transition"
          >
            ACCESO COMPLETO
          </button>

          <p className="text-xs text-green-400 mt-4 font-medium">
            Disponible para canje con saldo
          </p>
        </div>

      </div>
    </div>
  );
}