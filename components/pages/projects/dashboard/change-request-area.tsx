"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import React from "react";

export default function ChangeRequestArea() {

    const { isLoading, error, data } = useFetchData('/project_main_Dashboard/changeRequest');

    const changeRequests = Array.isArray(data) ? data.reverse() : [];

    // Prepare the chart data based on the fetched projects
    const chartData = changeRequests.map((project) => ({
        name: project.project_name, // Assuming your fetched data has a 'month' property
        material: project.total_material_change_quantity, // Assuming your fetched data has a 'desktop' property
        service: project.total_service_change_quantity
    }))

    const chartConfig = {
        material: {
            label: "Materials",
            color: "hsl(var(--chart-1))",
        },
        service: {
            label: "Services",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-bold">Change Requests</CardTitle>
                <CardDescription>
                    Showing material and services change requests
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: -20,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={3}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Area
                            dataKey="material"
                            type="natural"
                            fill="var(--color-mobile)"
                            fillOpacity={0.4}
                            stroke="var(--color-mobile)"
                            stackId="a"
                        />
                        <Area
                            dataKey="service"
                            type="natural"
                            fill="var(--color-desktop)"
                            fillOpacity={0.4}
                            stroke="var(--color-desktop)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
            {/*<CardFooter>*/}
            {/*    <div className="flex w-full items-start gap-2 text-sm">*/}
            {/*        <div className="grid gap-2">*/}
            {/*            <div className="flex items-center gap-2 font-medium leading-none">*/}
            {/*                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />*/}
            {/*            </div>*/}
            {/*            <div className="flex items-center gap-2 leading-none text-muted-foreground">*/}
            {/*                January - June 2024*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</CardFooter>*/}
        </Card>
    )
}
