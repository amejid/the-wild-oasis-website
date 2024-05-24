import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { format, formatDistance, isPast, isToday, parseISO } from "date-fns";
import DeleteReservation from "@/app/_components/DeleteReservation";
import { Tables } from "@/app/_lib/database.types";
import Image from "next/image";

export const formatDistanceFromNow = (dateStr: string) =>
  formatDistance(parseISO(dateStr), new Date(), {
    addSuffix: true,
  }).replace("about ", "");

type BookingWithCabin = Pick<
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

export default function ReservationCard({
  booking,
}: {
  booking: BookingWithCabin;
}) {
  const {
    id,
    guestId,
    startDate,
    endDate,
    numNights,
    totalPrice,
    numGuests,
    status,
    created_at,
    cabins,
  } = booking;

  const cabinName = cabins?.name ?? "Unknown Cabin";
  const cabinImage = cabins?.image ?? "";

  return (
    <div className="flex border border-primary-800">
      <div className="relative h-32 aspect-square">
        <Image
          src={cabinImage}
          alt={`Cabin ${cabinName}`}
          className="object-cover border-r border-primary-800"
        />
      </div>

      <div className="flex-grow px-6 py-3 flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">
            {numNights} nights in Cabin {cabinName}
          </h3>
          {isPast(new Date(startDate || "")) ? (
            <span className="bg-yellow-800 text-yellow-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              past
            </span>
          ) : (
            <span className="bg-green-800 text-green-200 h-7 px-3 uppercase text-xs font-bold flex items-center rounded-sm">
              upcoming
            </span>
          )}
        </div>

        <p className="text-lg text-primary-300">
          {format(new Date(startDate || ""), "EEE, MMM dd yyyy")} (
          {isToday(new Date(startDate || ""))
            ? "Today"
            : formatDistanceFromNow(startDate || "")}
          ) &mdash; {format(new Date(endDate || ""), "EEE, MMM dd yyyy")}
        </p>

        <div className="flex gap-5 mt-auto items-baseline">
          <p className="text-xl font-semibold text-accent-400">${totalPrice}</p>
          <p className="text-primary-300">&bull;</p>
          <p className="text-lg text-primary-300">
            {numGuests} guest{numGuests !== null && numGuests > 1 && "s"}
          </p>
          <p className="ml-auto text-sm text-primary-400">
            Booked {format(new Date(created_at), "EEE, MMM dd yyyy, p")}
          </p>
        </div>
      </div>

      <div className="flex flex-col border-l border-primary-800 w-[100px]">
        <a
          href={`/account/reservations/edit/${id}`}
          className="group flex items-center gap-2 uppercase text-xs font-bold text-primary-300 border-b border-primary-800 flex-grow px-3 hover:bg-accent-600 transition-colors hover:text-primary-900"
        >
          <PencilSquareIcon className="h-5 w-5 text-primary-600 group-hover:text-primary-800 transition-colors" />
          <span className="mt-1">Edit</span>
        </a>
        <DeleteReservation bookingId={id} />
      </div>
    </div>
  );
}
