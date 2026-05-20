"use client"

import '@/app/globals.css'

import React, {useEffect, useState} from "react";
import Layout from "@/components/layouts/projects";
import {useRouter} from "next/navigation";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
} from '@tanstack/react-query'
import {boolean} from "zod";
import useAuthStore from "@/hooks/use-user";
import Loading from "@/app/(admin)/(projects)/loading";
import useFetchData from "@/actions/use-api";

interface AdminLayoutProps {
    children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {

    return (
        <main className="text-sm">
                <Layout>
                    {children}
                </Layout>
        </main>
    )
}