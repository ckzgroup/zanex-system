"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/layouts/projects";
import { useRouter } from "next/navigation";
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import useAuthStore from "@/hooks/use-user";
import Loading from "@/app/(admin)/(projects)/loading";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const router = useRouter();
    const queryClient = new QueryClient();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const userId = useAuthStore.getState().getUserId();
        if (!userId) {
            logout();
            router.push('/login'); // Adjust the login page URL as needed
        }
    }, [router, logout]);

    const rehydrated = useAuthStore((state) => state.rehydrated);

    if (!isAuthenticated || !rehydrated) {
        return <Loading />;
    }

    return (
        <main className="text-sm">
            <QueryClientProvider client={queryClient}>
                {isClient ? children : null}
            </QueryClientProvider>
        </main>
    );
}
