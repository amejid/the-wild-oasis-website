import Link from "next/link";

export default function Navigation() {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
        <Link href="/cabins">Cabins</Link>
        <Link href="/about">About</Link>
        <Link href="/account">Account</Link>
      </li>
    </ul>
  );
}
