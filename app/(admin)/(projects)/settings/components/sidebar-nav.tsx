"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {buttonVariants} from "@/components/ui/button";
import { Icon } from "@phosphor-icons/react"


interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: Icon
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-foreground text-background hover:text-background/90  hover:bg-foreground/90 "
              : "hover:bg-muted",
            "justify-start flex items-center gap-x-2 py-2"
          )}
        >
          <div>
            <item.icon className='h-6 md:h-5 w-6 md:w-5' weight='duotone'/>
          </div>
          <span className=''>{item.title}</span>
        </Link>
      ))}
    </nav>
  )
}
