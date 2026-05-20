"use client";

import React from 'react';
import {Card} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Eye} from "@phosphor-icons/react";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog";

interface IProps {
    title: string;
    date: string | any;
    name: string;
    location: string;
    comment: string;
    materials?: number | string;
    service_quantity: number;
    supervisor: string;
    photo_url: string;
}

const IMAGE = process.env.NEXT_PUBLIC_IMAGES + '/projectImages/';


function SegmentUpdateCard({ title, date, name, location, comment, materials, service_quantity, supervisor, photo_url }: IProps) {
    return (
        <Card
            className="py-6 px-6 space-y-2 relative bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top shadow-inner-sm shadow-primary/30 ">
            <div className="flex justify-between items-center pb-4">
                <h3 className="text-base font-bold"> {title} </h3>
                <p className="text-orange-500 italic">{date}</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <h4>Task Category Name:</h4>
                    <p className="font-semibold">{name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <h4>Location:</h4>
                    <p className="font-semibold">{location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <h4>Comment:</h4>
                    <p className="font-semibold">{comment}</p>
                </div>

                {/*<div className="grid grid-cols-2 gap-4">*/}
                {/*    <h4>Materials:</h4>*/}
                {/*    <p className="font-semibold">{materials}</p>*/}
                {/*</div>*/}

                <div className="grid grid-cols-2 gap-4">
                    <h4>Service Quantity:</h4>
                    <p className="font-semibold">{service_quantity}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <h4>Supervisor:</h4>
                    <p className="font-semibold text-primary">{supervisor}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <h4>Photo Image:</h4>

                    <Dialog>
                        <div className="relative">
                            <DialogTrigger asChild>
                                {/*<Link href={`${photo_url}`}>*/}
                                    <Button size="sm" className="space-x-2">
                                        <Eye weight="duotone" size={16}/>
                                        <span>View Image</span>
                                    </Button>
                                {/*</Link>*/}

                                {/*<img*/}
                                {/*    src={`${IMAGE}${photo_url}`}*/}
                                {/*    alt="image"*/}
                                {/*    className="w-52 h-64 object-cover hover:cursor-pointer rounded-md" // Tailwind classes for width and height*/}
                                {/*/>*/}

                            </DialogTrigger>
                        </div>

                        <DialogContent className="sm:max-w-[425px]">
                            <img src={`${IMAGE}${photo_url}`}
                                 alt="img"
                                 className="h-full w-fit object-cover"
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Card>
    );
}

export default SegmentUpdateCard;