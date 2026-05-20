import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const siteSchema = z.object({
    name: z.string(),
    region: z.string(),
    customer: z.string(),
    latitude: z.string(),
    longitude: z.string(),
})

export type Site = z.infer<typeof siteSchema>