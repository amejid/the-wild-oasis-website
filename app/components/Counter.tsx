"use client";
import { useState } from "react";
import { User } from "@/app/cabins/page";

export default function Counter({ users }: { users: User[] }) {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
