import React from 'react';
import {Icon, TrendUp} from '@phosphor-icons/react'

interface ReportCardProps {
    icon: Icon | any;
    title: string;
    total: number | string;
    iconColor: string;
    bgColor?: string;
}

function ReportCard({ icon:Icon, title, total, iconColor, bgColor }: ReportCardProps) {
    return (
        <div
            className="flex justify-between items-start border border-gray-200 dark:border-gray-800 rounded-2xl bg-[url('/images/bg-card.svg')] bg-no-repeat bg-top bg-cover py-8 px-5">
            <div className="space-y-2">
                <h4 className="text-base font-medium">{title}</h4>
                <h1 className="text-3xl font-bold">{total}</h1>

                {/*<div className="flex items-center space-x-2">*/}
                {/*    <TrendUp weight="bold" size={16} className="text-green-500" />*/}
                {/*    <p className=""><span className="text-green-500">+12%</span> from last month</p>*/}
                {/*</div>*/}
            </div>

            <div className="flex items-center p-2 rounded-full border-2"
                 style={{borderColor: iconColor, backgroundColor: bgColor}}>
                <Icon weight="duotone" size={28} style={{color: iconColor}}/>
            </div>
        </div>
    );
}

export default ReportCard;