import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JR Racing Tips",
  description: "Professional horse racing analysis platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white`}
      >
        {/* NAVBAR */}
        <nav className="w-full bg-slate-900 px-10 py-4 flex items-center justify-between border-b border-slate-700">

          {/* Logo */}
          <div className="text-xl font-bold tracking-wide text-white">
            JR Racing Tips
          </div>

          {/* Navegación principal */}
          <div className="hidden md:flex space-x-8 text-sm font-medium text-white">
            <a href="/" className="hover:text-green-400 transition">
              Inicio
            </a>
            <a href="/como-funciona" className="hover:text-green-400 transition">
              Cómo funciona
            </a>
            <a href="/carreras" className="hover:text-green-400 transition">
              Carreras Hoy
            </a>
            <a href="/estadisticas-auditadas" className="hover:text-green-400 transition">
              Estadísticas auditadas
            </a>
            <a href="/paquetes" className="hover:text-green-400 transition">
              Paquetes
            </a>
          </div>

          {/* Derecha */}
          <div className="flex items-center space-x-6 text-sm">

            <a href="/sobre" className="hover:text-green-400 transition text-white">
              Sobre el proyecto
            </a>

            <a href="/contacto" className="hover:text-green-400 transition text-white">
              Contacto
            </a>

            <a href="/login" className="hover:text-green-400 transition text-white">
              Iniciar sesión
            </a>

            <a
              href="/registro"
              className="bg-green-500 hover:bg-green-600 text-black font-semibold px-4 py-2 rounded-md transition"
            >
              Registrarse
            </a>
          </div>
        </nav>

        {/* CONTENIDO */}
        <main className="relative min-h-screen overflow-hidden">

          {/* Fondo profesional con gradiente dinámico */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black"></div>

          {/* Luz sutil decorativa */}
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-green-400/5 rounded-full blur-3xl"></div>

          {/* Contenido */}
          <div className="relative z-10 p-12 text-white">
            {children}
          </div>

        </main>

        {/* FOOTER */}
        <footer className="text-center text-slate-500 text-sm py-10 border-t border-slate-800 mt-20">
          <div className="space-x-6">
            <a href="/aviso-legal" className="hover:text-green-400">Aviso Legal</a>
            <a href="/politica-privacidad" className="hover:text-green-400">Política de Privacidad</a>
          </div>
          <p className="mt-4">© {new Date().getFullYear()} JR Racing Tips</p>
        </footer>

        {/* BOTÓN WHATSAPP GLOBAL */}
        <WhatsAppButton />

      </body>
    </html>
  );
}