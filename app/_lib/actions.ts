"use server";

import { auth, CustomSession, signIn, signOut } from "@/app/_lib/auth";
import { supabase } from "@/app/_lib/supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "@/app/_lib/data-service";
import { redirect } from "next/navigation";

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

  const { error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session?.user?.guestId ?? 0);

  if (error) {
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteBooking(bookingId: number) {
  const session = (await auth()) as CustomSession;

  if (!session) {
    throw new Error("You must be logged in");
  }

  const guestBookings = await getBookings(session.user.guestId ?? 0);

  const guestBookingIds = guestBookings?.map((booking) => booking.id);

  if (!guestBookingIds?.includes(bookingId)) {
    throw new Error("You are not allowed to delete this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateBooking(formData: FormData) {
  const session = (await auth()) as CustomSession;

  if (!session) {
    throw new Error("You must be logged in");
  }

  const updateData = {
    numGuests: Number(formData.get("numGuests")),
    observations: String(formData.get("observations")?.slice(1000)),
  };

  const guestBookings = await getBookings(session.user.guestId ?? 0);

  const guestBookingIds = guestBookings?.map((booking) => booking.id);

  const bookingId = Number(formData.get("bookingId"));

  if (!guestBookingIds?.includes(bookingId)) {
    throw new Error("You are not allowed to update this booking");
  }

  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId);

  if (error) {
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}

export async function createBooking(
  bookingData: {
    startDate: string;
    endDate: string;
    numNights: number;
    cabinPrice: number;
    cabinId: number;
  },
  formData: FormData,
) {
  const session = (await auth()) as CustomSession;

  if (!session) {
    throw new Error("You must be logged in");
  }

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: String(formData.get("observations")).slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  console.log(newBooking);

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) {
    console.log(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}
