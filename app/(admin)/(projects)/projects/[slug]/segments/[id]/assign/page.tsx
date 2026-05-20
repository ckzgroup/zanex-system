"use client";

import React from 'react';

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import AssignServiceForm from "@/components/lib/forms/assign-service-form";
import AssignMaterialForm from "@/components/lib/forms/assign-material-form";
import AssignKpiForm from "@/components/lib/forms/assign-kpi-form";
import AssignSupervisorForm from "@/components/lib/forms/assign-supervisor-form";
import AssignClosureItemsForm from "@/components/lib/forms/assign-closure-items-form";

function SegmentAssignPage() {

    return (
        <div className="pt-6">
            <Accordion type="single" className="w-full space-y-2">
                <AccordionItem value="item-1">
                    <AccordionTrigger className=""> Segment Services </AccordionTrigger>
                    <AccordionContent>
                        <div>
                            <AssignServiceForm/>
                        </div>
                    </AccordionContent>
                </AccordionItem>


                <AccordionItem value="item-2">
                    <AccordionTrigger> Segment Materials </AccordionTrigger>
                    <AccordionContent>
                        <div>
                            <AssignMaterialForm />
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/*<AccordionItem value="item-3">*/}
                {/*    <AccordionTrigger> Segment KPIs </AccordionTrigger>*/}
                {/*    <AccordionContent>*/}
                {/*        <div>*/}
                {/*            <AssignKpiForm />*/}
                {/*        </div>*/}
                {/*    </AccordionContent>*/}
                {/*</AccordionItem>*/}

                <AccordionItem value="item-4">
                    <AccordionTrigger> Set Closure Items </AccordionTrigger>
                    <AccordionContent>
                        <div>
                            <AssignClosureItemsForm />
                        </div>
                    </AccordionContent>
                </AccordionItem>



                <AccordionItem value="item-5">
                    <AccordionTrigger> Assign Field Supervisor </AccordionTrigger>
                    <AccordionContent>
                        <div>
                            <AssignSupervisorForm />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default SegmentAssignPage;
