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

  return NextResponse.json({ predictions });
}