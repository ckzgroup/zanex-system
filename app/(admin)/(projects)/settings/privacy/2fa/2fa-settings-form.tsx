"use client";

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { ChatCenteredText, EnvelopeSimple, LockKey} from "@phosphor-icons/react"

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

const faFormSchema = z.object({
    type: z.enum(["sms", "email", "app"], {
        required_error: "You need to select a Two-Factor Authentication option.",
    })
})

type FaFormValues = z.infer<typeof faFormSchema>



export function FaSettingsForm() {
    const form = useForm<FaFormValues>({
        resolver: zodResolver(faFormSchema),
    })

    function onSubmit(data: FaFormValues) {
        toast({
            title: "Two-Factor Authentication option updated!",
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup //@ts-ignore
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className={`flex flex-row items-center justify-between rounded-lg border p-5 ${field.value === "sms" ? 'border-[#6B37DF]' : ''}`}>
                                        <div className='flex space-x-4 items-center'>
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${field.value === "sms" ? 'bg-[#6B37DF] text-white' : ''}`}>
                                                <ChatCenteredText weight="duotone" className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <FormLabel className={`text-base font-semibold ${field.value === "sms" ? 'text-[#6B37DF]' : ''}`}>
                                                    SMS Code
                                                </FormLabel>
                                                <FormDescription>
                                                    Receive a one-time verification code via SMS to enter during login.
                                                </FormDescription>
                                            </div>
                                        </div>
                                        <FormControl>
                                            <RadioGroupItem value="sms" className={`h-5 w-5 font-bold ${field.value === "sms" ? 'text-[#6B37DF] border-[#6B37DF]' : ''}`} />
                                        </FormControl>
                                    </FormItem>

                                    <FormItem className={`flex flex-row items-center justify-between rounded-lg border p-5 ${field.value === "email" ? 'border-[#6B37DF]' : ''}`}>
                                        <div className='flex space-x-4 items-center'>
                                            <div className={`h-10 w-10 rounded-full ${field.value === "email" ? 'bg-[#6B37DF] text-white' : ''} flex items-center justify-center`}>
                                                <EnvelopeSimple weight="duotone" className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <FormLabel className={`text-base font-semibold ${field.value === "email" ? 'text-[#6B37DF]' : ''}`}>
                                                    Email Code
                                                </FormLabel>
                                                <FormDescription>
                                                    Get a temporary verification code sent to your email for added security.
                                                </FormDescription>
                                            </div>
                                        </div>
                                        <FormControl>
                                            <RadioGroupItem value="email" className={`h-5 w-5 font-bold ${field.value === "email" ? 'text-[#6B37DF] border-[#6B37DF]' : ''}`} />
                                        </FormControl>
                                    </FormItem>

                                    <FormItem
                                        className={`flex flex-row items-center justify-between rounded-lg border p-5 ${field.value === "app" ? 'border-[#6B37DF]' : ''}`}>
                                        <div className='flex space-x-4 items-center'>
                                            <div className={`h-10 w-10 rounded-full ${field.value === "app" ? 'bg-[#6B37DF] text-white' : ''} flex items-center justify-center`}>
                                                <LockKey weight="duotone" className="h-5 w-5"/>
                                            </div>
                                            <div className="space-y-0.5">
                                                <FormLabel className={`text-base font-semibold ${field.value === "app" ? 'text-[#6B37DF]' : ''}`}>
                                                    Authenticator App
                                                </FormLabel>
                                                <FormDescription>
                                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                                    Use an authenticator app to generate time-based verification codes for login.
                                                </FormDescription>
                                            </div>
                                        </div>
                                        <FormControl>
                                            <RadioGroupItem value="app" className={`h-5 w-5 font-bold ${field.value === "app" ? 'text-[#6B37DF] border-[#6B37DF]' : ''}`} />
                                        </FormControl>

                                    </FormItem>

                                </RadioGroup>
                            </FormControl>
                            <FormMessage/>
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
