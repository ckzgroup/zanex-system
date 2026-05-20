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

const segmentSchema = z.object({
  segment_id: z.any(),
});

type FormData = z.infer<typeof segmentSchema>;

function SegmentBudgetReport() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const company = useAuthStore((state) => state.user?.result.user_company_id);
  const company_id = company?.toString();

  const form = useForm<FormData>({
    resolver: zodResolver(segmentSchema),
    defaultValues: {
      segment_id: segment_id,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setLoading(true);

      // Construct the query string
      const queryParams = new URLSearchParams({
        segment_id: data.segment_id,
      }).toString();

      const url = `https://k-task.ckzgroup.com/upload/fpdf/generate/segment_budget_report.php?${queryParams}`;

      // Send a GET request to the backend
      const response = await axios.get(url, {
        responseType: "blob", // Ensure the response is a Blob
      });

      // Create a Blob URL and trigger the download
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "Segment_Budget_Report.pdf"); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (response.status === 200) {
        // Reset the form after successful submission
        form.reset();
        router.refresh();

        toast({
          title: "Report Generated!",
          description: "You have successfully generated segment budget report.",
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
          <Button type="submit" className="space-x-2 mt-4">
            <span> Generate Segment Budget Report </span>
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default SegmentBudgetReport;
