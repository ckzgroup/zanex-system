"use client";

import React, { useEffect, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ActivityCard from "@/components/pages/services/dashboard/activity-card";
import { usePathname, useRouter } from "next/navigation";
import { useSingleTicket, useTicketMaterials } from "@/actions/get-ticket";
import Loading from "@/app/(admin)/(projects)/loading";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BackButton from "@/components/lib/back-button";
import useFetchData from "@/actions/use-api";

const ticketSchema = z.object({
  ticket_id: z.any(),
});

type FormData = z.infer<typeof ticketSchema>;

function SingleTicketPage() {
  const pathname = usePathname();
  const ticket_id = parseInt(pathname.replace("/service/cases/", ""));

  // GET BASIC TICKET DATA
  const {
    isLoading: BasicLoading,
    error: BasicError,
    data: BasicData,
  } = useSingleTicket("/ticketing/getTicketBasicData", ticket_id);
  const basic_ticket_data = Array.isArray(BasicData) ? BasicData : [];
  const {
    ticket_no,
    ticket_subject,
    ticket_description,
    customer_name,
    sla_time_hrs,
    sla_time_min,
    service_name,
    site_name,
    ticket_create_time,
    ticket_actual_time,
    ticket_state,
    ticket_status,
    close_time,
  } = basic_ticket_data[0] || {};

  const current_time = Date().toLocaleString();

  const convertToISO = (time: any) => {
    const date = new Date(time);
    return date.toISOString();
  };
  console.log(convertToISO(current_time));

  const [timeTaken, setTimeTaken] = useState(null);

  useEffect(() => {
    if (ticket_actual_time) {
      const actualTime = new Date(ticket_actual_time).getTime();
      const currentTime =
        ticket_status === "closed"
          ? new Date(close_time).getTime()
          : new Date(new Date().toISOString()).getTime(); // Convert to ISO before getting time

      const diffMs = currentTime - actualTime; // Time difference in milliseconds

      // Convert to Hours, Minutes, Seconds
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      // @ts-ignore
      setTimeTaken(`${hours}h ${minutes}m ${seconds}s`);
    }
  }, [ticket_actual_time, ticket_status, close_time]);

  // Format Elapsed Time
  const formatElapsedTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return `${hours}h ${minutes}m`;
  };

  // Format Date-Time 
  function formatToFullDateString(dateString: any) {
    const date = new Date(dateString);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const offset = -date.getTimezoneOffset();
    const offsetSign = offset >= 0 ? "+" : "-";
    const offsetHours = String(Math.abs(Math.floor(offset / 60))).padStart(
      2,
      "0",
    );
    const offsetMinutes = String(Math.abs(offset % 60)).padStart(2, "0");

    return `${dayName} ${monthName} ${day} ${year} ${hours}:${minutes}:${seconds}  (${timeZone})`;
  }

  // GET current ASSIGN TICKET DATA
  const {
    isLoading: assignLoading,
    error: assignError,
    data: assignData,
  } = useSingleTicket("/ticketing/getTicketAssignData", ticket_id);
  const assigned_users = Array.isArray(assignData) ? assignData.reverse() : [];

  // GET UPDATES
  const {
    isLoading: updateLoading,
    error: updateError,
    data: updateData,
  } = useSingleTicket("/ticketing/getTicketUpdates", ticket_id);
  const updates = Array.isArray(updateData) ? updateData : [];

  // GET CLOSE AGENT
  const {
    isLoading: agentLoading,
    error: agentError,
    data: agentData,
  } = useSingleTicket("/ticketing/getTicketCloseAgent", ticket_id);
  const agents = Array.isArray(agentData) ? agentData.reverse() : [];

  // GET CLOSE NOC
  const {
    isLoading: nocLoading,
    error: nocError,
    data: nocData,
  } = useSingleTicket("/ticketing/getTicketCloseNoc", ticket_id);
  const noc = Array.isArray(nocData) ? nocData.reverse() : [];

  // GET HOLD
  const {
    isLoading: holdLoading,
    error: holdError,
    data: holdData,
  } = useSingleTicket("/ticketing/getTicketHold", ticket_id);
  const hold = Array.isArray(holdData) ? holdData.reverse() : [];

  // GET MATERIALS
  const {
    isLoading: materialsLoading,
    error: materialsError,
    data: materialsData,
  } = useTicketMaterials("/ticketing/materials", ticket_id);
  const materials = materialsData || { dispensed: [], recovered: [] };

  const IMAGE = process.env.NEXT_PUBLIC_IMAGES + "/images/";

  // **************************  Generate Report Download *******************************

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      ticket_id: ticket_id,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      setLoading(true);

      // Construct the query string
      const queryParams = new URLSearchParams({
        ticket_id: data.ticket_id,
      });
     //file download domain
      const url = `https://k-task.ckzgroup.com/upload/fpdf/generate/ticket-info.php?${queryParams}`;

      // Send a GET request to the backend
      const response = await axios.get(url, {
        responseType: "blob", // Ensure the response is a Blob
      });

      // Create a Blob URL and trigger for the download
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `${ticket_no}.pdf`); // Set the new file name
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (response.status === 200) {
        // Reset the form after successful submission
        form.reset();

        router.refresh();

        toast({
          title: "Ticket Report Generated!",
          description: "You have successfully generated the ticket report.",
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

  if (BasicLoading)
    return (
      <div>
        {" "}
        <Loading />{" "}
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
      <BackButton />

      <Card>
        <div className="p-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">Ticket Details</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <p>Ticket Status:</p>
                <Badge variant="outline" className="px-4 py-2 uppercase">
                  {ticket_status}
                </Badge>
              </div>

              <div className="flex items-center space-x-2">
                <p>SLA Status:</p>
                <Badge
                  variant="outline"
                  className={`uppercase border-none text-white px-4 py-2
                     ${ticket_state === "within" ? "bg-[#55BA6A]" : ""}
                     ${ticket_state === "scheduled" ? "bg-[#FDAF20]" : ""}
                     ${ticket_state === "breached" ? "bg-[#EE3A4E]" : ""}
                     `}>
                  {ticket_state}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="actions">Ticket Actions Track</TabsTrigger>
                <TabsTrigger value="materials">Materials</TabsTrigger>
              </TabsList>
              <TabsContent value="basic">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-lg">
                      Ticket Basic Information
                    </CardTitle>
                    <CardDescription>
                      View all the details of your ticket below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">Ticket No</h4>
                      <p className="text-base font-bold">
                        {ticket_no || "N/A"}
                      </p>
                    </div>
                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">Ticket Subject</h4>
                      <p className="text-base font-bold">
                        {ticket_subject || "N/A"}
                      </p>
                    </div>
                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">Ticket Description</h4>
                      <p className="text-base font-bold">
                        {ticket_description || "N/A"}
                      </p>
                    </div>
                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">Customer Name</h4>
                      <p className="text-base font-bold">
                        {customer_name || "N/A"}
                      </p>
                    </div>
                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">SLA Time</h4>
                      <p className="text-base font-bold">
                        {`${sla_time_hrs} Hours ${sla_time_min} Mins` || "N/A"}
                      </p>
                    </div>
                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">Ticket Service Type</h4>
                      <p className="text-base font-bold">
                        {service_name || "N/A"}
                      </p>
                    </div>

                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">Site</h4>
                      <p className="text-base font-bold">
                        {site_name || "N/A"}
                      </p>
                    </div>

                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">Ticket Create Time</h4>
                      <p className="text-base font-bold">
                        {formatToFullDateString(ticket_create_time) || "N/A"}
                      </p>
                    </div>

                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base">Ticket Raised Time</h4>
                      <p className="text-base font-bold">
                        {formatToFullDateString(ticket_actual_time) || "N/A"}
                      </p>
                    </div>

                    <hr />
                    <div className="grid grid-cols-2">
                      <h4 className="text-base"> Time Taken </h4>
                      <p className="text-base font-bold">{timeTaken} </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="actions">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-lg">
                      {" "}
                      Tracking Ticket Actions{" "}
                    </CardTitle>
                    <CardDescription>
                      Manage all the actions and updates made on the ticket.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <h2 className="font-mono text-primary text-lg">
                        Assigned Technicians
                      </h2>
                      <Card className="py-4 space-y-4">
                        {assigned_users.length > 0 ? (
                          <div>
                            {assigned_users.map((user) => (
                              <div key={user.user_id}>
                                <div className="grid grid-cols-2 text-base items-center px-4">
                                  <h4 className="font-medium">
                                    {`${user.user_firstname} ${user.user_lastname}`}
                                  </h4>
                                  <div className="text-muted-foreground">
                                    <p>
                                      {formatToFullDateString(
                                        user.ticket_assign_time,
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <hr className="mt-2" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-muted-foreground">
                            No Assigned Technicians
                          </div>
                        )}
                      </Card>
                    </div>
                    <div className="space-y-4">
                      <h2 className="font-mono text-primary text-lg">
                        Ticket State
                      </h2>
                      <Card className="py-4 space-y-4">
                        <div className="px-4 space-y-2">
                          <h3 className="font-bold text-base">
                            1. Acknowledge Time
                          </h3>
                          <Card className="py-2 px-4 rounded-sm space-y-2">
                            <div className="text-base items-center space-x-4">
                              <h4 className="mb-2">Acknowledged at</h4>
                              {assigned_users.length > 0 ? (
                                <div>
                                  {assigned_users.map((user) => (
                                    <div
                                      className="text-muted-foreground mb-2"
                                      key={user.ticket_id}>
                                      <div className="italic font-semibold text-foreground">
                                        {user.user_firstname}{" "}
                                        {user.user_lastname}
                                      </div>
                                      <div>
                                        {user.tickect_acknoledge_date ? (
                                          <p>
                                            {formatToFullDateString(
                                              user.tickect_acknoledge_date,
                                            )}
                                          </p>
                                        ) : (
                                          <p className="italic text-orange-500">
                                            {" "}
                                            Waiting Acknowledgement{" "}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-4 text-muted-foreground">
                                  No Assigned Technicians
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>
                        <hr />
                        <div className="px-4 space-y-2">
                          <h3 className="font-bold text-base">
                            2. Complete Time
                          </h3>
                          <Card className="py-2 px-4 rounded-sm space-y-2">
                            <div className="text-base">
                              <p>Closed by:</p>
                            </div>
                            {agents.length > 0 ? (
                              <div>
                                {agents.map((item) => (
                                  <div
                                    className="text-muted-foreground text-base"
                                    key={item.ticket_id}>
                                    <span className="font-semibold text-foreground">{`${item.user_firstname + " " + item.user_lastname}`}</span>{" "}
                                    at {item.date_closed}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-muted-foreground">
                                No Data
                              </div>
                            )}
                          </Card>
                        </div>
                        <hr />
                        <div className="px-4 space-y-2">
                          <h3 className="font-bold text-base">3. Close Time</h3>
                          <Card className="py-2 px-4 rounded-sm space-y-2">
                            <div className="text-base">
                              <p> Closed by:</p>
                            </div>
                            {noc.length > 0 ? (
                              <div>
                                {noc.map((item) => (
                                  <div
                                    className="text-muted-foreground text-base"
                                    key={item.ticket_id}>
                                    <span className="font-semibold text-foreground">{`${item.user_firstname + " " + item.user_lastname}`}</span>{" "}
                                    at{" "}
                                    {formatToFullDateString(
                                      item.noc_close_time,
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 text-muted-foreground">
                                No Data
                              </div>
                            )}
                          </Card>
                        </div>
                        <hr />
                        <div className="px-4 space-y-2">
                          <h3 className="font-bold text-base">
                            4. Ticket Hold
                          </h3>
                          <Card className="py-2 px-4 rounded-sm space-y-2">
                            <div className="text-base">
                              <p>Hold by:</p>
                              {hold.length > 0 ? (
                                <div>
                                  {hold.map((item) => (
                                    <div
                                      className="text-muted-foreground text-base"
                                      key={item.ticket_hold_id}>
                                      <p className="font-semibold text-foreground">{`${item.hold_by}`}</p>{" "}
                                      at {item.ticket_hold_time}
                                      <div>
                                        <p className="font-semibold text-foreground">
                                          Released on:{" "}
                                          <span className="font-normal text-muted-foreground">
                                            {item.ticket_release_time}
                                          </span>
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-4 text-muted-foreground">
                                  No Data
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>
                        <hr />
                        <div className="px-4 space-y-2">
                          <h3 className="font-bold text-base">
                            5. Reopen Time
                          </h3>
                          <Card className="py-2 px-4 rounded-sm space-y-2">
                            <div className="text-base">
                              <p>No Results</p>
                            </div>
                          </Card>
                        </div>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="materials">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-bold text-lg">
                      Ticket Materials
                    </CardTitle>
                    <CardDescription>
                      View all materials dispensed and recovered for this ticket.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="font-mono text-primary text-lg">
                        Dispensed Materials
                      </h2>
                      <Card className="py-4 space-y-4">
                        {materials.dispensed && materials.dispensed.length > 0 ? (
                          <div>
                            {materials.dispensed.map((item: any) => (
                              <div key={item.dispense_material_id}>
                                <div className="grid grid-cols-2 text-base items-center px-4">
                                  <h4 className="font-medium">
                                    {item.item_name}
                                  </h4>
                                  <div className="text-muted-foreground">
                                    <p>Qty: {item.dispensed_quantity}</p>
                                  </div>
                                </div>
                                <div className="px-4 text-sm text-muted-foreground">
                                  <p>Stock ID: {item.stock_id}</p>
                                  <p>Dispensed Date: {item.dispense_date}</p>
                                </div>
                                <hr className="mt-2" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-muted-foreground">
                            No Dispensed Materials
                          </div>
                        )}
                      </Card>
                    </div>
                    <div className="space-y-4">
                      <h2 className="font-mono text-primary text-lg">
                        Recovered Materials
                      </h2>
                      <Card className="py-4 space-y-4">
                        {materials.recovered && materials.recovered.length > 0 ? (
                          <div>
                            {materials.recovered.map((item: any) => (
                              <div key={item.dispense_material_id}>
                                <div className="grid grid-cols-2 text-base items-center px-4">
                                  <h4 className="font-medium">
                                    {item.item_name}
                                  </h4>
                                  <div className="text-muted-foreground">
                                    <p>Qty: {item.dispensed_quantity}</p>
                                  </div>
                                </div>
                                <div className="px-4 text-sm text-muted-foreground">
                                  <p>Stock ID: {item.stock_id}</p>
                                  <p>Recovered Date: {item.dispense_date}</p>
                                </div>
                                <hr className="mt-2" />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-muted-foreground">
                            No Recovered Materials
                          </div>
                        )}
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="flex space-x-6 items-center pt-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                <div className="">
                  <Button type="submit" className="space-x-2">
                    <span> Generate Ticket Report </span>
                  </Button>
                </div>
              </form>
            </Form>

            <Link
              className={cn(
                buttonVariants,
                "bg-primary text-white px-4 rounded-md py-2",
              )}
              href={`/service/cases/${ticket_id}/map`}>
              View Map
            </Link>
          </div>

          {updates.length > 0 && (
            <div className="flex space-x-6 items-center">
            
              <a
                href={`https://k-task.ckzgroup.com/upload/fpdf/generate/kmz-kml/ticket-kmz.php?ticket_id=${ticket_id}`}
                download
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Download KMZ
              </a>
              <a
                href={`https://k-task.ckzgroup.com/upload/fpdf/generate/kmz-kml/ticket-kml.php?ticket_id=${ticket_id}`}
                download
                target="_blank"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Download KML
              </a>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="space-y-4 p-8">
          <h3 className="text-xl font-bold">Ticket Update</h3>
          <ScrollArea className="h-[100vh] w-full">
            <div className="space-y-2">
              {updates.map((update, index) => (
                <div key={index}>
                  <ActivityCard
                    timeline={update.ticket_update_time}
                    title={update.service_category_name}
                    description={`${update.ticket_action_description} at ${update.activity_location}`}
                    technician={`${update.user_firstname} ${update.user_lastname}`}
                  />

                  <Dialog>
                    {update.ticket_service_image && (
                      <div className="relative">
                        <DialogTrigger asChild>
                          <img
                            src={`
                                            ${IMAGE}${update.ticket_service_image}
                                        `}
                            alt="img"
                            className="h-24 w-32 object-cover hover:cursor-pointer"
                          />
                        </DialogTrigger>
                      </div>
                    )}

                    <DialogContent className="sm:max-w-[425px]">
                      <img
                        src={`
                                            ${IMAGE}${update.ticket_service_image}
                                        `}
                        alt="img"
                        className="h-full w-fit object-cover"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}

export default SingleTicketPage;
