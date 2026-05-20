"use client"

import { Globe, Sun } from "@phosphor-icons/react"
import {SidebarNav} from "@/app/(admin)/(projects)/settings/components/sidebar-nav";

const sidebarNavItems = [
    {
        title: "Regional Preference",
        href: "/settings",
        icon: Globe,
    },
    {
        title: "Theme Options",
        href: "/settings/theme",
        icon: Sun,
    },
]



interface SettingsLayoutProps {
    children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <>
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 w-full lg:w-1/5 border border-muted-foreground rounded-xl py-6 px-2 h-fit">
            <h5 className='font-mono text-muted-foreground text-sm pl-2 pb-3'>SELECT MENU</h5>
            <SidebarNav items={sidebarNavItems}/>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
            {children}
        </div>
        </div>
</>
)
}
