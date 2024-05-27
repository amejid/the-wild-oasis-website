"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Tables } from "@/app/_lib/database.types";
import { CabinType } from "@/app/_components/CabinList";
import { useAtom } from "jotai";
import { rangeAtom } from "@/app/_atoms/atoms";

function isAlreadyBooked(range: DateRange | undefined, datesArr: Date[]) {
  return (
    range?.from &&
    range?.to &&
    datesArr.some((date) =>
      isWithinInterval(date, {
        start: range?.from ?? new Date(),
        end: range?.to ?? new Date(),
      }),
    )
  );
}

export default function DateSelector({
  settings,
  bookedDates,
  cabin,
}: {
  settings: Tables<"settings">;
  bookedDates: Date[];
  cabin: CabinType;
}) {
  const [range, setRange] = useAtom(rangeAtom);

  const displayedRange: DateRange | undefined = isAlreadyBooked(
    range,
    bookedDates,
  )
    ? { from: undefined, to: undefined }
    : range;

  const regularPrice = cabin.regularPrice ?? 0;
  const discount = cabin.discount ?? 0;
  const numNights = differenceInDays(
    displayedRange?.to ?? new Date(),
    displayedRange?.from ?? new Date(),
  );
  const cabinPrice = numNights * (regularPrice - discount);

  // SETTINGS
  const minBookingLength = settings.minBookingLength ?? 0;
  const maxBookingLength = settings.maxBookingLength ?? 0;

  return (
    <div className="flex flex-col justify-between">
      <DayPicker
        className="pt-12 place-self-center"
        mode="range"
        onSelect={setRange}
        selected={displayedRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={2}
        disabled={(currentDate) =>
          isPast(currentDate) ||
          bookedDates.some((date) => isSameDay(date, currentDate))
        }
      />

      <div className="flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]">
        <div className="flex items-baseline gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-2xl">${regularPrice - discount}</span>
                <span className="line-through font-semibold text-primary-700">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-2xl">${regularPrice}</span>
            )}
            <span className="">/night</span>
          </p>
          {numNights ? (
            <>
              <p className="bg-accent-600 px-3 py-2 text-2xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p>
                <span className="text-lg font-bold uppercase">Total</span>{" "}
                <span className="text-2xl font-semibold">${cabinPrice}</span>
              </p>
            </>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-4 text-sm font-semibold"
            onClick={() => setRange({ from: undefined, to: undefined })}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}
