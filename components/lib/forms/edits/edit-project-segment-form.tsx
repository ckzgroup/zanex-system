"use client";

import React, {useEffect, useState} from 'react';
import * as z from "zod";
import {editSegmentSchema} from "@/utils/projects/validations/forms";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
// @ts-ignore
import { useCountries } from 'use-react-countries'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useRouter} from "next/navigation";
import useAuthStore from "@/hooks/use-user";
import useFetchData, {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";


import {useSingleUser} from "@/actions/get-user";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils";
import {format} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {Textarea} from "@/components/ui/textarea";
import {useSingleSegment} from "@/actions/get-project-segment";

type FormData = z.infer<typeof editSegmentSchema>

interface IProps {
  segment_id: any
}

function EditProjectSegmentForm({ segment_id }: IProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    const company_id = company?.toString();

    // @ts-ignore
    const {isLoading, error, data } = useSingleSegment('/project_segment/getSegment', segment_id);
    const segment = data;
  const segmentData = Array.isArray(segment) && segment.length > 0 ? segment[0] : {};

    // Check if projectData is defined and has elements
    // const user = userData && userData.length > 0 ? userData[0] : null;
    const {
      segment_id: id,
      segment_name,
      start_point,
      end_point,
      est_distance,
      site_number,
      overlap,
      comment,
      sub_contractor,
      start_date,
      end_date,

    } = segmentData || {};

  console.log("Segment", segment_name);



  const form = useForm<FormData>({
        resolver: zodResolver(editSegmentSchema),
        defaultValues: {
          segment_id: id,
          segment_name: segment_name || "",
          start_point: start_point || "",
          end_point: end_point || "",
          est_distance: est_distance || 0,
          site: site_number || 0,
          overlap: overlap || 0,
          comment: comment || "",
          sub_contractor: sub_contractor || "",
          start_date: start_date || new Date() ,
          end_date: end_date || new Date(),
        }
    });


    const mutation = usePatchData('/project_segment');

    async function onSubmit(data: FormData) {
        // Append the file if it exists
        try {
            setLoading(true);
            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            form.reset();
            toast({
                title: "Segment Updated Successfully!",
                description: "You have successfully updated segmeny details.",
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

    return (
        <div className="pb-32">
            {segment && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div
                            className="space-y-4">
                            <div className="grid">
                              <FormField
                                control={form.control}
                                name="segment_name"
                                render={({field}) => (
                                  <FormItem>
                                    <FormLabel> Segment Name </FormLabel>
                                    <FormControl>
                                      <Input disabled={loading} placeholder={segment_name} defaultValue={segment_name} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="grid">
                              <FormField
                                control={form.control}
                                name="start_point"
                                render={({field}) => (
                                  <FormItem>
                                    <FormLabel> Start Point Coordinate </FormLabel>
                                    <FormControl>
                                      <Input disabled={loading} placeholder={start_point} defaultValue={start_point} {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                  </FormItem>
                                )}
                              />
                            </div>

                          <div className="grid gap-1">
                            <FormField
                              control={form.control}
                              name="end_point"
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel> End Point Coordinate </FormLabel>
                                  <FormControl>
                                    <Input disabled={loading} placeholder={end_point} defaultValue={end_point} {...field} />
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </div>


                          <div className="grid gap-1">
                            <FormField
                              control={form.control}
                              name="est_distance"
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel> Est Distance (M) </FormLabel>
                                  <FormControl>
                                    <Input type="number" disabled={loading}
                                           placeholder={est_distance} defaultValue={est_distance}
                                           {...field} />
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-1">
                            <FormField
                              control={form.control}
                              name="site"
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel> Number of Sites </FormLabel>
                                  <FormControl>
                                    <Input type="number" disabled={loading}
                                           placeholder={site_number} defaultValue={site_number}
                                           {...field} />
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-1">
                            <FormField
                              control={form.control}
                              name="overlap"
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel> Overlap (M) </FormLabel>
                                  <FormControl>
                                    <Input type="number" disabled={loading}
                                           placeholder={overlap} defaultValue={overlap}
                                           {...field} />
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </div>


                          <div className="grid gap-1">
                            <FormField
                              control={form.control}
                              name="sub_contractor"
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel> Subcontractor </FormLabel>
                                  <FormControl>
                                    <Input  disabled={loading}
                                            placeholder={sub_contractor} defaultValue={sub_contractor}
                                            {...field} />
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </div>


                          <div className="grid gap-1">
                            <FormField
                              control={form.control}
                              name="start_date"
                              render={({field}) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>Start Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                          defaultValue={start_date}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon
                                            className="ml-auto h-4 w-4 opacity-50"/>
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single" //@ts-ignore
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-1">
                            <FormField
                              control={form.control}
                              name="end_date"
                              render={({field}) => (
                                <FormItem className="flex flex-col">
                                  <FormLabel>End Date</FormLabel>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          variant={"outline"}
                                          className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                          )}
                                          defaultValue={end_date}
                                        >
                                          {field.value ? (
                                            format(field.value, "PPP")
                                          ) : (
                                            <span>Pick a date</span>
                                          )}
                                          <CalendarIcon
                                            className="ml-auto h-4 w-4 opacity-50"/>
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                      <Calendar
                                        mode="single" //@ts-ignore
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                      />
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid gap-1">
                            <FormField
                              control={form.control}
                              name="comment"
                              render={({field}) => (
                                <FormItem>
                                  <FormLabel> Segment Comment </FormLabel>
                                  <FormControl>
                                    <Textarea
                                      disabled={loading}
                                      rows={5}
                                      placeholder={comment}
                                      {...field}
                                    ></Textarea>
                                  </FormControl>
                                  <FormMessage/>
                                </FormItem>
                              )}
                            />
                          </div>


                        </div>
                        <Button type="submit" className="space-x-2">
                            <span> Update Segment </span>
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    );
}

export default EditProjectSegmentForm;
