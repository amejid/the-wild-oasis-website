import DateSelector from "@/app/_components/DateSelector";
import ReservationForm from "@/app/_components/ReservationForm";
import { getBookedDatesByCabinId, getSettings } from "@/app/_lib/data-service";
import { CabinType } from "@/app/_components/CabinList";

export default async function Reservation({ cabin }: { cabin: CabinType }) {
  const settings = await getSettings();
  const bookedDates = await getBookedDatesByCabinId(cabin.id);

  return (
    <div className="grid grid-cols-2 border border-primary-800 min-h-[400px]">
      <DateSelector
        settings={settings}
        bookedDates={bookedDates}
        cabin={cabin}
      />
      <ReservationForm cabin={cabin} />
    </div>
  );
}
