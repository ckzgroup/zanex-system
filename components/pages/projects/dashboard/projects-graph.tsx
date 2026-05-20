"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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


export default function ProjectsGraph() {

    const { isLoading, error, data } = useFetchData('/project_main_Dashboard/highLights');

    const projects = Array.isArray(data) ? data.reverse() : [];

    // Prepare the chart data based on the fetched projects
    const chartData = projects.map((project) => ({
        name: project.project_name, // Assuming your fetched data has a 'month' property
        progress: project.percentage_progress, // Assuming your fetched data has a 'desktop' property
    }));

    const chartConfig = {
        progress: {
            label: "Project Progress",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-bold">Project Highlights</CardTitle>
                <CardDescription> Showing project progress </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="progress" fill="var(--color-desktop)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {/*<CardFooter className="flex-col items-start gap-2 text-sm">*/}
            {/*    <div className="flex gap-2 font-medium leading-none">*/}
            {/*        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />*/}
            {/*    </div>*/}
            {/*    <div className="leading-none text-muted-foreground">*/}
            {/*        Showing total visitors for the last 6 months*/}
            {/*    </div>*/}
            {/*</CardFooter>*/}
        </Card>
    )
}
