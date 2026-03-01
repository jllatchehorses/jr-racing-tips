"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

interface NavbarProps {
  user: any;
  profile: any;
}

export default function Navbar({ user, profile }: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path ? "text-green-400" : "hover:text-green-400";

  return (
    <nav className="w-full bg-slate-900/95 backdrop-blur border-b border-slate-800 shadow-[0_0_40px_rgba(34,197,94,0.05)] px-10 py-4 flex items-center justify-between">

      {/* Logo */}
      <div className="text-xl font-bold tracking-wide text-white">
        JR Racing Tips
      </div>

      {/* Navegación principal */}
      <div className="hidden md:flex space-x-8 text-sm font-medium text-white">
        <a href="/" className={`${isActive("/")} transition`}>
          Inicio
        </a>
        <a href="/como-funciona" className={`${isActive("/como-funciona")} transition`}>
          Cómo funciona
        </a>
        <a href="/carreras" className={`${isActive("/carreras")} transition`}>
          Carreras Hoy
        </a>
        <a href="/estadisticas-auditadas" className={`${isActive("/estadisticas-auditadas")} transition`}>
          Estadísticas
        </a>
        <a href="/paquetes" className={`${isActive("/paquetes")} transition`}>
          Paquetes
        </a>
      </div>

      {/* Derecha */}
      <div className="flex items-center space-x-6 text-sm relative">

        <a href="/contacto" className="hover:text-green-400 transition text-white">
          Contacto
        </a>

        {user ? (
          <div className="relative">

            {/* Botón usuario */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-3 hover:text-green-400 transition text-white"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>

              <span>
                {profile?.full_name || user.email}
              </span>

              {profile?.role === "admin" && (
                <span className="bg-green-500 text-black text-xs px-2 py-0.5 rounded">
                  Admin
                </span>
              )}

              {profile?.balance > 0 && (
                <span className="text-green-400 font-semibold">
                  {profile.balance}€
                </span>
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 text-white overflow-hidden">

                <a
                  href="/cuenta"
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3 hover:bg-slate-700 transition"
                >
                  👤 Mi cuenta
                </a>

                <a
                  href="/contacto"
                  onClick={() => setOpen(false)}
                  className="block px-5 py-3 hover:bg-slate-700 transition"
                >
                  🛠 Soporte
                </a>

                <div className="border-t border-slate-700"></div>

                {/* Logout integrado */}
                <div
                  onClick={() => setOpen(false)}
                  className="block"
                >
                  <LogoutButton />
                </div>

              </div>
            )}
          </div>
        ) : (
          <>
            <a
              href="/login"
              className="hover:text-green-400 transition text-white"
            >
              Iniciar sesión
            </a>

            <a
              href="/registro"
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md transition"
            >
              Registrarse
            </a>
          </>
        )}

      </div>
    </nav>
  );
}