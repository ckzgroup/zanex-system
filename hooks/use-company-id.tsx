"use client";

import useAuthStore from "@/hooks/use-user";

export const useCompanyId = () => {
    const companyId = useAuthStore((state) => state.getCompanyId());

    return companyId;
};