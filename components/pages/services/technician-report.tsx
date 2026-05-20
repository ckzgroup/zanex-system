"use client";

import React, { useState } from "react";
import DatePicker from "@/components/ui/datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetchData, { usePostData, usePostReport } from "@/actions/use-api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobCardSchema } from "@/data/services/job-card/schema";
import useAuthStore from "@/hooks/use-user";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "@/components/ui/multi-select2";

const technicianSchema = z.object({
  technician: z.any(),
  startDate: z.any(),
  endDate: z.any(),
  company_id: z.string().nonempty(),
});

type FormData = z.infer<typeof technicianSchema>;

function TechnicianReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<number | string | null>(
    null,
  );
  const [selectedService, setSelectedService] = useState<
    number | string | null
  >(null);
  const [technician, setTechnician] = useState<string[]>([]);

  const { isLoading, error, data } = useFetchData("/users");

  const technicians = Array.isArray(data)
    ? data
        .reverse()
        .filter((user) =>
          user.roles.some(
            (role: { role_name: string }) => role.role_name === "Technician",
          ),
        )
    : [];

  const company = useAuthStore((state) => state.user?.result.user_company_id);
  const company_id = company?.toString();

  const form = useForm<FormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      technician: [],
      startDate: new Date().toISOString().split("T")[0], // Default to today
      endDate: new Date().toISOString().split("T")[0], // Default to today
      company_id: company_id,
    },
  });

  const pdf = process.env.NEXT_PUBLIC_IMAGES + "/fpdf/generate/Tech-Report.php";

  async function onSubmit(data: FormData) {
    try {
      setLoading(true);

      // Format the dates
      const formattedStartDate = fromDate
        ? new Date(fromDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      const formattedEndDate = toDate
        ? new Date(toDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];

      // Construct the query string
      const queryParams = new URLSearchParams({
        technician: data.technician,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        company_id: company_id || "",
      }).toString();

      const url = `https://k-task.ckzgroup.com/upload/fpdf/generate/Tech-Report.php?${queryParams}`;

      // Send a GET request to the backend
      const response = await axios.get(url, {
        responseType: "blob", // Ensure the response is a Blob
      });

      // Create a Blob URL and trigger the download
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "Technicians_Performance_Report.pdf"); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (response.status === 200) {
        // Reset the form after successful submission
        form.reset();
        setFromDate(null);
        setToDate(null);

        router.refresh();

        toast({
          title: "Report Generated!",
          description: "You have successfully generated the technician report.",
          variant: "default",
        });
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Filters */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          <div className="grid">
            <FormField
              control={form.control}
              name="technician"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technician</FormLabel>
                  <FormControl>
                    {/*<Select onValueChange={(value) => field.onChange(value)}>*/}
                    {/*    <SelectTrigger>*/}
                    {/*        <SelectValue placeholder="Select Technician" />*/}
                    {/*    </SelectTrigger>*/}
                    {/*    <SelectContent>*/}
                    {/*        <SelectItem value="ALL" >*/}
                    {/*            All*/}
                    {/*        </SelectItem>*/}
                    {/*        {technicians.map((tech) => (*/}
                    {/*            <SelectItem key={tech.user_id} value={String(tech.user_id)}>*/}
                    {/*                {tech.user_firstname} {tech.user_lastname}*/}
                    {/*            </SelectItem>*/}
                    {/*        ))}*/}
                    {/*    </SelectContent>*/}
                    {/*</Select>*/}

                    <MultiSelector
                      values={field.value} // Use form state instead of local state
                      onValuesChange={(values) => {
                        field.onChange(values); // Sync with react-hook-form
                      }}
                      loop={false}>
                      <MultiSelectorTrigger>
                        <MultiSelectorInput placeholder="Select Technician" />
                      </MultiSelectorTrigger>
                      <MultiSelectorContent>
                        <MultiSelectorList>
                          {technicians.map((tech) => (
                            <MultiSelectorItem
                              key={tech.user_id}
                              value={tech.user_id}>
                              {tech.user_firstname} {tech.user_lastname}
                            </MultiSelectorItem>
                          ))}
                        </MultiSelectorList>
                      </MultiSelectorContent>
                    </MultiSelector>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Start Date </FormLabel>
                  <FormControl>
                    <DatePicker //@ts-ignore
                      selected={fromDate} //@ts-ignore
                      onChange={(date) => setFromDate(date)}
                      placeholderText="Start Date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid">
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> End Date </FormLabel>
                  <FormControl>
                    <DatePicker //@ts-ignore
                      selected={toDate} //@ts-ignore
                      onChange={(date) => setToDate(date)}
                      placeholderText="End Date"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="space-x-2 mt-6">
            <span> Generate Report </span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default TechnicianReport;
