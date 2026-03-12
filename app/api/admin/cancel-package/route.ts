import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
  }

  const body = await req.json();

  const { user_package_id } = body;

  if (!user_package_id) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  await supabase
    .from("user_packages")
    .update({
      status: "cancelled",
      remaining_predictions: 0
    })
    .eq("id", user_package_id);

  return NextResponse.json({ success: true });

}