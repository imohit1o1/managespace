import React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

interface HoneNavProps {
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
    role: string;
  };
}

export default function HomeNav({ user }: HoneNavProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-8">
        {user ? (
          <NavigationMenuItem>
            <NavigationMenuLink
              href={
                user.role === "user" ? "/dashboard/user" : "/dashboard/admin"
              }
            >
              Dashboard
            </NavigationMenuLink>
          </NavigationMenuItem>
        ) : (
          <NavigationMenuItem>
            <NavigationMenuLink href="/sign-in">Dashboard</NavigationMenuLink>
          </NavigationMenuItem>
        )}
        <NavigationMenuItem>
          <NavigationMenuLink href="/features">Features</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">Pricing</NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="/pricing">Faq</NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
