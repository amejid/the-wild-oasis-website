import { getCabin, getCabins } from "@/app/_lib/data-service";
import Reservation from "@/app/_components/Reservation";
import { Suspense } from "react";
import Spinner from "@/app/_components/Spinner";
import Cabin from "@/app/_components/Cabin";

export async function generateMetadata({
  params,
}: {
  params: { cabinId: string };
}) {
  const cabin = await getCabin(+params.cabinId);

  return { title: `Cabin ${cabin?.name}` };
}

export async function generateStaticParams() {
  const cabins = await getCabins();

  return cabins?.map((cabin) => ({ cabinId: String(cabin.id) }));
}

export default async function Page({
  params,
}: {
  params: { cabinId: string };
}) {
  const cabin = await getCabin(+params.cabinId);

  if (cabin === null) {
    return null;
  }

  const { id, name, maxCapacity, regularPrice, discount, image, description } =
    cabin;

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <div className="grid grid-cols-[3fr_4fr] gap-20 border border-primary-800 py-3 px-10 mb-24">
        <Cabin cabin={cabin} />
      </div>

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {name} today. Pay on arrival.
        </h2>

        <Suspense fallback={<Spinner />}>
          <Reservation cabin={cabin} />
        </Suspense>
      </div>
    </div>
  );
}
