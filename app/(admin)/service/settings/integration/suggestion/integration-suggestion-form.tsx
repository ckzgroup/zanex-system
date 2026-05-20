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
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import {Textarea} from "@/components/ui/textarea";
import { Info } from "@phosphor-icons/react";
import React from "react";


const suggestionFormSchema = z.object({
    name: z.string().min(2),
    website: z.string().min(2).optional(),
    reason: z.string().max(255),


})

type SuggestionFormValues = z.infer<typeof suggestionFormSchema>

// This can come from your database or API.
const defaultValues: Partial<SuggestionFormValues> = {
  // name: "Your name",
  // dob: new Date("2023-01-23"),
}

export function IntegrationSuggestionForm() {
  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionFormSchema),
    defaultValues,
  })

  function onSubmit(data: SuggestionFormValues) {
      toast({
          title: "Integration suggestion sent!",
      })
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>Integration Name</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Enter integration name..." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="website"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>Website Link <span
                            className='text-muted-foreground font-medium'>(Optional)</span></FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="www.example.com" {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="reason"
                render={({field}) => (
                    <FormItem>
                        <FormLabel className='font-semibold'>Reason for Recommendation</FormLabel>
                        <FormControl>
                            <Textarea rows={4} placeholder="Explain why you recommend this integration..." {...field} />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />

            <div className="flex items-center space-x-2">
                <Info weight="duotone" className='h-5 w-5'/>
                <h5 className='font-semibold italic'>
                    We may not be able to fulfill every integration request.
                </h5>
            </div>

            <div className="flex items-center space-x-4 pt-4">
                <Button type="reset" size="lg" variant="outline">Discard</Button>
                <Button type="submit" size="lg">Send Suggestion</Button>
            </div>
        </form>
    </Form>
  )
}
