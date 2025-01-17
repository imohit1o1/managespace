"use client";

import * as React from "react";
import {
  DraftingCompass,
  NotebookPen,
  Save,
  Send,
  ListTodo,
  Plus,
  Star,
  Folders,
  Trash,
  Box,
  Command,
  House,
  History,
  CalendarDays,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";

// Add user-soecific items
const userNavItems = [
  {
    title: "Todos",
    url: "/todos",
    icon: ListTodo,
    items: [
      {
        title: "Home",
        url: "/",
        icon: House,
      },
      {
        title: "Calendar",
        url: "/calendar-planning",
        icon: CalendarDays,
      },
    ],
  },
  {
    title: "Notes",
    url: "/notes",
    icon: NotebookPen,
    items: [
      {
        title: "Home",
        url: "/",
        icon: House,
      },
      {
        title: "Folders",
        url: "/folders",
        icon: Folders,
      },
    ],
  },
  {
    title: "Boards",
    url: "#",
    icon: DraftingCompass,
    items: [
      {
        title: "Recent",
        url: "#",
        icon: History,
      },
      {
        title: "Saved",
        url: "#",
        icon: Save,
      },
      {
        title: "Create",
        url: "#",
        icon: Plus,
      },
    ],
  },
  {
    title: "Storage",
    url: "#",
    icon: Box,
    items: [
      {
        title: "All Files",
        url: "#",
        icon: Folders,
      },
      {
        title: "Starred",
        url: "#",
        icon: Star,
      },
      {
        title: "Trash",
        url: "#",
        icon: Trash,
      },
    ],
  },
];
// Add admin-specific items
const adminNavItems = [
  {
    title: "Admin Dashboard",
    url: "#",
    icon: DraftingCompass,
  },
  {
    title: "User Management",
    url: "#",
    icon: ListTodo,
  },
  {
    title: "Settings",
    url: "#",
    icon: Box,
  },
];
// Add secondary items
const navSecondary = [
  {
    title: "Feedback",
    url: "/dashboard/feedback",
    icon: Send,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useCurrentUser();
  const userRole = user?.role;

  // Conditionally render based on role
  const filteredNavMain = userRole === "admin" ? adminNavItems : userNavItems;
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard/user">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">ManageSpace</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
