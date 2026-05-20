"use client";

import React from 'react';
import {Card} from "@/components/ui/card";
import {DotsThree} from "@phosphor-icons/react";

interface IProps {
    children?: React.ReactNode;
    title?: string;
}

function FileCard({ children, title }: IProps) {
    return (
        <Card className='relative h-48 w-full p-8 shadow-inner-sm shadow-primary/30 '>
            <div>
                <DotsThree weight="bold" size={24} className="absolute top-3 right-4 text-muted-foreground"/>

            <div className="flex items-center justify-center">
                {children}
            </div>
                <h4 className="text-center pt-1 font-semibold">{title}</h4>
            </div>
        </Card>
    );
}

export default FileCard;