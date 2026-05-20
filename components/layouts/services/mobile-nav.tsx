"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import {usePathname, useRouter} from "next/navigation"
import {Sidebar, SignOut} from "@phosphor-icons/react";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui//button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {adminNavigationLinks} from "@/components/layouts/services/sidebar";

export function MobileNav() {
    const [open, setOpen] = React.useState(false);

    const router = useRouter();
    const activeLink = usePathname();


    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Sidebar size={28} weight="duotone"/>
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="pr-0 mt-4">
                <ScrollArea className="h-screen w-full pr-3 flex flex-col space-y-6 justify-between">
                <ul className="space-y-4 mb-4">
                    {adminNavigationLinks.map(({ name, icon: Icon, path }, index) => {
                        const isActiveLink = path === activeLink;
                        const listItemClassName = `flex items-center text-sm space-x-2 px-4 py-4 rounded-xl transition cursor-pointer ${
                            isActiveLink ? 'bg-primary/10 font-semibold hover:bg-primary/10' : 'hover:bg-secondary'
                        } `;

                        return (
                            <li key={index}>
                                    <div className='relative'>
                                        <MobileLink
                                            href={path}
                                            className={`${listItemClassName} w-full`}
                                            onOpenChange={setOpen}
                                        >
                                            <Icon size={22} weight="duotone" />
                                              <span>{name}</span>
                                        </MobileLink>
                                    </div>
                            </li>
                        );
                    })}
                </ul>

                    <div>
                        <ul className="space-y-2">
                            <li >
                                <Link href='' className='flex items-center hover:bg-secondary text-[14px] space-x-2 px-4 py-4 rounded-xl transition cursor-pointer '>
                                    <SignOut size={24} weight="duotone"/>
                                    <span>Logout</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}

interface MobileLinkProps extends LinkProps {
    onOpenChange?: (open: boolean) => void
    children: React.ReactNode
    className?: string
}

function MobileLink({
                        href,
                        onOpenChange,
                        className,
                        children,
                        ...props
                    }: MobileLinkProps) {
    const router = useRouter()
    return (
        <Link
            href={href}
            onClick={() => {
                router.push(href.toString())
                onOpenChange?.(false)
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </Link>
    )
}