import { createClient } from "../../../lib/supabaseServer";
import Link from "next/link";

export default async function AdminClientsPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      role,
      created_at,
      user_packages (
        id,
        remaining_predictions,
        packages (
          name,
          type
        )
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Clientes
      </h1>

      {/* Buscador visual (preparado) */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar por email..."
          className="w-full md:w-1/3 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-green-500 outline-none"
        />
      </div>

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
              className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-green-500 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">
                    {client.full_name || "Sin nombre"}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {client.email}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Rol: {client.role}
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
                        : "Mensual Activo"}
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