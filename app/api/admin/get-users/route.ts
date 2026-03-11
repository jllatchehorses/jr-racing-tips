import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET() {

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

  const { data: users } = await supabase
    .from("profiles")
    .select("id,email,balance,created_at")
    .order("created_at", { ascending: false });

  const usersWithStats = await Promise.all(
    (users || []).map(async (u:any) => {

      const { count: activePackages } = await supabase
        .from("user_packages")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.id)
        .eq("status", "active");

      const { count: predictions } = await supabase
        .from("user_predictions")
        .select("*", { count: "exact", head: true })
        .eq("user_id", u.id);

      return {
        ...u,
        active_packages: activePackages || 0,
        predictions: predictions || 0,
      };

    })
  );

  return NextResponse.json({ users: usersWithStats });
}