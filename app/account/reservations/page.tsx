import { getBookings } from "@/app/_lib/data-service";
import { auth, CustomSession } from "@/app/_lib/auth";
import ReservationList from "@/app/_components/ReservationList";

export const metadata = {
  title: "Reservations",
};

export default async function Page() {
  const session = (await auth()) as CustomSession;
  const bookings = await getBookings(session?.user?.guestId ?? 0);

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Your reservations
      </h2>

      {bookings.length === 0 ? (
        <p className="text-lg">
          You have no reservations yet. Check out our{" "}
          <a className="underline text-accent-500" href="/cabins">
            luxury cabins &rarr;
          </a>
        </p>
      ) : (
        <ReservationList bookings={bookings} />
      )}
    </div>
  );
}
