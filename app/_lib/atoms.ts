import { atom } from "jotai";
import { DateRange } from "react-day-picker";

const rangeAtom = atom<DateRange | undefined>({
  from: undefined,
  to: undefined,
});

export { rangeAtom };
