// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export const useTabManagement = () => {
//   const [currentTab, setCurrentTab] = useState<string>("all");
//   const router = useRouter();

//   useEffect(() => {
//     router.push(`/dashboard/user/notes/?tab=${currentTab}`);
//   }, [currentTab, router]);

//   return { currentTab, setCurrentTab };
// };

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useTabManagement = (notesFolderId?: string) => {
  const [currentTab, setCurrentTab] = useState<string>("all");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const baseRoute = notesFolderId ? `/dashboard/user/notes/folders/${notesFolderId}` : `/dashboard/user/notes`;
    const updatedUrl = `${baseRoute}?tab=${currentTab}`;
    if (searchParams?.get('tab') !== currentTab) {
      router.push(updatedUrl);
    }
  }, [currentTab, notesFolderId, router, searchParams]);

  return { currentTab, setCurrentTab };
};
