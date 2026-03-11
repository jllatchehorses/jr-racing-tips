import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET() {
  const supabase = await createClient();

  // 🔐 Verificar usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  // 🔐 Verificar que es admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json(
      { error: "Acceso denegado" },
      { status: 403 }
    );
  }

  // 📊 Obtener predictions
  const { data: predictions, error } = await supabase
    .from("predictions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  // 👥 Contar usuarios por prediction
  const predictionsWithUsers = await Promise.all(
    (predictions || []).map(async (p: any) => {

      const { count } = await supabase
        .from("user_predictions")
        .select("*", { count: "exact", head: true })
        .eq("prediction_id", p.id);

      return {
        ...p,
        users_count: count || 0,
      };
    })
  );

  return NextResponse.json({ predictions: predictionsWithUsers });
}