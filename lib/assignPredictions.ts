import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function assignActivePredictionsToUser(
  userId: string,
  pack: any,
  userPackageId: string
) {
  const supabase = supabaseAdmin;
  const nowIso = new Date().toISOString();

  // =========================
  // 🎯 DAILY
  // =========================
  if (pack.type === "daily") {
    const { data: dailyPredictions, error } = await supabase
      .from("predictions")
      .select("*")
      .eq("type", "daily")
      .eq("result", "pending")
      .gt("race_datetime", nowIso)
      .order("race_datetime", { ascending: true })
      .limit(1);

    if (error) {
      console.log("ERROR BUSCANDO DAILY:", error);
      return;
    }

    if (!dailyPredictions || dailyPredictions.length === 0) {
      console.log("NO SE ENCONTRÓ DAILY");
      return;
    }

    const dailyPrediction = dailyPredictions[0];

    // Evitar duplicado
    const { data: existing } = await supabase
      .from("user_predictions")
      .select("id")
      .eq("user_id", userId)
      .eq("prediction_id", dailyPrediction.id)
      .limit(1);

    if (existing && existing.length > 0) return;

    // Insertar asignación
    await supabase.from("user_predictions").insert({
      user_id: userId,
      prediction_id: dailyPrediction.id,
      assigned_at: new Date().toISOString(),
    });

    // 🔥 Consumir paquete con ADMIN (sin RLS)
    const { error: updateError } = await supabase
      .from("user_packages")
      .update({
        remaining_predictions: 0,
        status: "consumed",
      })
      .eq("id", userPackageId);

    if (updateError) {
      console.log("ERROR CONSUMIENDO PAQUETE:", updateError);
    }

    return;
  }

  // =========================
  // 🎯 CONSUMABLE
  // =========================
  if (pack.type === "consumable") {
    const { data: userPackage } = await supabase
      .from("user_packages")
      .select("remaining_predictions")
      .eq("id", userPackageId)
      .single();

    if (!userPackage || !userPackage.remaining_predictions) return;

    const { data: predictions } = await supabase
      .from("predictions")
      .select("*")
      .eq("type", "regular")
      .eq("result", "pending")
      .gt("race_datetime", nowIso)
      .order("race_datetime", { ascending: true });

    if (!predictions || predictions.length === 0) return;

    let remaining = userPackage.remaining_predictions;

    for (const prediction of predictions) {
      if (remaining <= 0) break;

      const { data: exists } = await supabase
        .from("user_predictions")
        .select("id")
        .eq("user_id", userId)
        .eq("prediction_id", prediction.id)
        .limit(1);

      if (exists && exists.length > 0) continue;

      await supabase.from("user_predictions").insert({
        user_id: userId,
        prediction_id: prediction.id,
        assigned_at: new Date().toISOString(),
      });

      remaining--;
    }

    await supabase
      .from("user_packages")
      .update({ remaining_predictions: remaining })
      .eq("id", userPackageId);

    return;
  }

  // =========================
  // 🎯 SUBSCRIPTION
  // =========================
  if (pack.type === "subscription") {
    const { data: predictions } = await supabase
      .from("predictions")
      .select("*")
      .eq("result", "pending")
      .gt("race_datetime", nowIso);

    if (!predictions) return;

    for (const prediction of predictions) {
      const { data: exists } = await supabase
        .from("user_predictions")
        .select("id")
        .eq("user_id", userId)
        .eq("prediction_id", prediction.id)
        .limit(1);

      if (exists && exists.length > 0) continue;

      await supabase.from("user_predictions").insert({
        user_id: userId,
        prediction_id: prediction.id,
        assigned_at: new Date().toISOString(),
      });
    }

    return;
  }
}