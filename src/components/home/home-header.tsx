"use client";
import React, { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import HomeNav from "@/components/home/home-nav";
import Link from "next/link";

export default function HomeHeader() {
  const { user, loading } = useCurrentUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  const toggleMenu = () => {
    console.log("toggleMenu");
    setMenuOpen((prev) => !prev);
  };

  // Get the first letter of the user's name or username
  const userInitial =
    user?.name?.[0].toUpperCase() || user?.username?.[0].toUpperCase();
  return (
    <header className="flex justify-between items-center h-16">
      <h1 className="text-xl font-semibold">
        <Link href="/">ManageSpace</Link>
      </h1>

      {/* Hamburger menu icon for mobile */}
      <div className="flex items-center gap-2 sm:hidden">
        {/* when user already signned in */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar className="h-8 w-8">
                  {user.image ? (
                    <AvatarImage src={user.image} alt="@nodespace" />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {userInitial}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    {user.image ? (
                      <AvatarImage src={user.image} alt="@nodespace" />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        {userInitial}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.name || user.username}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <Menu className="cursor-pointer h-7 w-7" onClick={toggleMenu} />
      </div>

      {menuOpen && (
        <div className="absolute right-4 top-16 rounded-sm opacity-70 transition ease-in-out duration-300 animate-in">
          <HomeNav user={user} />
          <aside className="flex items-center gap-6">
            <ThemeToggle />

            {/* // when user not signed in */}
            {!user && !loading && (
              <Button className="" onClick={handleSignIn}>
                Sign in
              </Button>
            )}
          </aside>
        </div>
      )}

      {/* Desktop view */}
      <section className="hidden sm:block">
        <HomeNav user={user} />
      </section>
      <aside className="hidden sm:flex items-center gap-6">
        <ThemeToggle />
        {/* when user already signned in */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar>
                  {user.image ? (
                    <AvatarImage src={user.image} alt="@nodespace" />
                  ) : (
                    <AvatarFallback className="rounded-lg">
                      {userInitial}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar>
                    {user.image ? (
                      <AvatarImage src={user.image} alt="@nodespace" />
                    ) : (
                      <AvatarFallback className="rounded-lg">
                        {userInitial}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.name || user.username}
                    </span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* // when user not signed in */}
        {!user && !loading && (
          <Button className="" onClick={handleSignIn}>
            Sign in
          </Button>
        )}
      </aside>
    </header>
  );
}
