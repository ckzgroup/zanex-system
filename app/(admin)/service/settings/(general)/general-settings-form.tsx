"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import TimezoneSelect, { type ITimezone } from 'react-timezone-select'

import { cn } from "@/lib/utils"
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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {useState} from "react";

const profileFormSchema = z.object({
  language: z.string({
      required_error: "Please select language to display.",
  }),
    timezone: z.string({
        required_error: "Please select timezone to display.",
    }),
    time_format: z.string({
        required_error: "Please select time format to display.",
    }),
    date_format: z.string({
        required_error: "Please select date format to display.",
    }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>


export function GeneralSettingsForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
  })

    const [timezone, setTimezone] = useState(
        Intl.DateTimeFormat().resolvedOptions().timeZone
    )


  function onSubmit(data: ProfileFormValues) {
      toast({
          title: "Profile successfully updated!",
      })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-semibold'>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="English (UK)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem defaultValue="English (UK)" value="English (UK)" >English (UK)</SelectItem>
                  <SelectItem value="English (US)">English (US)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />


          <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel className='font-semibold'>Timezone</FormLabel>
                      <TimezoneSelect
                          value={timezone}
                          onChange={() => setTimezone}
                          className="bg-red-500"
                      />
                      <FormMessage />
                  </FormItem>
              )}
          />


          <FormField
              control={form.control}
              name="time_format"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel className='font-semibold'>Time Format <span className='text-sm text-muted-foreground font-medium'>(Optional)</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="24 Hour" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              <SelectItem defaultValue="24 Hour" value="24 Hour" >24 Hour</SelectItem>
                              <SelectItem value="12 Hour">12 Hour</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
              )}
          />

          <FormField
              control={form.control}
              name="date_format"
              render={({ field }) => (
                  <FormItem>
                      <FormLabel className='font-semibold'>Date Format <span className='text-sm text-muted-foreground font-medium'>(Optional)</span></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="DD/MM/YY" />
                              </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                              <SelectItem defaultValue="DD/MM/YY" value="DD/MM/YY" > DD/MM/YY </SelectItem>
                              <SelectItem value="MM-DD-YY">MM-DD-YY</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                  </FormItem>
              )}
          />

        <div className="flex items-center space-x-4 pt-4">
            <Button type="reset" size="lg" variant="outline">Cancel</Button>
            <Button type="submit" size="lg">Save Changes</Button>
        </div>
      </form>
    </Form>
  )
}
