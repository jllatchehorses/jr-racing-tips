import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import Link from "next/link";

export default async function AdminClientsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 🔒 Seguridad admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (!user || profile?.role !== "admin") {
    redirect("/");
  }

  const { data: clients } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      user_packages (
        id,
        remaining_predictions,
        packages (
          name,
          type
        )
      )
    `);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Panel Admin — Clientes
      </h1>

      <div className="space-y-6">
        {clients?.map((client: any) => {
          const activePackages =
            client.user_packages?.filter((p: any) => {
              if (p.packages?.type === "consumable") {
                return p.remaining_predictions > 0;
              }
              return true;
            }) || [];

          return (
            <div
              key={client.id}
              className="bg-slate-900 p-6 rounded-xl border border-slate-800"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    {client.full_name || "Sin nombre"}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {client.email}
                  </p>
                </div>

                <Link
                  href={`/admin/clients/${client.id}`}
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Ver detalle
                </Link>
              </div>

              <div className="mt-4 text-sm text-slate-300">
                {activePackages.length > 0 ? (
                  activePackages.map((p: any) => (
                    <div key={p.id}>
                      📦 {p.packages?.name} —{" "}
                      {p.packages?.type === "consumable"
                        ? `${p.remaining_predictions} restantes`
                        : "Activo"}
                    </div>
                  ))
                ) : (
                  <span className="text-slate-500">
                    Sin paquetes activos
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}