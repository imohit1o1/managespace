"use client";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    console.log("handleClick");
    router.push("/sign-in");
  };
  return (
    <header className="flex justify-around items-center px-12 py-4">
      <h1 className="text-xl font-semibold">ManageSpace</h1>
      <aside className="flex items-center gap-6">
        <ThemeToggle />
        <Button onClick={handleClick}>Sign in</Button>
      </aside>
    </header>
  );
}
