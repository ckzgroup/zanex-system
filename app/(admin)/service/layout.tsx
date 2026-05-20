"use client"
import './globals.css'
import React, {useEffect, useState} from "react";
import Layout from "@/components/layouts/services";
import {useRouter} from "next/navigation";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import {createTheme} from "@mantine/core";
import {APIProvider} from "@vis.gl/react-google-maps";

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const queryClient = new QueryClient();
    return (
        <main className="text-sm min-h-screen relative">
            <QueryClientProvider client={queryClient}>
                {/* @ts-ignore */}
                <Layout>
                    {children}
                </Layout>
            </QueryClientProvider>
        </main>
    )
}