import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormatDate } from "@/components/date-formatter";

export const useDateManagement = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedDate, setSelectedDate] = useState<string>(() => {
        const dateParam = searchParams.get("date");
        if (dateParam) {
            return dateParam;
        }
        return FormatDate(new Date(), "NumberFormatDate");
    });

    useEffect(() => {
        const params = new URLSearchParams(searchParams);
        params.set("date", selectedDate);
        const url = `/dashboard/user/todos?${params.toString()}`;
        router.replace(url);
    }, [selectedDate, router, searchParams]);

    return { selectedDate, setSelectedDate };
};