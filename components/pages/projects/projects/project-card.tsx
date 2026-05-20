import React from 'react';
import {DotsThree, Icon, MapPin} from '@phosphor-icons/react'
import {Badge} from "@/components/ui/badge";
import {Card} from "@/components/ui/card";
import Link from "next/link";

interface ProjectCardProps {
    client: string;
    project: string;
    description: string;
    start_date: string;
    end_date: string;
    region: string;
    status: string;
}

function ProjectCard({ client, project, region, end_date, start_date, status, description }: ProjectCardProps) {
    return (
       <Link href={`/projects/${client}`} passHref>
           <Card
               className="flex justify-between shadow-inner shadow-primary/20 items-center border border-primary/40 rounded-2xl bg-[url('/images/bg-card-2.svg')] bg-no-repeat bg-top py-8 px-5">

               <div className="space-y-3">
                   <div className="flex items-center justify-between">
                       <h4 className="text-base ">{client}</h4>
                       <DotsThree weight="bold" size={24}  />
                   </div>

                   <h3 className="text-xl font-bold text-primary">{project}</h3>

                   <p className="text-muted-foreground">{description}</p>

                   <div className="text-[14px] space-y-1">
                       <p>Start: <span className="font-semibold">{start_date}</span></p>
                       <p>End: <span className="font-semibold">{end_date}</span></p>
                   </div>

                   <div className="flex items-center justify-between">
                       <div className="flex items-center space-x-2">
                           <MapPin weight="duotone" size={24} />
                           <h4>{region}</h4>
                       </div>

                       <div className="flex items-center">
                           <Badge variant="outline" className={`border-none text-white 
                     ${status === 'Pending' ? 'bg-[#8F9CA9]' : ''}
                     ${status === 'in-progress review' ? 'bg-[#FFDE00]' : ''}
                     ${status === 'In Progress' ? 'bg-[#FDAF20]' : ''}
                     ${status === 'Completed' ? 'bg-[#55BA6A]' : ''}
                     ${status === 'Cancelled' ? 'bg-[#EE3A4E]' : ''}
                     `}>
                               <span>{status}</span>
                           </Badge>
                       </div>
                   </div>


               </div>
           </Card>
       </Link>
    );
}

export default ProjectCard;