import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET() {

  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .order("price", { ascending: true });

  return NextResponse.json({ packages });

}