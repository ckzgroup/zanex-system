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

const slaSchema = z.object({
  customer_id: z.any(),
});

type FormData = z.infer<typeof slaSchema>;

function SlaReport() {
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

  const { isLoading, error, data } = useFetchData("/customers");

  const customers = Array.isArray(data) ? data.reverse() : [];

  const company = useAuthStore((state) => state.user?.result.user_company_id);
  const company_id = company?.toString();

  const form = useForm<FormData>({
    resolver: zodResolver(slaSchema),
    defaultValues: {
      customer_id: 0,
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
        customer_id: data.customer_id,
      }).toString();

      const url = `https://k-task.ckzgroup.com/upload/fpdf/generate/annual_sla.php?${queryParams}`;

      // Send a GET request to the backend
      const response = await axios.get(url, {
        responseType: "blob", // Ensure the response is a Blob
      });

      // Create a Blob URL and trigger the download
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "Annual_SLA_Report.pdf"); // Set the file name
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
          description: "You have successfully generated annual SLA report.",
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
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Customer </FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((c) => (
                          <SelectItem
                            key={c.customer_id}
                            value={String(c.customer_id)}>
                            {c.customer_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default SlaReport;
