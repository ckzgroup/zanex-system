"use client"

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend, ResponsiveContainer
} from "recharts";

const data = [
    {
        name: "Mon",
        ecg: 80,
    },
    {
        name: "Tue",
        ecg: 24,
    },
    {
        name: "Wed",
        ecg: 45,
    },
    {
        name: "Thur",
        ecg: 62,
    },
    {
        name: "Fri",
        ecg: 26,
    },
    {
        name: "Sat",
        ecg: 32,
    },
    {
        name: "Sun",
        ecg: 56,
    }
];

export default function Line2Main() {
    return (
        <ResponsiveContainer width={'100%'} height={300}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <Tooltip />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="ecg"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}