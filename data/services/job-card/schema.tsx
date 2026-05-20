import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const jobCardSchema = z.object({
    service_category_type_id: z.string().nonempty(),
    service_category_name: z.string().nonempty(),
    service_category_status: z.string().nonempty(),
    data_type_entry: z.string().nonempty(),
    photo_required: z.boolean(),
})

export type JobCard = z.infer<typeof jobCardSchema>



export const editJobCardSchema = z.object({
    service_category_type_id: z.string().nonempty(),
    service_category_name: z.string().nonempty(),
    data_type_entry: z.any(),
    photo_required: z.boolean(),
    service_category_id: z.coerce.number()

})