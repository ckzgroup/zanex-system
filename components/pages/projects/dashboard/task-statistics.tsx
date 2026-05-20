import React from 'react';
import MultiProgress from 'react-multi-progress'
import {Progress} from "@/components/ui/progress";
import {RadioButton} from "@phosphor-icons/react";

function TaskStatistics() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
                <div
                    className="flex items-center transition duration-300 group hover:bg-primary hover:text-background justify-center border-2 border-dashed py-4 rounded-md border-primary/30 shadow-md shadow-accent text-center">
                    <div className="space-y-1">
                        <h4 className="text-base duration-300 font-medium text-muted-foreground group-hover:text-background">Total
                            Tasks</h4>
                        <h2 className="text-2xl font-bold">385</h2>
                    </div>
                </div>

                <div
                    className="flex items-center transition duration-300 group hover:bg-destructive hover:text-background justify-center border-2 border-dashed py-4 rounded-md border-primary/30 shadow-md shadow-accent text-center">
                    <div className="space-y-1">
                        <h4 className="text-base duration-300 font-medium text-muted-foreground group-hover:text-background">
                            Overdue Tasks
                        </h4>
                        <h2 className="text-2xl font-bold">19</h2>
                    </div>
                </div>
            </div>

            <div>
                <MultiProgress
                    height={20}
                    elements={[
                        {
                            value: 20,
                            color: "#7637FB",
                        },
                        {
                            value: 20,
                            color: "#FFBC34",
                        },
                        {
                            value: 20,
                            color: "#55CE63",
                        },
                        {
                            value: 20,
                            color: "#FC133D",
                        },
                        {
                            value: 20,
                            color: "#009EFB",
                        },
                    ]}
                />
            </div>

            <div className="px-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <RadioButton weight="fill" size={20} className="text-[#9368E9]"/>
                        <p className="text-base font-medium">Completed Tasks</p>
                    </div>
                    <p className="text-base font-medium">166</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <RadioButton weight="fill" size={20} className="text-[#FFBC34]"/>
                        <p className="text-base font-medium">Inprogress Tasks</p>
                    </div>
                    <p className="text-base font-medium">115</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <RadioButton weight="fill" size={20} className="text-[#55CE63]"/>
                        <p className="text-base font-medium">On Hold Tasks</p>
                    </div>
                    <p className="text-base font-medium">31</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <RadioButton weight="fill" size={20} className="text-[#FC133D]"/>
                        <p className="text-base font-medium">Pending Tasks</p>
                    </div>
                    <p className="text-base font-medium">47</p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <RadioButton weight="fill" size={20} className="text-[#009EFB]"/>
                        <p className="text-base font-medium">Review Tasks</p>
                    </div>
                    <p className="text-base font-medium">5</p>
                </div>
            </div>
        </div>
    );
}

export default TaskStatistics;