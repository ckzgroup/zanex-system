"use client";

import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import {useSingleSegment} from "@/actions/get-project-segment";

const MaterialBudgetGraph = ({ segment_id }: { segment_id: number }) => {
    const { isLoading, error, data } = useSingleSegment("/budget/getSegmentExpenditure", segment_id);

    const chartData = useMemo(() => {
        return data
            ?.filter((item: any) => item.budget_item_type === "Material") // Filter only "Material" items
            .map((item: any) => ({
                name: item.item_name, // Display name on X-axis
                "Budget Amount": item.budget_item_amount, // Renamed from `uv`
                "Total Spent": item.total_amount_spent, // Renamed from `pv`
            })) || [];
    }, [data]);


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                width={500}
                height={300}
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" /> {/* ✅ Explicitly define `dataKey` */}
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Updated labels */}
                <Line type="monotone" dataKey="Budget Amount" stroke="#82ca9d" />
                <Line type="monotone" dataKey="Total Spent" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default MaterialBudgetGraph;
