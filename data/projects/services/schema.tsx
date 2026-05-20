import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const servicesSchema = z.object({
    service_name: z.string(),
    service_type_status: z.string(),
    priority_level: z.string(),
})

export type Service = z.infer<typeof servicesSchema>