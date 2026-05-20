import React from 'react';
import {DotsThree, Icon, MapPin} from '@phosphor-icons/react'
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import {Progress} from "@/components/ui/progress";
import {Simulate} from "react-dom/test-utils";
import progress = Simulate.progress;
import Link from "next/link";

interface ClientProjectCardProps {
    name: string;
    tasks: string;
    description: string;
    deadline: string;
    leader: string;
    value: string | number;
}

function ClientProjectCard({ name, tasks, leader, deadline, description, value }: ClientProjectCardProps) {
    return (
        <Link href={`/projects/${name}`} passHref>
            <Card
                className="flex justify-between shadow-inner shadow-primary/20 items-center border border-primary/40 rounded-2xl bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top py-8 px-5">

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold ">{name}</h2>
                        <DotsThree weight="bold" size={24}  />
                    </div>

                    <h3 className="text-base font-semibold text-primary">{tasks}</h3>

                    <p className="text-muted-foreground">{description}</p>

                    <div className="text-[16px] space-y-2">
                        <div className="space-y-1">
                            <p>Deadline: </p>
                            <p className="text-muted-foreground">{deadline}</p>
                        </div>
                        <div className="space-y-1">
                            <p>Project Leader: </p>
                            <p className="text-muted-foreground">{leader}</p>
                        </div>
                    </div>

                    <div className="space-y-2 pt-2">
                        <Progress  value={50} className="h-3" />
                        <p>Progress <span className="font-semibold">{value}%</span></p>
                    </div>


                </div>
            </Card>
        </Link>
    );
}

export default ClientProjectCard;