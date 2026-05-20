import React, { PureComponent } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {usePathname} from "next/navigation";
import {useSingleSegment} from "@/actions/get-project-segment";

const data = [
    {
        name: 'Page A',
        uv: 4000,
        pv: 2400,
        amt: 2400,
    },
    {
        name: 'Page B',
        uv: 3000,
        pv: 1398,
        amt: 2210,
    },
    {
        name: 'Page C',
        uv: 2000,
        pv: 9800,
        amt: 2290,
    },
    {
        name: 'Page D',
        uv: 2780,
        pv: 3908,
        amt: 2000,
    },
    {
        name: 'Page E',
        uv: 1890,
        pv: 4800,
        amt: 2181,
    },
    {
        name: 'Page F',
        uv: 2390,
        pv: 3800,
        amt: 2500,
    },
    {
        name: 'Page G',
        uv: 3490,
        pv: 4300,
        amt: 2100,
    },
];

export default function MaterialUsageGraph() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading:countsLoading, error:countsError, data:countsData } = useSingleSegment('/segment_dashboard/materialData', segment_id)

    const materials = Array.isArray(countsData) ? countsData.reverse() : [];

    const data = materials.map(item => ({
        name: item.material_id,
        Initial: item.initial_quantity,
        Utilized: item.utilized_quantity,
        Expected: item.expected_quantity,
        Change_Request: item.change_request,
    }));

    return (
            <ResponsiveContainer width="100%" height={300}>
                <BarChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Expected" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
                    <Bar dataKey="Utilized" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
                </BarChart>
            </ResponsiveContainer>
        );

}
