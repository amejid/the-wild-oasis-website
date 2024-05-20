import Counter from "@/app/components/Counter";

export type User = { id: number; name: string };

export default async function Page() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");

  const data = await res.json();

  return (
    <>
      <h1>Cabins Page</h1>
      <ul>
        {data.map((user: User) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <Counter users={data} />
    </>
  );
}
