"use client"

import { Globe, Sun } from "@phosphor-icons/react"
import {TopNav} from "@/app/(admin)/(projects)/settings/components/top-nav";


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


const topNavItems = [
  {
    title: "General Settings",
    href: "/settings",
  },
  {
    title: "Notification Settings",
    href: "/settings/notifications",
  },
  {
    title: "Privacy & Security",
    href: "/settings/privacy",
  },
  {
    title: "Integrations",
    href: "/settings/integration",
  },
    ]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="w-full space-y-6 pb-16 relative">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-heading font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your preferences and configure various options.
          </p>
        </div>

        <div className=''>
          <hr className=''/>
          <TopNav items={topNavItems} />
          <hr/>
        </div>

        <div>
          {children}
        </div>

      </div>
    </>
  )
}
