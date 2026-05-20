"use client";

import React from 'react';
import { ArrowCircleLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

function BackButton() {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 text-sm absolute top-1 left-4"
        >
            <ArrowCircleLeft size={24} className="mr-2" />
            Back
        </button>
    );
}

export default BackButton;
