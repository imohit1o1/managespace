import React from "react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center max-w-2xl mx-auto relative">
      <header className="py-8">
        <h1 className="text-3xl font-medium text-gray-900 dark:text-gray-50 sm:text-6xl">
          Transform How You
          <br />
          <span className="animate-text-gradient inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
            Work, Learn, and Create
          </span>
        </h1>
        <p className="mt-6 text-center text-lg leading-6 text-gray-600 dark:text-gray-200">
          Empower your journey with a space that adapts to your needs. Take
          control of your tasks, learning, and creativity effortlessly.
        </p>
      </header>
      <Link
        href="https://github.com/imohit1o1/managespace"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button className="font-medium hover:bg-primary/90">
          Go To Github
          <MoveRight />
        </Button>
      </Link>
    </section>
  );
}
