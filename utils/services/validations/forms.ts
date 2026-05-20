import * as z from "zod"

// Segment Service Schema
export const segmentServiceSchema = z.object({
    service: z.string(),
    length: z.string().nonempty(),
    start_date: z.date(),
    end_date: z.date(),
    charge_rate: z.string().nonempty(),
})

// Segment Material Schema
export const segmentMaterialSchema = z.object({
    name: z.string(),
    quantity: z.string().nonempty(),
    change_request: z.string().nonempty(),
    cost_rate: z.string().nonempty(),
})


// Client Schema
export const clientSchema = z.object({
    name: z.string(),
    email: z.string().nonempty(),
    phone: z.string().nonempty(),
    image: z.string().nonempty(),
})

// Services Schema
export const  editServiceSchema = z.object({
    service_name: z.string().nonempty(),
    service_type_priority_id: z.string().nonempty(),
    service_type_id: z.string().nonempty(),
})

// Services Schema
export const serviceSchema = z.object({
    service_name: z.string().nonempty(),
    service_type_priority_id: z.string().nonempty(),
    service_type_status: z.string().nonempty(),
    service_type_branch_id: z.string().nonempty(),
})

// Project Services Schema
export const projectServiceSchema = z.object({
    service_name: z.string().nonempty(),
    company_id: z.string(),
    service_description: z.string().nonempty(),
    create_date: z.any(),
})

// Region Schema
export const regionSchema = z.object({
    name: z.string(),
    description: z.string().nonempty(),
})

// Client Schema
const escalationSchema = z.object({
    escalation_hrs: z.string().nonempty("Escalation hours are required"),
    escalation_min: z.string().nonempty("Escalation minutes are required"),
    escalation_contact_person: z.string().nonempty("Contact person is required"),
    escalation_create_by: z.string() ,
    escalation_branch_id: z.string(),
    escalation_message: z.string().optional()
});

export const slaSchema = z.object({
    sla_time_hrs: z.string().nonempty("SLA hours are required"),
    sla_time_min: z.string().nonempty("SLA minutes are required"),
    sla_customer_id: z.number().int().positive(),
    sla_description: z.string().optional(),
    sla_name: z.string().optional(),
    sla_branch_id: z.string().nonempty(),
    service_type_id: z.string().nonempty("Service type ID is required"),
    module: z.array(escalationSchema)
});

export const editSlaSchema = z.object({
    sla_time_hrs: z.string().nonempty("SLA hours are required"),
    sla_time_min: z.string().nonempty("SLA minutes are required"),
    sla_customer_id: z.number().int().positive(),
    sla_id: z.number().int().positive(),
    sla_description: z.string().optional(),
    sla_name: z.string().optional(),
    service_type_id: z.string().nonempty("Service type ID is required"),
});

// Site Schema
export const siteSchema = z.object({
    site_name: z.string().nonempty(),
    site_company_id: z.string(),
    site_latitude: z.string().nonempty(),
    site_longtitude: z.string().nonempty(),
    site_customer_id: z.coerce.number(),
    site_description: z.string().nonempty(),
    site_region_id: z.string().nonempty(),
    site_created_by: z.string().nonempty(),
})

// Site Schema
export const ticketSchema = z.object({
    ticket_description: z.string().nonempty('Description is required'),
    ticket_no: z.string().nonempty('Ticket number is required'),
    ticket_actual_time: z.date(),
    ticket_customer_id: z.string().nonempty(),
    ticket_sla_id: z.string().nonempty(),
    ticket_subject: z.string().nonempty('Subject is required'),
    ticket_site_id: z.string().nonempty(),
    ticket_created_by: z.string(),
    ticket_case_no: z.string().nonempty('Case number is required'),
    ticket_service_type_id: z.string().nonempty(),
    ticketAssign: z.array(z.string()).nonempty('At least one agent assignment is required'),
});


// User Schema
export const userSchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().nonempty(),
    contact: z.string().nonempty(),
    role: z.string().nonempty(),
    image: z.string().nonempty(),
})

// Projects Schema
export const projectSchema = z.object({
    name: z.string().nonempty(),
    code: z.string().nonempty(),
    client: z.string().nonempty(),
    manager: z.string().nonempty(),
    start_date: z.date(),
    end_date: z.date(),
    segments: z.string().nonempty(),
    po_file: z.string().nonempty(),
    ehs_file: z.string().nonempty(),
    permit_file: z.string().nonempty(),
    survey_file: z.string().nonempty(),
    certificate: z.string().nonempty(),
    description: z.string().nonempty(),
    file_name: z.string().optional(),
    file_attach: z.string().optional(),
})


// Profile Schema
export const passwordSchema = z.object({
    old_password: z.string().min(2),
    new_password: z.string().min(2),
    confirm_new_password: z.string().min(2),
}).refine((data) => data.new_password === data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"], // path of error
});
