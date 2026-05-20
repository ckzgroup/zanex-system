"use client";

import React, {useState} from 'react';
import {Button, buttonVariants} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Check} from "lucide-react";
import SegmentLayout from "@/components/pages/projects/projects/segments/segment-layout";
import useFetchData, {usePostData} from "@/actions/use-api";
import * as z from "zod";
import {usePathname, useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {toast} from "@/components/ui/use-toast";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import {cn} from "@/lib/utils";
import {Plus, Stamp} from "@phosphor-icons/react";
import AddClosureItemForm from "@/components/lib/forms/projects/add-closure-item-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Badge} from "@/components/ui/badge";
import {useSingleSegment} from "@/actions/get-project-segment";
import {formatDate} from "@/utils/format-date";


const closureSchema = z.object({
    acceptance_segment_id: z.string().nonempty(),
    acceptance_score: z.string().nonempty(),
    acceptance_description: z.string().nonempty(),
    acceptance_parameter_id: z.string().nonempty(),
    acceptance_file: z.any(),
    acceptance_date: z.any(),
    acceptance_user_id: z.string(),
})

type FormData = z.infer<typeof closureSchema>

function SegmentClosurePage() {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // @ts-ignore
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    // @ts-ignore
    const user = useAuthStore((state) => state.user?.result.user_id);

    // @ts-ignore
    const company_id = company.toString(); // @ts-ignore
    const user_id = user.toString();

    // Segment ID
    const pathname = usePathname();
    const project_id = parseInt(pathname.replace('/projects/', ''));
    const segment_id = parseInt(pathname.replace(`/projects/${project_id}/segments/`, ''));

    // Get Closure Items
    const { isLoading, error, data} = useSingleSegment('/segment_closure/getAllSegmentClosureChecks', segment_id)

    const closure_items = Array.isArray(data) ? data.reverse() : [];

    const form = useForm<FormData>({
        resolver: zodResolver(closureSchema),
        defaultValues: {
            acceptance_segment_id: `${segment_id}`,
            acceptance_score: "",
            acceptance_description: "",
            acceptance_parameter_id: "",
            acceptance_file: null,
            acceptance_date: new Date(),
            acceptance_user_id: `${user_id}`
        }
    });


    const mutation = usePostData('/segment_closure/createSegmentAcceptance');

    async function onSubmit(data: FormData) {
        const formData = new FormData();

        if (!data.acceptance_file) {
            console.error("No file selected!");
            toast({
                title: "Error",
                description: "Please upload a file before submitting.",
                variant: "destructive",
            });
            return;
        }


        formData.append("acceptance_file", data.acceptance_file);



        try {
            await mutation.mutateAsync(data);
            setLoading(false);
            setIsSuccess(true);
            router.refresh();
            form.reset();
            toast({
                title: "Segment Closed Successfully!",
                description: "You have successfully close the segment.",
                variant: "default"
            });
            // Optionally refetch data after mutation
        } catch (error) {
            setLoading(false);
            setIsSuccess(false);
            toast({
                title: "Error",
                description: "An unexpected error occurred. Please try again later.",
                variant: "destructive"
            });
            // Handle mutation error
        }  finally {
            setLoading(false);
        }
    }

    // Get All Closures
    const { isLoading: closedLoading, error:closedError, data:closedData } = useSingleSegment('/segment_closure/getAllSegmentAcceptances', segment_id)
    const closures = Array.isArray(closedData) ? closedData.reverse() : [];


    return (
        <SegmentLayout>
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="h-8 w-1 bg-primary rounded-full"/>
                    <h4 className="text-primary text-lg font-bold tracking-wide"> Segment Closure </h4>
                </div>



                <div className='flex space-x-2 items-center'>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                className={cn(
                                    buttonVariants({variant: "default"}),
                                    "space-x-1"
                                )}
                            >
                                <Stamp className='h-5 w-5'/>
                                <span> Close Segment </span>
                            </Button>
                        </SheetTrigger>

                        <SheetContent>
                            <SheetHeader>
                                <SheetTitle> Close Segment  </SheetTitle>
                                <SheetDescription>
                                    Use the form below to close the segment.
                                </SheetDescription>
                            </SheetHeader>
                                        <div className="mt-6">
                                            <Form {...form} >
                                                <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
                                                    <div className="space-y-4">

                                                        <div className="grid">
                                                    <FormField
                                                        control={form.control}
                                                        name="acceptance_parameter_id"
                                                        render={({field}) => (
                                                            <FormItem>
                                                                <FormLabel> Closure Item </FormLabel>
                                                                <Select onValueChange={field.onChange}>
                                                                    <FormControl>
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Choose Item" defaultValue="" />
                                                                        </SelectTrigger>
                                                                    </FormControl>
                                                                    <SelectContent>
                                                                        {closure_items.map((i: any) => (
                                                                            <SelectItem
                                                                                key={i.project_closure_parameter_id}
                                                                                value={`${i.project_closure_parameter_id}`}
                                                                            >
                                                                                {i.parameter_name}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <FormMessage/>
                                                            </FormItem>
                                                        )}
                                                    />
                                        </div>
                                                        <div className="grid">
                                                            <FormField
                                                                control={form.control}
                                                                name="acceptance_score"
                                                                render={({ field }) => (
                                                                    <FormItem className="space-y-3">
                                                                        <FormLabel> Score </FormLabel>
                                                                        <FormControl>
                                                                            <RadioGroup
                                                                                onValueChange={field.onChange}
                                                                                defaultValue={field.value}
                                                                                className="flex space-x-1"
                                                                            >
                                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                                    <FormControl>
                                                                                        <RadioGroupItem value="Pass" />
                                                                                    </FormControl>
                                                                                    <FormLabel className="font-normal">
                                                                                        Pass
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                                                    <FormControl>
                                                                                        <RadioGroupItem value="Fail" />
                                                                                    </FormControl>
                                                                                    <FormLabel className="font-normal">
                                                                                        Fail
                                                                                    </FormLabel>
                                                                                </FormItem>
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>


                                            <div className="grid">
                                                <FormField
                                                    control={form.control}
                                                    name="acceptance_file"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel> Closure File </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="file"
                                                                    required
                                                                    accept="*"
                                                                    onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid">
                                                <FormField
                                                    control={form.control}
                                                    name="acceptance_description"
                                                    render={({field}) => (
                                                        <FormItem>
                                                            <FormLabel> Description </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    disabled={loading}
                                                                    rows={5}
                                                                    placeholder="Write description"
                                                                    {...field}
                                                                > </Textarea>
                                                            </FormControl>
                                                            <FormMessage/>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        {isSuccess ? (
                                            <SheetClose asChild>
                                                <Button type="button" className="space-x-2">
                                                    <span> Closure Added! </span>
                                                </Button>
                                            </SheetClose>
                                        ) : (
                                            <Button type="submit" className="space-x-2" disabled={loading}>
                                                <span> Add Closure </span>
                                            </Button>
                                        )}

                                    </form>
                                </Form>

                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="space-y-6">
                <div
                    className="border border-dashed border-primary/30 rounded-lg p-6 shadow-inner shadow-primary/10 space-y-6">
                    <Badge className="text-primary bg-primary/15 text-base py-2 px-4 hover:bg-primary/15">
                        Closure Details
                    </Badge>
                    {closures ? (
                        <div className="grid  gap-x-6 gap-y-2">
                            {closures.map((c: any, index: number) => (
                                <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-12">
                                    <div className="space-y-2">
                                        <h5 className="font-mono text-muted-foreground"> Name </h5>
                                        <p className="font-semibold text-base"> {c.parameter_name} </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="font-mono text-muted-foreground"> Date </h5>
                                        <p className="font-semibold text-base"> {formatDate(c.acceptance_date)} </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="font-mono text-muted-foreground"> Description </h5>
                                        <p className="font-semibold text-base"> {c.acceptance_description} </p>
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="font-mono text-muted-foreground"> Closure File </h5>
                                        {c.acceptance_file ? (
                                           <div>
                                               <a href="#" download>
                                                   <svg id="file-pdf" className="w-28 h-28 text-red-500 dark:text-white" aria-hidden="true"
                                                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                                                        viewBox="0 0 24 24">
                                                       <path fill-rule="evenodd"
                                                             d="M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm-6 9a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h.5a2.5 2.5 0 0 0 0-5H5Zm1.5 3H6v-1h.5a.5.5 0 0 1 0 1Zm4.5-3a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h1.376A2.626 2.626 0 0 0 15 15.375v-1.75A2.626 2.626 0 0 0 12.375 11H11Zm1 5v-3h.375a.626.626 0 0 1 .625.626v1.748a.625.625 0 0 1-.626.626H12Zm5-5a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-1h1a1 1 0 1 0 0-2h-1v-1h1a1 1 0 1 0 0-2h-2Z"
                                                             clip-rule="evenodd"/>
                                                   </svg>
                                               </a>
                                           </div>
                                        ) : (
                                            <p className="font-medium text-base italic">  No file found </p>
                                            )}
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="font-mono text-muted-foreground"> Segment Score </h5>
                                        {c.acceptance_score === "Pass" ? (
                                            <Badge className="font-semibold text-base bg-green-600 hover:bg-green-500"> {c.acceptance_score} </Badge>

                                        ) : (
                                            <Badge className="font-semibold text-base bg-red-600 hover:bg-red-500 "> {c.acceptance_score} </Badge>
                                            )}
                                    </div>

                                    <div className="space-y-2">
                                        <h5 className="font-mono text-muted-foreground"> Status</h5>
                                        <Badge className="font-semibold text-base "> {c.acceptance_status} </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p> Segment Not Closed! </p>
                    )}
                </div>

            </div>
        </div>
        </SegmentLayout>
    );
}

export default SegmentClosurePage;