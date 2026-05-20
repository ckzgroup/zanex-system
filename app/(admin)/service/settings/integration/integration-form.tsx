"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import {ChatCenteredText, Sun} from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const integrationFormSchema = z.object({
    office: z.boolean().default(false).optional(),
    zoom: z.boolean().default(false).optional(),
    slack: z.boolean().default(false).optional(),
    trello: z.boolean().default(false).optional(),
})

type IntegrationFormValues = z.infer<typeof integrationFormSchema>

// This can come from your database or API.
const defaultValues: Partial<IntegrationFormValues> = {
  office: true,
    zoom: true,
    slack: false,
    trello: true,
}

export function IntegrationForm() {
  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues,
  })

  function onSubmit(data: IntegrationFormValues) {
      toast({
          title: "Integration settings updated!",
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="office"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className='flex space-x-4 items-center'>
                        <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                            <Image src='/images/logos/office-365.svg' alt='logo' height={24} width={24} style={{ objectFit: "cover" }} />

                        </div>
                        <div className="space-y-0.5">
                            <FormLabel className="text-base font-semibold text-primary">
                                Microsoft Office 365
                            </FormLabel>
                            <FormDescription className='text-sm'>
                                Seamless collaboration and document management.
                            </FormDescription>
                        </div>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
              )}
            />

              <FormField
                  control={form.control}
                  name="zoom"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className='flex space-x-4 items-center'>
                              <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                                  <Image src='/images/logos/zoom.svg' alt='logo' height={24} width={24} style={{ objectFit: "cover" }} />
                              </div>
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold text-primary">
                                      Zoom
                                  </FormLabel>
                                  <FormDescription  className='text-sm'>
                                      For conducting virtual meetings and interviews.
                                  </FormDescription>
                              </div>
                          </div>
                          <FormControl>
                              <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                          </FormControl>
                      </FormItem>
                  )}
              />


              <FormField
                  control={form.control}
                  name="slack"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className='flex space-x-4 items-center'>
                              <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                                  <Image src='/images/logos/slack.svg' alt='logo' height={20} width={20} style={{ objectFit: "cover" }} />
                              </div>
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold text-primary">
                                      Slack
                                  </FormLabel>
                                  <FormDescription  className='text-sm'>
                                      For team communication and real-time collaboration.
                                  </FormDescription>
                              </div>
                          </div>
                          <FormControl>
                              <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                          </FormControl>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="trello"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className='flex space-x-4 items-center'>
                              <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                                  <Image src='/images/logos/trello.svg' alt='logo' height={20} width={20} style={{ objectFit: "cover" }} />

                              </div>
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold text-primary">
                                      Trello
                                  </FormLabel>
                                  <FormDescription  className='text-sm'>
                                      For task management and project collaboration.
                                  </FormDescription>
                              </div>
                          </div>
                          <FormControl>
                              <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                          </FormControl>
                      </FormItem>
                  )}
              />

          </div>
        </div>

          <div className="pt-4">
              <Link href='/settings/integration/suggestion'>
                  <Button size="lg" variant="outline" className='w-full text-base border border-muted-foreground font-semibold py-4'>Add Integration</Button>
              </Link>
          </div>
      </form>
    </Form>
  )
}
