"use client";

import { useOptimistic } from "react";
import ReservationCard from "@/app/_components/ReservationCard";
import { Tables } from "@/app/_lib/database.types";
import { deleteBooking } from "@/app/_lib/actions";

export type BookingWithCabin = Pick<
  Tables<"bookings">,
  | "id"
  | "created_at"
  | "startDate"
  | "endDate"
  | "numNights"
  | "numGuests"
  | "totalPrice"
  | "guestId"
  | "cabinId"
  | "status"
> & {
  cabins: Pick<Tables<"cabins">, "name" | "image"> | null;
};

export default function ReservationList({
  bookings,
}: {
  bookings: BookingWithCabin[];
}) {
  const [optimisticBookings, optimisticDelete] = useOptimistic(
    bookings,
    (currentBookings, bookingId) =>
      currentBookings.filter((booking) => booking.id !== bookingId),
  );

  async function handleDelete(bookingId: number) {
    optimisticDelete(bookingId);
    await deleteBooking(bookingId);
  }

  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}
