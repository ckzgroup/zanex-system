import React, { PureComponent } from 'react';
import {PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";
import {Dot} from "@phosphor-icons/react";
import axios from "axios";
import useAuthStore from "@/hooks/use-user";


const COLORS = ['#6F91F6', '#FFCA59', '#FD6A7C'];

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

export default function SegmentMaterialChangeRequestChart() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading, error, data:mData } = useSingleSegment('/segment_dashboard/materialData', segment_id)

    const materials = Array.isArray(mData) ? mData.reverse() : [];

    const data = materials.map(item => ({
        name: item.material_id,
        value: item.initial_quantity,
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
                    {/*<div className="absolute bottom-2 left-[14%] flex items-center space-x-4 justify-center">*/}
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
