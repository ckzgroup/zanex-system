import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const usersSchema = z.object({
    full_name: z.string(),
    branch: z.string(),
    email: z.string(),
    contact: z.string(),
    role: z.string(),
})

export type User = z.infer<typeof usersSchema>