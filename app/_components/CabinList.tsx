import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "@/app/_lib/data-service";
import { unstable_noStore } from "next/cache";
import { Tables } from "@/app/_lib/database.types";

export type Cabin = Pick<
  Tables<"cabins">,
  "id" | "name" | "maxCapacity" | "regularPrice" | "discount" | "image"
>;

export default async function CabinList({ filter }: { filter: string }) {
  unstable_noStore();
  const cabins = await getCabins();

  if (!cabins?.length) return null;

  let displayedCabins: Cabin[] = [];

  if (filter === "all") displayedCabins = cabins;
  if (filter === "small")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity !== null && cabin.maxCapacity <= 3,
    );
  if (filter === "medium")
    displayedCabins = cabins.filter(
      (cabin) =>
        cabin.maxCapacity !== null &&
        cabin.maxCapacity >= 4 &&
        cabin.maxCapacity <= 7,
    );
  if (filter === "large")
    displayedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity !== null && cabin.maxCapacity >= 8,
    );

  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 xl:gap-14">
      {displayedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}
