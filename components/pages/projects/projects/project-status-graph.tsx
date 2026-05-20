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
import {usePathname} from "next/navigation";
import {useSingleProject} from "@/actions/get-project";

const chartConfig = {
    progress: {
        label: "Progress",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function ProjectStatusGraph() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));

    const { isLoading, error, data } = useSingleProject('/project_dashboard/projectHighlight', project_id)

    const projects = Array.isArray(data) ? data.reverse() : [];

    console.log(projects)

    // Prepare the chart data based on the fetched projects
    const chartData = projects.map((project) => ({
        name: project.segment_name, // Assuming your fetched data has a 'month' property
        progress: project.percentage_progress, // Assuming your fetched data has a 'desktop' property
    }));

    return (
        <Card className="relative bg-[url('/images/projects/bg-card-2.svg')] bg-no-repeat bg-top">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Current Project Status</CardTitle>
                {/* eslint-disable-next-line react/no-unescaped-entities */}
                <CardDescription>Project segment's progress</CardDescription>
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
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="progress" fill="var(--color-desktop)" radius={8} />
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
