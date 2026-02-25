import { redirect } from "next/navigation";
import { createClient } from "../../../../lib/supabaseServer";

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
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

  // Obtener cliente
  const { data: client } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!client) {
    redirect("/admin/clients");
  }

  // Paquetes del cliente
  const { data: packages } = await supabase
    .from("user_packages")
    .select(`
      id,
      remaining_predictions,
      created_at,
      packages (
        name,
        type
      )
    `)
    .eq("user_id", params.id)
    .order("created_at", { ascending: false });

  // Picks asignados
  const { data: predictions } = await supabase
    .from("user_predictions")
    .select(`
      id,
      assigned_at,
      predictions (
        horse,
        result,
        type
      )
    `)
    .eq("user_id", params.id)
    .order("assigned_at", { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Cliente — {client.full_name || client.email}
      </h1>

      <div className="space-y-12">

        {/* HISTORIAL DE PAQUETES */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            📦 Historial de Paquetes
          </h2>

          {packages && packages.length > 0 ? (
            <div className="space-y-3">
              {packages.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm flex justify-between items-center"
                >
                  <div>
                    {p.packages?.name}
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="font-semibold">
                    {p.packages?.type === "consumable"
                      ? `${p.remaining_predictions} restantes`
                      : "Mensual Activo"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">
              No tiene paquetes registrados.
            </p>
          )}
        </div>

        {/* PICKS ASIGNADOS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            🏇 Picks Asignados
          </h2>

          {predictions && predictions.length > 0 ? (
            <div className="space-y-3">
              {predictions.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm flex justify-between items-center"
                >
                  <div>
                    <div className="font-semibold">
                      {p.predictions?.horse}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {new Date(p.assigned_at).toLocaleDateString()}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      p.predictions?.result === "won"
                        ? "bg-green-500"
                        : p.predictions?.result === "lost"
                        ? "bg-red-500"
                        : p.predictions?.result === "void"
                        ? "bg-yellow-500 text-black"
                        : "bg-slate-600"
                    }`}
                  >
                    {p.predictions?.result || "pending"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">
              No tiene picks asignados.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}