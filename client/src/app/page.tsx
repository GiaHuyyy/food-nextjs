import { redirect } from "next/navigation";

export default function Home() {
  const auth = true;
  if (!auth) {
    redirect("/login");
  }
  return (
    <main>
      <h1 className="text-4xl font-medium">Xin Chào</h1>
    </main>
  );
}
