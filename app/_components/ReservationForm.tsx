"use client";

import { CabinType } from "@/app/_components/CabinList";
import { useAtom } from "jotai";
import { rangeAtom } from "@/app/_lib/atoms";
import { User } from "next-auth";
import { differenceInDays } from "date-fns";
import { createBooking } from "@/app/_lib/actions";
import SubmitButton from "@/app/_components/SubmitButton";

export default function ReservationForm({
  cabin,
  user,
}: {
  cabin: CabinType;
  user: User;
}) {
  const [range, setRange] = useAtom(rangeAtom);
  const maxCapacity = cabin.maxCapacity ?? 0;
  const regularPrice = cabin.regularPrice ?? 0;
  const discount = cabin.discount ?? 0;
  const cabinId = cabin.id;

  const startDate = range?.from;
  const endDate = range?.to;

  const numNights = differenceInDays(
    endDate ?? new Date(),
    startDate ?? new Date(),
  );

  const cabinPrice = numNights * (regularPrice - discount);

  const bookingData = {
    startDate: (startDate ?? new Date()).toLocaleString(),
    endDate: (endDate ?? new Date()).toLocaleString(),
    numNights,
    cabinPrice,
    cabinId,
  };

  const createBookingWithData = createBooking.bind(null, bookingData);

  return (
    <div className="scale-[1.01]">
      <div className="bg-primary-800 text-primary-300 px-16 py-2 flex justify-between items-center">
        <p>Logged in as</p>

        <div className="flex gap-4 items-center">
          <img
            // Important to display google profile images
            referrerPolicy="no-referrer"
            className="h-8 rounded-full"
            src={user.image ?? undefined}
            alt={user.name ?? undefined}
          />
          <p>{user.name}</p>
        </div>
      </div>
      <form
        // action={createBookingWithData}
        action={async (formData) => {
          await createBookingWithData(formData);
          setRange({ from: undefined, to: undefined });
        }}
        className="bg-primary-900 py-10 px-16 text-lg flex gap-5 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            name="observations"
            id="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            placeholder="Any pets, allergies, special requirements, etc.?"
          />
        </div>

        <div className="flex justify-end items-center gap-6">
          {!(startDate && endDate) ? (
            <p className="text-primary-300 text-base">
              Start by selecting dates
            </p>
          ) : (
            <SubmitButton pendingLabel="Reserving...">Reserve now</SubmitButton>
          )}
        </div>
      </form>
    </div>
  );
}
