"use client"

import { TrendingUp } from "lucide-react"
import {Bar, BarChart, Cell, LabelList, XAxis, YAxis} from "recharts"

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


const generateColor = (index: any) => {
    const colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)"
    ];
    return colors[index % colors.length];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const chartConfig = {
    quantity: {
        label: "Assignments",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function ProjectWorkload() {
    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));

    const { isLoading, error, data } = useSingleProject('/project_dashboard/userWorkload', project_id)

    const projects = Array.isArray(data) ? data.reverse() : [];

    // Prepare the chart data based on the fetched projects
    const chartData = projects.map((project, index) => ({
        name: project.user_name, // Assuming your fetched data has a 'service_name' property
        quantity: project.assignment_count, // Assuming your fetched data has a 'expected_quantity' property
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg font-bold"> Workload </CardTitle>
                <CardDescription> Work progress by the supervisors </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: -20,
                        }}
                    >
                        <XAxis type="number" dataKey="quantity" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line"/>}
                        />
                        <Bar dataKey="quantity" fill="var(--color-desktop)" radius={5} >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                            <LabelList
                                dataKey="quantity"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
