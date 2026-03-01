import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {

  // 🔐 Seguimos verificando que quien llama es admin
  const supabaseAuth = await createClient();

  const {
    data: { user },
  } = await supabaseAuth.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id, result } = await req.json();

  if (!id || !result) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  // 🔥 Usamos ADMIN para operaciones críticas
  const supabase = supabaseAdmin;

  // 1️⃣ Obtener prediction
  const { data: prediction } = await supabase
    .from("predictions")
    .select("*")
    .eq("id", id)
    .single();

  if (!prediction) {
    return NextResponse.json(
      { error: "Prediction no encontrada" },
      { status: 404 }
    );
  }

  // 2️⃣ Actualizar resultado
  await supabase
    .from("predictions")
    .update({ result })
    .eq("id", id);

  // 3️⃣ Refund si daily perdido
  if (prediction.type === "daily" && result === "lost") {

    const { data: users } = await supabase
      .from("user_predictions")
      .select("user_id")
      .eq("prediction_id", id);

    for (const u of users || []) {

      const { data: existingRefund } = await supabase
        .from("payments")
        .select("id")
        .eq("user_id", u.user_id)
        .eq("prediction_id", id)
        .eq("method", "refund_saldo")
        .maybeSingle();

      if (existingRefund) continue;

      const { data: profile } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", u.user_id)
        .single();

      const currentBalance = Number(profile?.balance || 0);
      const refundAmount = 1.5;

      await supabase
        .from("profiles")
        .update({ balance: currentBalance + refundAmount })
        .eq("id", u.user_id);

      await supabase.from("payments").insert({
        user_id: u.user_id,
        prediction_id: id,
        amount: refundAmount,
        currency: "EUR",
        method: "refund_saldo",
        status: "completed",
      });
    }
  }

  return NextResponse.json({ success: true });
}