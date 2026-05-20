"use client";

import React, { PureComponent } from 'react';
import {PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";
import {Dot} from "@phosphor-icons/react";

const COLORS = ['#6F91F6', '#FFCA59', '#FD6A7C', '#946afd', '#6afdfd', '#a5fd6a'];

const RADIAN = Math.PI / 180;
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

export default function  SegmentServiceChart() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading:countsLoading, error:countsError, data:countsData } = useSingleSegment('/segment_dashboard/serviceData', segment_id)

    const services = Array.isArray(countsData) ? countsData.reverse() : [];

    const data = services.map(service => ({
        name: service.service_name,
        value: service.initial_quantity,
    }));


        return (
            <ResponsiveContainer width="100%" height={300}>
               <>
                   <PieChart width={400} height={280}>
                       <Pie
                           data={data}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           label={renderCustomizedLabel}
                           outerRadius={120}
                           fill="#8884d8"
                           dataKey="value"
                       >
                           {data.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                           ))}
                       </Pie>
                       <Tooltip />
                   </PieChart>
                   {/*<div className="absolute bottom-2 left-[14%] grid grid-cols-3 gap-4 space-x-4 justify-center">*/}
                   {/*    {data.map((entry, index) => (*/}
                   {/*        <div className="flex items-center space-x-1" key={index}>*/}
                   {/*            <Dot weight="fill" size={32} fill={COLORS[index % COLORS.length]}/>*/}
                   {/*            <p>{entry.name}</p>*/}
                   {/*        </div>*/}
                   {/*    ))}*/}
                   {/*</div>*/}
               </>
            </ResponsiveContainer>
        );

}
