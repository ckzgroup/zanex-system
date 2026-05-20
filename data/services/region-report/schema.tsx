import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const regionReportSchema = z.object({
    region_name: z.string(),
    customer_name: z.string(),
    ticket_date: z.string().optional(),
    service_name: z.string().optional(),
    breached_tickets: z.coerce.number(),
    complied_sla: z.coerce.number(),
    total_tickets: z.coerce.number(),
    mttr: z.string(),
    adherence: z.string(),
})

export type regionsReportSchema = z.infer<typeof regionReportSchema>