"use client";

import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';


import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart"
import { usePathname } from "next/navigation";
import { useSingleProject } from "@/actions/get-project";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;

// Customized label rendering function
// @ts-ignore
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

// Custom Tooltip for displaying ticket count
// @ts-ignore
const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ background: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                <p>{`Service: ${payload[0].name}`}</p>
                <p>{`Ticket Count: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};


const TaskChart = () => {
        const pathname = usePathname()
        const project_id = parseInt(pathname.replace('/projects/',''));

        const { isLoading, error, data } = useSingleProject('/project_dashboard/taskWeight', project_id)

        const projects = Array.isArray(data) ? data.reverse() : [];

// Prepare the chart data based on the fetched projects
        const chartData = projects.map((project, index) => ({
            name: project.service_name, // Assuming your fetched data has a 'service_name' property
            quantity: project.expected_quantity, // Assuming your fetched data has a 'expected_quantity' property
        }));

        return (
            <Card className="flex flex-col relative bg-[url('/images/projects/bg-card-2.svg')] bg-no-repeat bg-top">
                <CardHeader className="items-center pb-0">
                    <CardTitle className="text-lg font-bold">Tasks</CardTitle>
                    <CardDescription>General Overview</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
            <div className="">
                {/* Check if graphData has data or not */}
                {chartData.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <p>No current data available</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart width={400} height={400}>
                            {/* Tooltip for displaying ticket count */}
                            {/* @ts-ignore*/}
                            <Tooltip content={<CustomTooltip />} />
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="quantity"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
                </CardContent>
            </Card>
        );
}

export default TaskChart;

