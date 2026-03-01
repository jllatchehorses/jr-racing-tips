import { SupabaseClient } from "@supabase/supabase-js";

export async function assignActivePredictionsToUser(
  supabase: SupabaseClient,
  userId: string,
  pack: any
) {
  const now = new Date().toISOString();

  // 1️⃣ Obtener predictions activos (pending + con fecha futura válida)
  let query = supabase
    .from("predictions")
    .select("*")
    .eq("result", "pending")
    .not("race_datetime", "is", null) // 🔒 evita picks antiguos sin fecha
    .gt("race_datetime", now)
    .order("race_datetime", { ascending: true });

  // 🎯 Filtrado por tipo de pack
  if (pack.type === "daily") {
    query = query.eq("type", "daily").limit(1);
  }

  if (pack.type === "consumable") {
    query = query
      .eq("type", "regular")
      .limit(pack.total_predictions);
  }

  // subscription recibe todos los pending futuros

  const { data: predictions, error } = await query;

  if (error) {
    console.error("Error obteniendo predictions activas:", error);
    return;
  }

  if (!predictions || predictions.length === 0) return;

  for (const prediction of predictions) {
    // 2️⃣ Evitar duplicados
    const { data: existing } = await supabase
      .from("user_predictions")
      .select("id")
      .eq("user_id", userId)
      .eq("prediction_id", prediction.id)
      .maybeSingle();

    if (existing) continue;

    // 3️⃣ Insertar asignación
    await supabase.from("user_predictions").insert({
      user_id: userId,
      prediction_id: prediction.id,
      assigned_at: new Date().toISOString(),
    });
  }
}