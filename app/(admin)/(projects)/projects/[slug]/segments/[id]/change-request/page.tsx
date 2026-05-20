"use client";

import React from 'react';
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import MaterialChangeTable from "@/components/pages/projects/projects/segments/material-change-table";
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import ServiceChangeTable from "@/components/pages/projects/projects/segments/service-change-table";

function ChangeRequestPage() {
    return (
        <SegmentLayout>
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <div className="h-8 w-1 bg-primary rounded-full"/>
                <h4 className="text-primary text-lg font-bold tracking-wider"> Change Request </h4>
            </div>

            <div>
                <Tabs defaultValue="material" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="material" className="font-medium">Material Change Request</TabsTrigger>
                        <TabsTrigger value="service" className="font-medium">Service Change Request</TabsTrigger>
                    </TabsList>
                    <TabsContent value="material">
                        <Card>
                            <CardContent className="space-y-2">
                                <MaterialChangeTable/>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="service">
                        <Card>
                            <CardContent className="space-y-2">
                                <ServiceChangeTable/>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        </SegmentLayout>
    );
}

export default ChangeRequestPage;