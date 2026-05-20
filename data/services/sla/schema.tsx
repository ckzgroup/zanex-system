import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const slaSchema = z.object({
    name: z.string(),
    customer: z.string(),
    service: z.string(),
    time: z.string(),
    description: z.string(),
    status: z.string(),
})

export type SLA = z.infer<typeof slaSchema>