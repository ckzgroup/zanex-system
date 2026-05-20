"use client";

import React, {useState} from 'react';
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import useAuthStore from "@/hooks/use-user";
import {usePathname, useRouter} from "next/navigation";
import useFetchData, {usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";

interface AddRateCardFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const rateSchema = z.object({
  company_id: z.string(),
  service_id:  z.string(),
  service_type: z.string().optional(),
  service_sub_category_name: z.string().nonempty(),
  rate_amount:  z.any(),
  created_date:  z.any(),
  created_by:  z.string(),
})


type FormData = z.infer<typeof rateSchema>

function AddRateCardForm({ className, ...props }: AddRateCardFormProps) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // GET COMPANY ID
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    const company_id = company?.toString();


    // GET USER ID
    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();


    // GET SERVICES
    const { isLoading:serviceLoading, error:serviceError, data:service_data } = useFetchData('/project_service/getProjectServices');
    const services_data = Array.isArray(service_data) ? service_data.reverse() : [];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services_data.filter((s: any) =>
    s.service_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

    const form = useForm<FormData>({
        resolver: zodResolver(rateSchema),
        defaultValues: {
          company_id: company_id,
          service_id: "",
          service_type: " ",
          service_sub_category_name: "",
          rate_amount: "",
          created_date: new Date(),
          created_by: user_id,
        }
    });

  console.log(form.formState.errors)

    const mutation = usePostData('/wage_bill/createWageBill');

    async function onSubmit(data: FormData) {

      console.log(data)
        try {
            setLoading(true);

            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            toast({
                title: "Rate Card added!",
                description: "You have successfully added a rate card.",
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
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div
                        className="space-y-4">
                      <div className="grid gap-1">
                        <FormField
                          control={form.control}
                          name="service_id"
                          render={({field}) => (
                            <FormItem>
                              <FormLabel> Service </FormLabel>
                              <Select onValueChange={field.onChange} defaultValue="">
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select service"/>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {/* Search Input */}
                                  <div className="p-2">
                                    <Input
                                      placeholder="Search Service"
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      onFocus={(e) => e.target.select()} // Safely handle focus
                                    />
                                  </div>
                                  {filteredServices.map((service: any) => (
                                    <SelectItem key={service.project_service_id}
                                                value={`${service.project_service_id}`}> {service.service_name} </SelectItem>
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
                                name="service_sub_category_name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel> Category </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter category name" {...field}
                                                   type="text"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid">
                            <FormField
                                control={form.control}
                                name="rate_amount"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel> Rate Amount </FormLabel>
                                        <FormControl>
                                          <Input placeholder="Enter rate amount" {...field}
                                                 type="number"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <Button type="submit" className="space-x-2">
                        <span> Add Rate Card </span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default AddRateCardForm;
