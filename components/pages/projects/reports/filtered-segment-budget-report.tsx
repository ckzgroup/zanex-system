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
import { usePathname, useRouter } from "next/navigation";

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
import { useSingleProject } from "@/actions/get-project";

const monthlySchema = z.object({
  segment_id: z.any(),
  startDate: z.any(),
  endDate: z.any(),
});

type FormData = z.infer<typeof monthlySchema>;

function FilteredSegmentBudgetReport() {
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

  const pathname = usePathname();
  const project_id = parseInt(pathname.replace("/projects/", ""));
  const segment_id = parseInt(
    pathname.replace(`/projects/${project_id}/segments/`, ""),
  );

  const { isLoading, error, data } = useSingleProject(
    "/project_segment",
    project_id,
  );

  const segments = Array.isArray(data) ? data.reverse() : [];

  const form = useForm<FormData>({
    resolver: zodResolver(monthlySchema),
    defaultValues: {
      segment_id: segment_id,
      startDate: new Date().toISOString().split("T")[0], // Default to today
      endDate: new Date().toISOString().split("T")[0], // Default to today
    },
  });

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
        segment_id: data.segment_id,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }).toString();

      const url = `https://k-task.ckzgroup.com/upload/fpdf/generate/segment_budget_scope_report.php?${queryParams}`;

      // Send a GET request to the backend
      const response = await axios.get(url, {
        responseType: "blob", // Ensure the response is a Blob
      });

      // Create a Blob URL and trigger the download
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "Monthly_Segment_Budget_Report.pdf"); // Set the file name
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
          description:
            "You have successfully generated the monthly segment budget report.",
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

export default FilteredSegmentBudgetReport;
