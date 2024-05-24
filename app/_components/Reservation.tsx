import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import { CabinType } from "@/app/_components/CabinList";
import { auth } from "@/app/_lib/auth";
import LoginMessage from "@/app/_components/LoginMessage";

export default async function Reservation({ cabin }: { cabin: CabinType }) {
  const settings = await getSettings();
  const bookedDates = await getBookedDatesByCabinId(cabin.id);

  const session = await auth();

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      {session?.user ? (
        <ReservationForm cabin={cabin} user={session.user} />
      ) : (
        <LoginMessage />
      )}
    </div>
  );
}
