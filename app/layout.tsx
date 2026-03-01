import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";
import Navbar from "./components/Navbar";
import { createClient } from "@/lib/supabaseServer";

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("full_name, role, balance")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-900 text-white`}
      >

        <div className="relative z-50">
  <Navbar user={user} profile={profile} />
</div>

        <main className="relative min-h-screen overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-black"></div>

          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-green-400/5 rounded-full blur-3xl"></div>

          <div className="relative z-10 p-12 text-white">
            {children}
          </div>

        </main>

        <footer className="text-center text-slate-500 text-sm py-10 border-t border-slate-800 mt-20">
          <div className="space-x-6">
            <a href="/aviso-legal" className="hover:text-green-400">
              Aviso Legal
            </a>
            <a href="/politica-privacidad" className="hover:text-green-400">
              Política de Privacidad
            </a>
          </div>
          <p className="mt-4">
            © {new Date().getFullYear()} JR Racing Tips
          </p>
        </footer>

        <WhatsAppButton />

      </body>
    </html>
  );
}