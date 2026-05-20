import React, { PureComponent } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

export default function SegmentServiceCompletionGraph() {

    const pathname = usePathname()
    const project_id = parseInt(pathname.replace('/projects/',''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`,''));

    const { isLoading:countsLoading, error:countsError, data:countsData } = useSingleSegment('/segment_dashboard/serviceData', segment_id)

    const services = Array.isArray(countsData) ? countsData.reverse() : [];

    const data = services.map(service => ({
        name: service.service_name,
        Initial: service.initial_quantity,
        Utilized: service.utilized_value,
        Expected: service.expected_value,
        Change_Request: service.change_request,
    }));

        return (
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="Initial" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="Utilized" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="Expected" stackId="1" stroke="#ffc658" fill="#ffc658" />
                    <Area type="monotone" dataKey="Change_Request" stackId="1" stroke="#ffc658" fill="#57cc99" />
                </AreaChart>
            </ResponsiveContainer>
        );
}
