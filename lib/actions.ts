"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createReminderAction(
  lat: number,
  lng: number,
  formData: FormData
) {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("You must be logged in to create a reminder.");
  }

  // Extract form fields
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const radius = parseInt(formData.get("radius") as string, 10);

  if (!title) {
    throw new Error("Title is required.");
  }
  if (Number.isNaN(radius) || radius <= 0) {
    throw new Error("Invalid radius.");
  }

  // Insert to Supabase with PostGIS Geography formatting (WKT - Well Known Text)
  // Note: PostGIS expects Longitude first: POINT(lon lat)
  const location_wkt = `POINT(${lng} ${lat})`;

  const { error } = await supabase.from("reminders").insert({
    user_id: user.id,
    title,
    description,
    radius_meters: radius,
    location: location_wkt,
    is_active: true,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error("Failed to save reminder to the database.");
  }

  // Revalidate the main layout/dashboard to show the new reminder immediately
  revalidatePath("/");
  
  return { success: true };
}