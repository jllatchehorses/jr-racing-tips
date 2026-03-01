"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function RegistroPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ NUEVOS ESTADOS LEGALES
  const [isAdult, setIsAdult] = useState(false);
  const [acceptedLegal, setAcceptedLegal] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const nombre = formData.get("nombre") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const telefono = formData.get("telefono") as string;

    // 🔐 Validaciones profesionales
    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    // ✅ VALIDACIONES LEGALES
    if (!isAdult) {
      setErrorMessage("Debes confirmar que eres mayor de 18 años.");
      setLoading(false);
      return;
    }

    if (!acceptedLegal) {
      setErrorMessage("Debes aceptar el Aviso Legal y la Política de Privacidad.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          telefono,
          is_adult_confirmed: true,
          legal_accepted: true,
        },
      },
    });

    if (error) {
      setErrorMessage(error.message);
    } else {
      setMessage(
        "Registro exitoso. Revisa tu email para confirmar tu cuenta."
      );
      e.currentTarget.reset();
      setIsAdult(false);
      setAcceptedLegal(false);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-800">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Crear Cuenta
        </h1>

        <form onSubmit={handleRegister} className="space-y-6">

          {/* Nombre */}
          <input
            name="nombre"
            type="text"
            placeholder="Nombre completo"
            required
            className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
          />

          {/* Teléfono */}
          <div>
            <input
              name="telefono"
              type="tel"
              placeholder="Teléfono"
              autoComplete="tel"
              className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
            />
            <p className="text-xs text-slate-500 mt-2">
              Necesario únicamente si deseas recibir los pronósticos por WhatsApp.
            </p>
          </div>

          {/* Contraseña */}
          <input
            name="password"
            type="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            required
            autoComplete="new-password"
            className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
          />

          {/* Confirmar Contraseña */}
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            required
            autoComplete="new-password"
            className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
          />

          {/* 🔥 BLOQUE LEGAL NUEVO */}
          <div className="space-y-4 text-sm">

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isAdult}
                onChange={() => setIsAdult(!isAdult)}
                className="mt-1 accent-green-500"
              />
              <span className="text-slate-300">
                Confirmo que soy mayor de 18 años.
              </span>
            </label>

            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={acceptedLegal}
                onChange={() => setAcceptedLegal(!acceptedLegal)}
                className="mt-1 accent-green-500"
              />
              <span className="text-slate-300">
                He leído y acepto el{" "}
                <a
                  href="/aviso-legal"
                  target="_blank"
                  className="text-green-400 hover:underline"
                >
                  Aviso Legal
                </a>{" "}
                y la{" "}
                <a
                  href="/politica-privacidad"
                  target="_blank"
                  className="text-green-400 hover:underline"
                >
                  Política de Privacidad
                </a>.
              </span>
            </label>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 font-semibold py-4 rounded-lg"
          >
            {loading ? "Creando cuenta..." : "Registrarse"}
          </button>

        </form>

        {/* Mensaje de error */}
        {errorMessage && (
          <p className="mt-6 text-sm text-center text-red-400">
            {errorMessage}
          </p>
        )}

        {/* Mensaje éxito */}
        {message && (
          <p className="mt-6 text-sm text-center text-green-400">
            {message}
          </p>
        )}

      </div>
    </div>
  );
}