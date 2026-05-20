import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const escalationSchema = z.object({
    customer: z.string(),
    service: z.string(),
    sla_time: z.string(),
    escalation_time: z.string(),
    contact: z.string(),
    message: z.string(),
})

export type Escalation = z.infer<typeof escalationSchema>