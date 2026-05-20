"use client"

import * as React from "react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ICONS
import { Sun, Moon, Laptop } from "@phosphor-icons/react";

export function ModeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                    <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" size={24} weight="duotone" />
                    <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" size={24} weight="duotone"/>
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2" size={20} weight="duotone"/>
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2" size={20} weight="duotone" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Laptop className="mr-2" size={20}  weight="duotone" />
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
