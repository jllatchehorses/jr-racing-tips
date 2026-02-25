import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabaseServer";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!user || profile?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 space-y-6">
        <h2 className="text-xl font-bold text-green-400">
          Admin Panel
        </h2>

       <nav className="flex flex-col space-y-3 text-sm">
  <Link href="/admin" className="hover:text-green-400">
    📊 Dashboard
  </Link>

  <Link href="/admin/publicar" className="hover:text-green-400">
    ➕ Publicar
  </Link>

  <Link href="/admin/clients" className="hover:text-green-400">
    👥 Clientes
  </Link>

  <Link href="/admin/predictions" className="hover:text-green-400">
    🏇 Pronósticos
  </Link>
</nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-10">
        {children}
      </main>
    </div>
  );
}