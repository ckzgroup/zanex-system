"use client"

import {TopNav} from "@/app/(admin)/(projects)/settings/components/top-nav";


const topNavItems = [
  {
    title: "Casuals",
    href: "/wages",
  },
  {
    title: "Rate Card",
    href: "/wages/rate-card",
  },
  {
    title: "Attendance",
    href: "/wages/attendance",
  },
  {
    title: "Bills",
    href: "/wages/bill",
  },
    ]

interface WagesLayoutProps {
  children: React.ReactNode
}

export default function WagesLayout({ children }: WagesLayoutProps) {
  return (
    <>
      <div className="w-full space-y-6 pb-16 relative">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-heading font-bold tracking-tight"> Wage Bill </h2>
          <p className="text-muted-foreground">
            Payments usually of money for labor or services usually according to a contract and on an hourly, daily, or piecework basis
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
