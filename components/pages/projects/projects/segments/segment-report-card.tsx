"use client";

import React from 'react';
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Eye} from "@phosphor-icons/react";

interface IProps {
    title: string;
    date: string | any;
    message: string;
    location: string;
    supervisor: string;
    photo_url: string;
}

function SegmentReportCard({ title, date, location, supervisor, message, photo_url }: IProps) {
    return (
        <Card
            className="py-6 px-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top shadow-inner-sm shadow-primary/30 ">
            <div className="flex justify-between items-center pb-4">
                <h3 className="text-base font-bold"> {date} </h3>
                <p className="text-orange-500 italic">{title}</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <h4>Incident Message:</h4>
                    <p className="font-semibold">{message}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <h4>Incident Location:</h4>
                    <p className="font-semibold">{location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <h4>Supervisor:</h4>
                    <p className="font-semibold text-primary">{supervisor}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <h4>Photo Image:</h4>
                    <Link href={`/photo/${photo_url}`}>
                        <Button size="sm" className="space-x-2">
                            <Eye weight="duotone" size={16}/>
                            <span>View Image</span>
                        </Button>
                    </Link>
                </div>

            </div>
        </Card>
    );
}

export default SegmentReportCard;