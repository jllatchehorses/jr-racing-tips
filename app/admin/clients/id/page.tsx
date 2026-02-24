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

  const { data: client } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single();

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
        Cliente — {client?.full_name}
      </h1>

      <div className="space-y-10">

        {/* PAQUETES */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            📦 Historial de Paquetes
          </h2>

          <div className="space-y-3">
            {packages?.map((p: any) => (
              <div
                key={p.id}
                className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm"
              >
                {p.packages?.name} —{" "}
                {p.packages?.type === "consumable"
                  ? `${p.remaining_predictions} restantes`
                  : "Activo"}
              </div>
            ))}
          </div>
        </div>

        {/* PICKS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            🏇 Picks Asignados
          </h2>

          <div className="space-y-3">
            {predictions?.map((p: any) => (
              <div
                key={p.id}
                className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-sm"
              >
                {p.predictions?.horse} —{" "}
                {p.predictions?.result}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}