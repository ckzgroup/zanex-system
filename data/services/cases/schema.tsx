import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const caseSchema = z.object({
    case_no: z.string(),
    subject: z.string(),
    service: z.string(),
    client: z.string(),
    technician: z.string(),
    sla_time: z.string(),
    sla_status: z.string(),
    create_time: z.string(),
    actual_time: z.string(),
    up_time: z.string(),
    close_time: z.string(),
    mttr: z.string(),
    status: z.string(),
})

export type Case = z.infer<typeof caseSchema>