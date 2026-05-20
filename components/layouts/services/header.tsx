"use client";

import React, {useEffect, useState} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {ModeToggle} from "@/components/lib/mode-toggle";
import {Search} from "@/components/elements/search";

import { Sidebar, Bell, Chat, Icon, FrameCorners, User, Gear, SignOut, Clock, X } from "@phosphor-icons/react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {MobileNav} from "@/components/layouts/projects/mobile-nav";
import useAuthStore from "@/hooks/use-user";
import {useRouter} from "next/navigation";
import {useFullscreen} from "@/hooks/use-fullscreen";

type HeaderProps = {
    toggleSidebar: () => void;
};

const notificationsData = [
    {
        "icon": Chat,
        'message': 'Please check your email',
        'time': '14 mins ago'
    },
    {
        "icon": Chat,
        'message': 'New fuel refill request',
        'time': '23 mins ago'
    },
    {
        "icon": Chat,
        'message': 'Petty cash request from Joseph',
        'time': '6 mins ago'
    },
    {
        "icon": Chat,
        'message': 'Monthly report generated',
        'time': '4 hours ago'
    }
]

interface NotificationProps {
    icon: Icon | any;
    message: string;
    time: string;
}

const Notification = ({ icon: Icon, message, time }: NotificationProps) => {
    return (
        <div
            key={time}
            className='flex items-center justify-between px-4 py-4 hover:cursor-pointer hover:bg-secondary border-b border-secondary'>
            <div className='flex items-center space-x-4'>
                <Icon className='h-5 w-5 text-teal-500'/>
                <div className='flex flex-col space-y-1'>
                    <h3 className='text-sm'>{message}</h3>
                    <div className='flex items-center space-x-1 text-muted-foreground'>
                        <Clock className='h-4 w-4'/>
                        <span className='text-xs'>{time}</span>
                    </div>
                </div>
            </div>
            <X className='h-4 w-4' />
        </div>
    )
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {

    const [isClient, setIsClient] = useState(false)

    // Fullscreen
    const [isFullscreen, toggleFullscreen] = useFullscreen();

    const router = useRouter();
    const authStore = useAuthStore();

    const user = authStore.user;

    useEffect(() => {
        setIsClient(true)
    }, []);

    // Get Avatar Initials
    const getInitials = (name:string | undefined) => {
        // Split the name into words
        const words = name?.split(' ');

        // Get the first letter of each word
        const initials = words?.map(word => word[0]);

        // Join the initials into a string
        return initials?.join('');
    };

    const userName = user?.result.user_firstname;
    const userInitials = getInitials(userName);

    const handleLogout = () => {
        authStore.logout();
        router.push('/login'); // Redirect to home or login page
    };
    return (
        <div className="bg-background drop-shadow-sm py-4 px-2 md:px-8  w-full flex justify-between items-center border-b">
            <div className="flex items-center space-x-8">
                <button
                    className="focus:outline-none hidden md:block"
                    onClick={toggleSidebar}
                    aria-label="toggle"
                >
                    <Sidebar size={24} weight="duotone" />
                </button>

                <MobileNav/>

                {/*<div className='hidden md:block'>*/}
                {/*    <Search/>*/}
                {/*</div>*/}

            </div>


            <div className='flex items-center space-x-6'>

                <FrameCorners size={24} onClick={toggleFullscreen} className='hidden md:block hover:cursor-pointer'/>

                <DropdownMenu>
                    <DropdownMenuTrigger role={"menu"} asChild aria-label="dropdown menu">
                        <Bell size={24} className='hover:cursor-pointer' weight="duotone"/>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-72 font-sans">
                        <DropdownMenuGroup
                            className='bg-foreground text-background py-4 px-4 flex items-center justify-between rounded-md'>
                            <h1 className='font-heading text-xl font-bold'>Notifications</h1>
                            <p className='text-xs'>Mark all as unread</p>
                        </DropdownMenuGroup>

                        <DropdownMenuGroup>
                            {notificationsData.map((notification) => (

                                <Notification
                                    key={notification.time}
                                    icon={notification.icon}
                                    message={notification.message}
                                    time={notification.time}
                                />
                            ))}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className='flex items-center justify-center text-primary'>
                            <span>Clear Notifications</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <ModeToggle/>

                <div className='flex space-x-2 items-center'>


                    <DropdownMenu>
                        <DropdownMenuTrigger role={"menu"} asChild aria-label="dropdown menu">
                            <div className='flex items-center space-x-2 cursor-pointer'>
                                <Avatar className={cn("h-10 w-10 border-[1.5px] border-primary/60")} role={"menuitem"}>
                                    <AvatarImage
                                        alt='avatar'
                                        src={isClient ? user?.result.company_logo : ''}
                                        className='object-cover'
                                    />
                                    <AvatarFallback>{isClient ? userInitials : ''}</AvatarFallback>
                                </Avatar>
                                <div className='hidden md:flex flex-col font-medium' role={"menuitem"}>
                                    <h4 className='text-xs hidden  md:block font-semibold'>{isClient ? user?.result.user_firstname : ''}</h4>
                                    <p className='text-[11px] text-muted-foreground'>Admin</p>
                                </div>
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="w-56 font-sans">
                            <DropdownMenuGroup>
                                <Link href='/profile'>
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4"/>
                                        <span>Profile</span>
                                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </Link>
                                <Link href='/settings'>
                                    <DropdownMenuItem>
                                        <Gear className="mr-2 h-4 w-4"/>
                                        <span>Settings</span>
                                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </Link>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={handleLogout}>
                                <SignOut className="mr-2 h-4 w-4"/>
                                <span>Log out</span>
                                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

        </div>
    );
};

export default Header;
