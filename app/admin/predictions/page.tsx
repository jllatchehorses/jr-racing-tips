import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabaseServer";
import { revalidatePath } from "next/cache";

export default async function AdminPredictionsPage() {
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

  const { data: predictions } = await supabase
    .from("predictions")
    .select("*")
    .order("created_at", { ascending: false });

  async function updateResult(formData: FormData) {
    "use server";

    const id = formData.get("id") as string;
    const result = formData.get("result") as string;

    const supabase = await createClient();

    await supabase
      .from("predictions")
      .update({ result })
      .eq("id", id);

    revalidatePath("/admin/predictions");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-10 text-green-400">
        Panel Admin — Pronósticos
      </h1>

      <div className="space-y-6">
        {predictions?.map((p: any) => (
          <div
            key={p.id}
            className="bg-slate-900 p-6 rounded-xl border border-slate-800"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">
                🐎 {p.horse}
              </h2>

              <span className="text-sm text-slate-400">
                {new Date(p.created_at).toLocaleString()}
              </span>
            </div>

            <div className="text-sm text-slate-300 space-y-1 mb-4">
              <p>📍 {p.racecourse}</p>
              <p>🏁 {p.race}</p>
              <p>🕒 {p.race_time}</p>
              <p>💰 Cuota: {p.odds}</p>
              <p>📊 Stake: {p.stake}</p>
            </div>

            <div className="mb-4">
              <span className="text-sm">
                Estado actual:{" "}
                {p.result === "pending" && (
                  <span className="text-slate-400">Pendiente</span>
                )}
                {p.result === "won" && (
                  <span className="text-green-400 font-semibold">Ganado</span>
                )}
                {p.result === "lost" && (
                  <span className="text-red-400 font-semibold">Perdido</span>
                )}
                {p.result === "void" && (
                  <span className="text-yellow-400 font-semibold">Nulo</span>
                )}
              </span>
            </div>

            {p.result === "pending" && (
              <form action={updateResult} className="flex flex-wrap gap-4">
                <input type="hidden" name="id" value={p.id} />

                <button
                  type="submit"
                  name="result"
                  value="won"
                  className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  ✅ Marcar Ganado
                </button>

                <button
                  type="submit"
                  name="result"
                  value="lost"
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  ❌ Marcar Perdido
                </button>

                <button
                  type="submit"
                  name="result"
                  value="void"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  ⚖️ Marcar Nulo
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}