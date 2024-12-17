import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  const auth = false;
  if (!auth) {
    redirect("/login");
  }
  return (
    <main>
      <h1 className="text-4xl font-medium">Xin Chào</h1>
      <Link href="/login">login</Link>
      <button>Chuyển sang trang Login</button>
    </main>
  );
}
