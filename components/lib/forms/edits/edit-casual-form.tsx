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
import useFetchData, {usePatchData, usePostData} from "@/actions/use-api";
import {toast} from "@/components/ui/use-toast";
import {useSingleCustomer} from "@/actions/get-customer";
import {useSingleRate} from "@/actions/get-rate-card";
import {useSingleCasual} from "@/actions/get-casuals";

interface EditCasualFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const casualSchema = z.object({
  Casual_name: z.string(),
  Casual_id: z.any(),
  Country_code:  z.any(),
  Casual_phone_no: z.any(),
});

type FormData = z.infer<typeof casualSchema>

interface IProps {
  casual_account_id: any
}

function EditCasualForm({casual_account_id, className, ...props }: EditCasualFormProps & IProps & { casual_account_id: any}) {

    const router =  useRouter();
    const [loading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false);

    // GET COMPANY ID
    const company = useAuthStore((state) => state.user?.result.user_company_id);
    const company_id = company?.toString();


    // GET USER ID
    const user = useAuthStore((state) => state.user?.result.user_id);
    const user_id = user?.toString();


  // @ts-ignore
  const {isLoading: casualLoading, error: casualError, data: casualData } = useSingleCasual('/wage_bill/getCasualById', casual_account_id);
  // Check if projectData is defined and has elements
  const casual = casualData && casualData.length > 0 ? casualData[0] : null;
  const {
    Casual_name,
    Country_code,
    Casual_phone_no,
    Casual_id,
  } = casual || {};


  const form = useForm<FormData>({
        resolver: zodResolver(casualSchema),
        defaultValues: {
          Casual_id: Casual_id,
          Casual_name: Casual_name || "",
          Country_code: Country_code || "",
          Casual_phone_no: Casual_phone_no || "",
        }
    });


  const mutation = usePatchData('/wage_bill/updateWageBill');

    async function onSubmit(data: FormData) {

        try {
            setLoading(true);

            await mutation.mutateAsync(data);
            setIsSuccess(true);
            router.refresh();
            toast({
                title: "Casual Updated!",
                description: "You have successfully updated casual.",
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
          {casualData && casualData.length > 0 ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div
                  className="space-y-4">

                  <div className="grid">
                    <FormField
                      control={form.control}
                      name="Casual_name"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel> Name </FormLabel>
                          <FormControl>
                            <Input defaultValue={Casual_name} placeholder={Casual_name}
                                   {...field}
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
                      name="Country_code"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel> Country Code </FormLabel>
                          <FormControl>
                            <Input defaultValue={Country_code} placeholder={Country_code}
                                   {...field}
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
                      name="Casual_phone_no"
                      render={({field}) => (
                        <FormItem>
                          <FormLabel> Phone Number </FormLabel>
                          <FormControl>
                            <Input defaultValue={Casual_phone_no} placeholder={Casual_phone_no}
                                   {...field}
                                   type="text"/>
                          </FormControl>
                          <FormMessage/>
                        </FormItem>
                      )}
                    />
                  </div>

                </div>
                <Button type="submit" className="space-x-2">
                  <span> Update Casual </span>
                </Button>
              </form>
            </Form>
          ) : null}
        </div>
    );
}

export default EditCasualForm;
