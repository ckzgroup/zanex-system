"use client";

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {useTheme} from "next-themes";


import { Sun, Moon, Sliders } from "@phosphor-icons/react"

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
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import useAuthStore from "@/hooks/use-user";

const themeFormSchema = z.object({
    type: z.enum(["light", "dark", "system"], {
        required_error: "You need to select a theme.",
    })
})

type ThemeFormValues = z.infer<typeof themeFormSchema>



export function ThemeSettingsForm() {

    const { setTheme: nextTheme } = useTheme();
    const { theme, setTheme } = useAuthStore();

    const form = useForm<ThemeFormValues>({
        resolver: zodResolver(themeFormSchema),     // @ts-ignore
        defaultValues: { type: theme }
    })

    function onSubmit(data: ThemeFormValues) {
        nextTheme(data.type); // Set theme using next-themes
        setTheme(data.type); // Update the theme in useAuthStore
        toast({
            title: "Theme options updated!",
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
                                    <FormItem className={`flex flex-row items-center justify-between rounded-lg border p-5 ${field.value === "light" ? 'border-[#6B37DF]' : ''}`}>
                                        <div className='flex space-x-4 items-center'>
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${field.value === "light" ? 'bg-[#6B37DF] text-white' : ''}`}>
                                                <Sun weight="duotone" className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-semibold text-primary">
                                                    Light Mode
                                                </FormLabel>
                                                <FormDescription>
                                                    Pick a clean and classic light theme.
                                                </FormDescription>
                                            </div>
                                        </div>
                                        <FormControl onClick={() => setTheme("light")}>
                                            <RadioGroupItem value="light" className={`h-5 w-5 font-bold ${field.value === "light" ? 'text-[#6B37DF] border-[#6B37DF]' : ''}`} />
                                        </FormControl>
                                    </FormItem>

                                    <FormItem className={`flex flex-row items-center justify-between rounded-lg border p-5 ${field.value === "dark" ? 'border-[#6B37DF]' : ''}`}>
                                        <div className='flex space-x-4 items-center'>
                                            <div className={`h-10 w-10 rounded-full ${field.value === "dark" ? 'bg-[#6B37DF] text-white' : ''} flex items-center justify-center`}>
                                                <Moon weight="duotone" className="h-5 w-5" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-semibold">
                                                    Dark Mode
                                                </FormLabel>
                                                <FormDescription>
                                                    Select a sleek and modern dark theme.
                                                </FormDescription>
                                            </div>
                                        </div>
                                        <FormControl onClick={() => setTheme("dark")}>
                                            <RadioGroupItem value="dark" className={`h-5 w-5 font-bold ${field.value === "dark" ? 'text-[#6B37DF] border-[#6B37DF]' : ''}`} />
                                        </FormControl>
                                    </FormItem>

                                    <FormItem
                                        className={`flex flex-row items-center justify-between rounded-lg border p-5 ${field.value === "system" ? 'border-[#6B37DF]' : ''}`}>
                                        <div className='flex space-x-4 items-center'>
                                            <div className={`h-10 w-10 rounded-full ${field.value === "system" ? 'bg-[#6B37DF] text-white' : ''} flex items-center justify-center`}>
                                                <Sliders weight="duotone" className="h-5 w-5"/>
                                            </div>
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base font-semibold">
                                                System
                                                </FormLabel>
                                                <FormDescription>
                                                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                                                    Adapts to your device's theme.
                                                </FormDescription>
                                            </div>
                                        </div>
                                        <FormControl onClick={() => setTheme("system")}>
                                            <RadioGroupItem value="system" className={`h-5 w-5 font-bold ${field.value === "system" ? 'text-[#6B37DF] border-[#6B37DF]' : ''}`} />
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
