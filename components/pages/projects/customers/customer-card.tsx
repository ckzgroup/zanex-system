import React from 'react';
import {DotsThree, Icon, MapPin} from '@phosphor-icons/react'
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface CustomerCardProps {
    image: string;
    name: string;
    email: string;
    projects: string | number;
    deal: string | number;
    link: string;
}

function CustomerCard({image, name, email, projects, link, deal}: CustomerCardProps) {
    return (
        <Link href={`/customers/${name}`} passHref>
            <Card
                className="flex justify-between shadow-inner shadow-primary/20 items-center border border-primary/40 rounded-2xl bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top py-6 px-5">

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <div className='relative h-20 w-20 rounded-full'>
                            <Image src={image} fill alt={name} className="object-cover rounded-full"/>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold">{name}</h3>

                    <p className="text-muted-foreground italic">{email}</p>

                    <div className="text-base space-y-2">
                        <p>Projects: <span className="font-semibold">{projects}</span></p>
                        <p>Deal: <span className="font-semibold">Ksh {deal}</span></p>
                    </div>

                    <div className="flex items-center justify-between">
                        <Button className="bg-orange-500 hover:bg-orange-500">
                            View Profile
                        </Button>
                    </div>


                </div>
            </Card>
        </Link>
    );
}

export default CustomerCard;