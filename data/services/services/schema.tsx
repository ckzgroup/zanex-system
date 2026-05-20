import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const servicesSchema = z.object({
    name: z.string(),
    priority: z.string(),
    status: z.string(),
})

export type Service = z.infer<typeof servicesSchema>