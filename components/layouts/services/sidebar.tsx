import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from "next/image";

// ICONS
import {
  Icon,
  House,
  HardDrives,
  Files,
  CarProfile,
  Users,
  UserCircle,
  Gear,
  SignOut,
  ArrowSquareDown, Briefcase, AddressBook, Folders, MapPin, UserRectangle, Tray, Toolbox, MapPinArea, MapTrifold
} from "@phosphor-icons/react"

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {DownloadCloud} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons";
import {Command, CommandGroup, CommandItem, CommandList} from "@/components/ui/command";
import {Dialog} from "@/components/ui/dialog";
import {useTeamStore} from "@/hooks/use-team-store";

type SidebarProps = {
    showLinks: boolean;
    sidebarWidth: string;
};

type SidebarLink = {
    name: string;
    icon: Icon | any;
    path: string;
};

export const adminNavigationLinks: SidebarLink[] = [
    { name: 'Dashboard', icon: House, path: '/service' },
    { name: 'Cases', icon: Tray, path: '/service/cases' },
    { name: 'Reports', icon: Files, path: '/service/reports' },
    { name: 'Maps', icon: MapPinArea, path: '/service/maps' },
    { name: 'Customers', icon: AddressBook, path: '/service/customers' },
    { name: 'Services', icon: Folders, path: '/service/service' },
  { name: 'Regions', icon: MapTrifold, path: '/service/regions' },
  { name: 'Job Card', icon: Toolbox, path: '/service/job-card' },
    { name: 'User Management', icon: Users, path: '/service/users' },
    { name: 'Settings', icon: Gear, path: '/service/settings' },
];

const mainLinks: SidebarLink[] = [
    { name: 'Dashboard', icon: House, path: '/service' },
    { name: 'Cases', icon: Tray, path: '/service/cases' },
    { name: 'Reports', icon: Files, path: '/service/reports' },
    { name: 'Maps', icon: MapPinArea, path: '/service/maps' },
];

const setupLinks: SidebarLink[] = [
    { name: 'Customers', icon: AddressBook, path: '/service/customers' },
    { name: 'Services', icon: Folders, path: '/service/services' },
    { name: 'Job Card', icon: Toolbox, path: '/service/job-card' },
  { name: 'Regions', icon: MapTrifold, path: '/service/regions' },
    { name: 'Sites', icon: MapPin, path: '/service/sites' },
];

const systemLinks: SidebarLink[] = [
    { name: 'User Management', icon: Users, path: '/service/users' },
    { name: 'Settings', icon: Gear, path: '/service/settings' },
];


const groups = [
    {
        label: "Zanex Apps",
        teams: [
            {
                label: "Project Mgmt",
                value: "logo2",
                title: "PROJECTS",
                link: "/"
            },
            {
                label: "Service Mgmt",
                value: "logo",
                title: "SERVICE MGMT",
                link: "/service"
            },
        ],
    },
]

type Team = (typeof groups)[number]["teams"][number]

const Sidebar: React.FC<SidebarProps> = ({ showLinks, sidebarWidth }) => {

    const [open, setOpen] = React.useState(false)
    const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false)
    const { selectedTeam, setSelectedTeam } = useTeamStore();



    const router = useRouter();
    const activeLink = usePathname();

    const { theme } = useTheme(); // Replace with your actual theme context hook

    const logoPath = theme === 'dark' ? '/images/logo-white.svg' : '/images/logo-dark.svg';

    const handleDownload = () => {
        const fileName = 'Zanex-User-Guide.pdf'; // Name of the file to be downloaded
        const filePath = `/downloads/${fileName}`; // Path to the file in the public folder

        // Create a temporary link element
        const link = document.createElement('a');
        link.href = filePath;
        link.setAttribute('download', fileName);

        // Simulate click on the link to start download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
    };

    return (
        <div className={`bg-background relative ${sidebarWidth} hidden md:block `}>
            <ScrollArea className="h-screen border-r">
                <div className="flex flex-col items-start justify-center my-4 px-4">

                    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    aria-label="Select a team"
                                    className={cn("w-full h-16 justify-between")}
                                >
                                    <div className='flex space-x-4 w-full items-center'>
                                        <Image src={`/images/services/${selectedTeam.value}.svg`} alt='logo' height={48} width={48} />
                                        <div>
                                            {showLinks && (
                                                <div className='-space-y-0.5'>
                                                    <h1 className={cn("text-xl font-bold text-left")}> Zanex </h1>
                                                    <p className="uppercase text-primary text-xs font-medium tracking-wider">
                                                        {selectedTeam.label}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <Command>
                                    <CommandList>
                                        {groups.map((group) => (
                                            <CommandGroup key={group.label} heading={group.label}>
                                                {group.teams.map((team) => (
                                                    <CommandItem
                                                        key={team.value}
                                                        onSelect={() => {
                                                            setSelectedTeam(team);
                                                            setOpen(false);
                                                            router.push(`${team.link}`);
                                                        }}
                                                        className="text-sm"
                                                    >
                                                        <Avatar className="mr-2 h-5 w-5">
                                                            <AvatarImage
                                                                src={`/images/services/${team.value}.svg`}
                                                                alt={team.label}
                                                            />
                                                            <AvatarFallback>SC</AvatarFallback>
                                                        </Avatar>
                                                        {team.label}
                                                        <CheckIcon
                                                            className={cn(
                                                                "ml-auto h-4 w-4",
                                                                selectedTeam.value === team.value
                                                                    ? "opacity-100"
                                                                    : "opacity-0"
                                                            )}
                                                        />
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        ))}
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </Dialog>

                </div>

                <div className="p-4">
                    <ul className="space-y-2">
                        {mainLinks.map(({name, icon: Icon, path}, index) => {
                            const isActiveLink = path === '/' ? activeLink === path : activeLink.startsWith(path);

                            const listItemClassName = `flex items-center text-[14px] space-x-2 px-4 py-4 rounded-xl transition cursor-pointer ${
                                isActiveLink ? 'border border-primary font-semibold text-primary hover:bg-primary/95 hover:text-primary-foreground' : 'hover:bg-secondary'
                            } `;

                            return (
                                <li key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={path} className={listItemClassName}>
                                                <Icon size={24} weight="duotone"/>
                                                {showLinks && <span>{name}</span>}
                                            </Link>
                                        </TooltipTrigger>
                                        {!showLinks && (
                                            <TooltipContent
                                                side="right"
                                                className="w-fit bg-background border border-background text-sm text-foreground shadow-2xl shadow-accent">{name}</TooltipContent>
                                        )}
                                    </Tooltip>
                                    <Tooltip/>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="p-4">
                    {showLinks && (
                        <h6 className="px-4 uppercase text-muted-foreground text-xs font-medium tracking-wider pb-2"> SETUP </h6>
                    )}
                    <ul className="space-y-2">
                        {setupLinks.map(({name, icon: Icon, path}, index) => {
                            const isActiveLink = path === '/' ? activeLink === path : activeLink.startsWith(path);

                            const listItemClassName = `flex items-center text-[14px] space-x-2 px-4 py-4 rounded-xl transition cursor-pointer ${
                                isActiveLink ? 'border border-primary font-semibold text-primary hover:bg-primary/95 hover:text-primary-foreground' : 'hover:bg-secondary'
                            } `;

                            return (
                                <li key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={path} className={listItemClassName}>
                                                <Icon size={24} weight="duotone"/>
                                                {showLinks && <span>{name}</span>}
                                            </Link>
                                        </TooltipTrigger>
                                        {!showLinks && (
                                            <TooltipContent side="right"
                                                            className="bg-background border border-background text-sm text-foreground shadow-2xl shadow-accent">{name}</TooltipContent>
                                        )}
                                    </Tooltip>
                                    <Tooltip/>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="p-4">
                    {showLinks && (
                        <h6 className="px-4 uppercase text-muted-foreground text-xs font-medium tracking-wider pb-2"> System </h6>
                    )}
                    <ul className="space-y-2">
                        {systemLinks.map(({name, icon: Icon, path}, index) => {
                            const isActiveLink = path === '/' ? activeLink === path : activeLink.startsWith(path);

                            const listItemClassName = `flex items-center text-[14px] space-x-2 px-4 py-4 rounded-xl transition cursor-pointer ${
                                isActiveLink ? 'border border-primary font-semibold text-primary hover:bg-primary/95 hover:text-primary-foreground' : 'hover:bg-secondary'
                            } `;

                            return (
                                <li key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link href={path} className={listItemClassName}>
                                                <Icon size={24} weight="duotone"/>
                                                {showLinks && <span>{name}</span>}
                                            </Link>
                                        </TooltipTrigger>
                                        {!showLinks && (
                                            <TooltipContent side="right"
                                                            className="bg-background border border-background text-sm text-foreground shadow-2xl shadow-accent">{name}</TooltipContent>
                                        )}
                                    </Tooltip>
                                    <Tooltip/>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div>
                    <ul className="space-y-2 px-4">
                        <li>
                            <Link href='/login'
                                  className='flex items-center hover:bg-secondary text-[14px] space-x-2 px-4 py-4 rounded-xl transition cursor-pointer '>
                                <SignOut size={24} weight="duotone"/>
                                {showLinks && <span>Logout</span>}
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="my-8 px-4">
                    <Button onClick={handleDownload} variant="outline" className="w-full space-x-4 border-red-500/20">
                        <DownloadCloud className="h-4 w-4"/>
                        {showLinks && <span>Download Guide</span>}
                    </Button>
                </div>
            </ScrollArea>

        </div>
    );
};

export default Sidebar;
