"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

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
import { ShootingStar } from "@phosphor-icons/react";
import Image from "next/image";
import React from "react";

const upcomingFormSchema = z.object({

  jira: z.boolean().default(false).optional(),
  asana: z.boolean().default(false).optional(),
  atlassian: z.boolean().default(false).optional(),
  evernote: z.boolean().default(false).optional(),
})

type UpcomingFormValues = z.infer<typeof upcomingFormSchema>

// This can come from your database or API.
const defaultValues: Partial<UpcomingFormValues> = {
    jira: false,
    asana: false,
    atlassian: false,
    evernote: false,
}

export function UpcomingIntegrationForm() {
  const form = useForm<UpcomingFormValues>({
    resolver: zodResolver(upcomingFormSchema),
    defaultValues,
  })

  function onSubmit(data: UpcomingFormValues) {
      toast({
          title: "Upcoming Integration settings updated!",
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="jira"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className='flex space-x-4 items-center'>
                        <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                            <Image src='/images/logos/jira.svg' alt='logo' height={24} width={24} style={{ objectFit: "cover" }} />

                        </div>
                        <div className="space-y-0.5">
                            <FormLabel className="text-base font-semibold text-primary">
                                Jira
                            </FormLabel>
                            <FormDescription className='text-sm'>
                                For agile project management and issue tracking.
                            </FormDescription>
                        </div>
                    </div>
                    <FormControl>
                        <Switch disabled={true}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
              )}
            />

              <FormField
                  control={form.control}
                  name="asana"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className='flex space-x-4 items-center'>
                              <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                                  <Image src='/images/logos/asana.svg' alt='logo' height={24} width={24} style={{ objectFit: "cover" }} />
                              </div>
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold text-primary">
                                      Asana
                                  </FormLabel>
                                  <FormDescription  className='text-sm'>
                                      For project management and task tracking.
                                  </FormDescription>
                              </div>
                          </div>
                          <FormControl>
                              <Switch disabled={true}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                          </FormControl>
                      </FormItem>
                  )}
              />


              <FormField
                  control={form.control}
                  name="atlassian"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className='flex space-x-4 items-center'>
                              <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                                  <Image src='/images/logos/atlassian.svg' alt='logo' height={20} width={20} style={{ objectFit: "cover" }} />
                              </div>
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold text-primary">
                                      Atlassian
                                  </FormLabel>
                                  <FormDescription  className='text-sm'>
                                      Helps teams organize, discuss, and complete shared work.
                                  </FormDescription>
                              </div>
                          </div>
                          <FormControl>
                              <Switch disabled={true}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                          </FormControl>
                      </FormItem>
                  )}
              />

              <FormField
                  control={form.control}
                  name="evernote"
                  render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className='flex space-x-4 items-center'>
                              <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center border border-muted-foreground/30`}>
                                  <Image src='/images/logos/evernote.svg' alt='logo' height={20} width={20} style={{ objectFit: "cover" }} />

                              </div>
                              <div className="space-y-0.5">
                                  <FormLabel className="text-base font-semibold text-primary">
                                      Evernote
                                  </FormLabel>
                                  <FormDescription  className='text-sm'>
                                      For note-taking and knowledge management.
                                  </FormDescription>
                              </div>
                          </div>
                          <FormControl>
                              <Switch disabled={true}
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                              />
                          </FormControl>
                      </FormItem>
                  )}
              />

          </div>
        </div>

          <div className="pt-4 flex items-center space-x-2">
              <ShootingStar weight="duotone" className='h-6 w-6'/>
              <h5 className='text-base font-semibold'>
                  These integrations are on their way and will be added soon.
              </h5>
          </div>
      </form>
    </Form>
  )
}
