"use client";

import React, { useState } from 'react';
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

import BudgetMaterial from "@/components/lib/forms/projects/budget-material";
import BudgetService from "@/components/lib/forms/projects/budget-services";
import BudgetLabour from "@/components/lib/forms/projects/budget-labour";



const AddBudget: React.FC = () => {

    return (
        <SegmentLayout>
            <div className="pt-6">
                <Accordion type="single" className="w-full space-y-2">

                    <AccordionItem value="item-1">
                        <AccordionTrigger> Materials Budget </AccordionTrigger>
                        <AccordionContent>
                            <div>
                                <BudgetMaterial />
                            </div>
                        </AccordionContent>
                    </AccordionItem>


                    <AccordionItem value="item-3">
                        <AccordionTrigger> Service Items Budget </AccordionTrigger>
                        <AccordionContent>
                            <div>
                                <BudgetLabour />
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                </Accordion>
            </div>
        </SegmentLayout>
    );
};

export default AddBudget;
