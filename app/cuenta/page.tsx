"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CuentaPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* HEADER */}
      <div className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Hola, {user.user_metadata?.nombre || "Usuario"}
            </h1>
            <p className="text-sm text-slate-400">
              Bienvenido a tu área privada
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-lg font-semibold text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-14 space-y-10">

        {/* INFORMACIÓN USUARIO */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-lg font-semibold mb-6 text-green-400">
            Información del Usuario
          </h2>

          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <p className="text-slate-400">Nombre</p>
              <p className="font-semibold">
                {user.user_metadata?.nombre || "No disponible"}
              </p>
            </div>

            <div>
              <p className="text-slate-400">Correo electrónico</p>
              <p className="font-semibold">{user.email}</p>
            </div>

            <div>
              <p className="text-slate-400">Estado</p>
              <p className="font-semibold text-green-400">Activa</p>
            </div>
          </div>
        </div>

        {/* PAQUETES ACTIVOS */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-lg font-semibold mb-6">
            📦 Paquetes activos
          </h2>

          <div className="space-y-4">
            <div className="bg-slate-800 p-5 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-semibold">🎯 Apuesta del día</p>
                <p className="text-xs text-slate-400">Activa</p>
              </div>
              <span className="text-green-400 font-semibold text-sm">
                En vigor
              </span>
            </div>

            <div className="bg-slate-800 p-5 rounded-xl flex justify-between items-center">
              <div>
                <p className="font-semibold">📦 Pack 5 pronósticos</p>
                <p className="text-xs text-slate-400">
                  3 pronósticos restantes
                </p>
              </div>
              <span className="text-yellow-400 font-semibold text-sm">
                Parcialmente usado
              </span>
            </div>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            Los pronósticos se envían por WhatsApp o correo electrónico según la modalidad contratada.
          </p>
        </div>

        {/* PRONÓSTICOS */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-lg font-semibold mb-6">
            🏇 Pronósticos Disponibles
          </h2>

          <div className="bg-slate-800 p-6 rounded-xl text-sm text-slate-400">
            En este apartado se mostrarán los pronósticos correspondientes a tus paquetes activos.
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Se publican únicamente cuando se detecta valor real.</li>
              <li>Cada selección incluye stake recomendado.</li>
            </ul>
          </div>
        </div>

        {/* HISTORIAL */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-lg font-semibold mb-6">
            🧾 Historial de compras
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>12/02/2026</span>
              <span>Pack 5 pronósticos</span>
            </div>
            <div className="flex justify-between border-b border-slate-800 pb-2">
              <span>10/02/2026</span>
              <span>Apuesta del día</span>
            </div>
            <div className="flex justify-between">
              <span>05/02/2026</span>
              <span>Apuesta del día</span>
            </div>
          </div>
        </div>

        {/* SOPORTE */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            🛠️ Soporte
          </h2>

          <p className="text-sm text-slate-400 mb-6">
            Si tienes cualquier duda sobre tu cuenta, paquetes o pronósticos,
            puedes ponerte en contacto con nuestro equipo.
          </p>

          <div className="flex flex-wrap gap-4">
           <a
  href="/contacto"
  className="bg-green-500 hover:bg-green-600 hover:scale-105 active:scale-95 transition-all duration-300 px-5 py-3 rounded-lg font-semibold text-sm flex items-center gap-2"
>
  🎧 Contactar con soporte
</a>

           <a
  href="mailto:soporte@tudominio.com?subject=Consulta sobre mi cuenta JR Racing Tips"
  className="border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition px-5 py-3 rounded-lg text-sm flex items-center gap-2"
>
  ✉️ Enviar email directo
</a>
          </div>
        </div>

      </div>
    </div>
  );
}