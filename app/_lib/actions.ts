"use server";

import { auth, CustomSession, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
  });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData: FormData) {
  const session = (await auth()) as CustomSession;

  if (!session) {
    throw new Error("You must be logged in");
  }

  const nationalID = formData.get("nationalID") as string;
  const [nationality, countryFlag] = (
    formData.get("nationality") as string
  )?.split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) {
    throw new Error("Please provide a valid national ID");
  }

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session?.user?.guestId ?? 0);

  if (error) {
    throw new Error("Guest could not be updated");
  }
}
