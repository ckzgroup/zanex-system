"use client";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {Progress} from "@/components/ui/progress";
import {Ellipsis} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import useFetchData from "@/actions/use-api";
import Loading from "@/app/(admin)/(projects)/loading";
import React from "react";
import {formatDate} from "@/utils/format-date";


export default function RecentProjects() {

    const { isLoading, error, data } = useFetchData('/project_main_Dashboard/recentProject');

    const projects = Array.isArray(data) ? data.reverse().slice(0, 6) : [];

    if (isLoading) return <div> <Loading/> </div>;

    return (
        <Table>
            <TableCaption>A list of your recent projects.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {projects.map((project) => (
                    <TableRow key={project.project_name}>
                        <TableCell className="font-medium">{project.project_name}</TableCell>
                        <TableCell>{formatDate(project.project_end_date)}</TableCell>
                        <TableCell>
                            {/* @ts-ignore */}
                            <Progress value={project.percentage_progress} indicatorColor="bg-primary" />
                        </TableCell>

                        <TableCell className="text-right">
                                <Badge
                                    className="bg-background border border-accent text-muted-foreground hover:bg-accent"
                                >
                                    <Ellipsis size={16}/>
                                </Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
