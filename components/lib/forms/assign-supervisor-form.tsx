import React, {useState} from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import { z } from "zod"
import Select  from 'react-select'
import {usePathname, useRouter} from "next/navigation";
import makeAnimated from 'react-select/animated';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {CloudCheck, PencilSimpleLine, Trash, X} from "@phosphor-icons/react";
import {Badge} from "@/components/ui/badge";
import useAuthStore from "@/hooks/use-user";
import {segmentMaterialSchema} from "@/utils/projects/validations/forms";
import useFetchData, {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {MultiSelect} from "@/components/ui/multi-select";
import {useSingleSegment} from "@/actions/get-project-segment";

const formSchema = z.array(z.object({
    segment_id: z.coerce.number(),
    supervisor_id: z.array(z.coerce.number()).nonempty(),
    user_id: z.string(),
    assign_status: z.string(),
}))
type FormData = {
    supervisors: z.infer<typeof formSchema>;
};

const animatedComponents = makeAnimated();

function AssignSupervisorForm() {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();

    const pathname = usePathname();
    const project_id = parseInt(pathname.replace('/projects/', ''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`, ''));

    const form = useForm<FormData>({
        resolver: zodResolver(z.object({ supervisors: formSchema })),
        defaultValues: {
            supervisors: [
                {
                    segment_id: segment_id,
                    supervisor_id: [],
                    user_id: user_id,
                    assign_status: "New"
                }
            ]
        }
    });

    const mutation = usePostData('/project_assign');

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            await mutation.mutateAsync(data.supervisors);
            setIsSuccess(true);
            router.refresh();
            form.reset();
            toast({
                title: "Supervisor assigned!",
                description: "You have successfully added a supervisor.",
                variant: "default"
            });
        } catch (error) {
            setIsSuccess(false);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }

    // GET PROJECT MANAGER
    const { isLoading:supervisorLoading, error:supervisorError, data:supervisor_data } = useFetchData('/users');

    // Check if the data is available and is an array
    const dynamicOptions = Array.isArray(supervisor_data) ? supervisor_data.map(supervisor => ({
        value: supervisor.user_id.toString(), // or any unique identifier from the supervisor data
        label: supervisor.user_firstname + " " + supervisor.user_lastname // or the name or any other label you want to display
    })) : [];

// Combine static and dynamic options
    const options = [...dynamicOptions];

    const { isLoading, error, data:submittedSupervisor } = useSingleSegment('/project_assign', segment_id)

    const supervisors = Array.isArray(submittedSupervisor) ? submittedSupervisor.reverse() : [];

    console.log(supervisors)

    return (
        <div>
            <div
                className="border h-80 border-dashed border-primary/30 rounded-lg p-6 shadow-inner shadow-primary/10 space-y-6">

                <div className="space-y-4">
                    <h4 className="text-base font-bold">Assigned Supervisors</h4>
                    <div className="flex items-center space-x-2 ">
                        {supervisors.map((supervisor: any, index: number) => (
                            <div key={index}>
                                <Badge
                                    className="bg-orange-500/20 space-x-2 border whitespace-nowrap text-orange-500 border-orange-500 hover:bg-orange-500/20 py-1 rounded-full w-fit">
                                    <span>{`${supervisor.firstname}  ${supervisor.lastname}`}</span>
                                </Badge>
                            </div>
                        ))}
                        <div>

                        </div>
                    </div>
                </div>
                <hr/>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-5 gap-6 w-full  h-fit">
                            <div className="col-span-3">
                                <FormField
                                    control={form.control}
                                    name={`supervisors.${0}.supervisor_id`}
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel> Supervisor </FormLabel>
                                            <MultiSelect
                                                options={options}
                                                onValueChange={field.onChange}// @ts-ignore
                                                defaultValue={field.value}
                                                placeholder="Select Supervisor"
                                                variant="inverted"
                                                animation={2}
                                                maxCount={3}
                                            />
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 justify-start pt-2">
                            <Button type="reset"
                                    className="bg-destructive/15 hover:bg-destructive/20 border border-destructive text-destructive space-x-2">
                                <X size={20}/>
                                <span> Cancel </span>
                            </Button>
                            <Button type="submit" className="space-x-2">
                                <CloudCheck size={20}/>
                                <span> Save </span>
                            </Button>
                        </div>
                    </form>



                </Form>
            </div>

        </div>
    );
}

export default AssignSupervisorForm;