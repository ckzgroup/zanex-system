"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        href: string;
        title: string;
    }[];
}

export function TopNav({ className, items, ...props }: TopNavProps) {
    const pathname = usePathname();

    return (
        <nav
            className={cn("flex space-x-4 md:space-x-8", className)}
            {...props}
        >
            {items.map((item) => {

                const isActiveLink = pathname.startsWith(item.href);


                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            isActiveLink
                                ? "border-b-2 border-primary py-4 font-semibold"
                                : "text-muted-foreground hover:text-foreground ",
                            "justify-start flex items-center gap-x-4"
                        )}
                    >
                        <span className="">{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
