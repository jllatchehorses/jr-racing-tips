"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage("Email o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/cuenta");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md bg-slate-900 p-10 rounded-2xl shadow-xl border border-slate-800">

        <h1 className="text-3xl font-bold mb-8 text-center">
          Iniciar Sesión
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            autoComplete="email"
            className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
          />

          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            required
            autoComplete="current-password"
            className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 focus:outline-none focus:border-green-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 hover:scale-[1.02] active:scale-95 transition-all duration-300 font-semibold py-4 rounded-lg"
          >
            {loading ? "Accediendo..." : "Iniciar sesión"}
          </button>

        </form>

        {errorMessage && (
          <p className="mt-6 text-sm text-center text-red-400">
            {errorMessage}
          </p>
        )}

      </div>
    </div>
  );
}