import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useTabManagement = () => {
  const [currentTab, setCurrentTab] = useState<string>("all");
  const router = useRouter();

  useEffect(() => {
    router.push(`/dashboard/user/notes/?tab=${currentTab}`);
  }, [currentTab, router]);

  return { currentTab, setCurrentTab };
};
