import React from 'react';
import {DotsThree, Icon, MapPin} from '@phosphor-icons/react'
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface CustomerCardProps {
    image: string;
    name: string;
    phone: string;
    image_name: string;
    email: string;
    link: string;
}

function CustomerCard({image, name, email, phone, link, image_name}: CustomerCardProps) {
    return (

            <Card
                className="flex justify-between shadow-inner shadow-primary/20 items-center border border-primary/40 rounded-2xl bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top py-6 px-5">

                <div className="space-y-3">
                    <div className="flex justify-between">

                        <Avatar className='relative h-20 w-20 rounded-full'>
                            <AvatarImage src={image} alt="logo" />
                            <AvatarFallback className="text-2xl font-bold text-primary bg-primary/10">{image_name}</AvatarFallback>
                        </Avatar>
                    </div>

                    <h3 className="text-xl font-bold">{name}</h3>

                    <p className="text-muted-foreground italic">{email}</p>
                    <p className="font-medium ">{phone}</p>

                    <div className="text-base space-y-2">

                    </div>

                    <div className="flex items-center justify-between">
                            <Button className="bg-primary hover:bg-primary/90">
                                <Link href={link} passHref >
                                View Profile
                                </Link>
                            </Button>

                    </div>


                </div>
            </Card>
    );
}

export default CustomerCard;