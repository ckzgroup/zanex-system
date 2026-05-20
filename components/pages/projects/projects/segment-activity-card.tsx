import React from 'react';
import { Icon } from '@phosphor-icons/react'

interface SegmentActivityCardProps {
    icon: Icon | any;
    title: string;
    total: number | string;
    description: string;
    iconColor: string;
    bgColor: string;
}

function SegmentActivityCard({ icon:Icon, title, total, iconColor, bgColor, description }: SegmentActivityCardProps) {
    return (
        <div className=" border border-gray-300 dark:border-gray-800 rounded-2xl bg-[url('/images/bg-card.svg')] bg-no-repeat bg-top py-6 px-5">
            <div className="flex justify-between ">
                <div>
                    <h4 className="text-base font-semibold pt-2">{title}</h4>
                </div>

                <div className="flex items-center p-3 rounded-full border-2"
                     style={{borderColor: iconColor, backgroundColor: bgColor}}>
                    <Icon weight="duotone" size={32} style={{color: iconColor}}/>
                </div>
            </div>
            <div className="space-y-1">
                <h1 className="text-2xl font-bold">{total}</h1>
                <p className="text-base text-muted-foreground">{description}</p>
            </div>


        </div>
    );
}

export default SegmentActivityCard;