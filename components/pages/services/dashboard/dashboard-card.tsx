import React from 'react';
import { Icon } from '@phosphor-icons/react'
import Link from "next/link";

interface DashboardCardProps {
    icon: Icon | any;
    title: string;
    total: number | string;
    iconColor: string;
    bgColor: string;
    link?: string | undefined;
}

function DashboardCard({ icon:Icon, title, total, iconColor, bgColor, link }: DashboardCardProps) {
    return ( //@ts-ignore
        <Link href={`${link}`} passHref
            className="flex justify-between items-center border border-gray-200 dark:border-gray-800 rounded-2xl bg-[url('/images/bg-card.svg')] bg-no-repeat bg-top bg-cover py-8 px-5">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold">{total}</h1>
                <h4 className="text-base text-muted-foreground font-medium">{title}</h4>
            </div>

            <div className="items-center p-3 rounded-full border-2 hidden md:flex"
                 style={{borderColor: iconColor, backgroundColor: bgColor}}>
                <Icon weight="duotone" size={44} style={{color: iconColor}} />
            </div>
        </Link>
    );
}

export default DashboardCard;