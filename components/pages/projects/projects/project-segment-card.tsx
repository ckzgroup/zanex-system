"use client";

import React from 'react';
import {Card} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Progress} from "@/components/ui/progress";
import Link from "next/link";
import {usePathname} from "next/navigation";

interface ProjectSegmentCardProps {
    title: string;
    code: string;
    start_point: string;
    end_point: string;
    due_date: string;
    distance: string;
    status: string;
    progress: number;
    supervisor?: string;
}

function ProjectSegmentCard({ title, distance, code, progress, due_date, status, end_point, start_point, supervisor }: ProjectSegmentCardProps) {


    return (
            <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-primary tracking-wider">{title}</h2>
                    <div className="py-1 text-sm px-2 bg-orange-200 dark:bg-orange-800 to-orange-500 rounded-md">
                        <p>{code}</p>
                    </div>
                </div>

                <div>
                    <ul className="space-y-2">
                        <li>Start Point: <span className="font-semibold">{start_point}</span></li>
                        <li>End Point: <span className="font-semibold">{end_point}</span></li>
                        <li>Distance (m): <span className="font-semibold">{distance}</span></li>
                        <li>Due Date: <span className="font-semibold">{due_date}</span></li>
                    </ul>
                </div>

                <hr/>

                <div className="flex items-center justify-between">
                    <Badge className="bg-primary/20 text-primary hover:bg-orange-200 rounded-md">
                        {status}
                    </Badge>

                    <h4 className="underline">{supervisor}</h4>
                </div>

                <div className="space-y-2">
                    <Progress value={progress} indicatorColor="bg-primary" />

                    <h4>Segment progress <span className="font-bold text-primary">{` ${progress}%`}</span></h4>
                </div>
            </Card>
    );
}

export default ProjectSegmentCard;