"use client";

import React from "react";
import dynamic from "next/dynamic";
import {Pie, Cell, ResponsiveContainer, Tooltip, Legend} from "recharts";

const PieChart = dynamic(() => (
    import("recharts").then(recharts => recharts.PieChart)
), { ssr: false });

import {useQuery} from "@tanstack/react-query";

import useAuthStore from "@/hooks/use-user";

const COLORS = ["#70D885", "#FF9DA8", "#FFC458", "#DADBDC"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
                                   cx,
                                   cy,
                                   midAngle,
                                   innerRadius,
                                   outerRadius,
                                   percent,
                                   index
                               }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

interface Request {
    request_type: string;
    request_date: string;
    user_name: string;
    status: string;
}

export default function DonutChart() {

    const companyId = useAuthStore((state) => state.getCompanyId());

    const URL=`${process.env.NEXT_PUBLIC_API_URL}/company_request.php?company_id=${companyId}&request_status=all`;

    const { isPending, error, data } = useQuery({
        queryKey: ['repoData', companyId],
        queryFn: async () => {
            try {
                const res = await fetch(URL);
                const data = await res.json();

                // Extract the `detailslist` array
                const requests = data.detailslist || [];

                return requests;
            } catch (error) {
                console.error('Error fetching data:', error);
                throw error; // Re-throw to allow useQuery to handle it
            }
        },
    });


    const requests = Array.isArray(data) ? data : [];

    // Filter requests based on request status
    const totalRequestsLength = requests.length;
    const cancelledRequests = requests.filter((request: Request) => request.status === 'cancelled').length;
    const inProgressRequests = requests.filter((request: Request) => request.status === 'in-progress').length;
    const pendingRequests = requests.filter((request: Request) => request.status === '').length;
    const completedRequests = requests.filter((request: Request) => request.status === 'completed').length;


    const request_data = [
        { name: "Completed", value: completedRequests },
        { name: "Cancelled", value: cancelledRequests },
        { name: "In-Progress", value: inProgressRequests },
        { name: "Pending", value: pendingRequests }
    ];

    return (
        <ResponsiveContainer width="100%" height={300} >
            <PieChart width={200} height={200} margin={{ top: 0, left: 0, right: 0, bottom: 0 }} >
                <Pie
                    data={request_data}
                    cx="40%"
                    cy="40%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {request_data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}
