import React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeHeader() {
  return (
    <header className="flex justify-between items-center max-w-7xl mx-auto p-4">
      <h1 className="text-lg font-semibold">ManageSpace</h1>
      <nav>
        <ul className="md:flex gap-3 hidden">
          <li>Dashboard</li>
        </ul>
      </nav>
      <section className="flex gap-3">
        <ThemeToggle />
        <Link href="/sign-in">
          <Button className="">Sign In</Button>
        </Link>
      </section>
    </header>
  );
}
