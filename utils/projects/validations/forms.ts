import * as z from "zod"

// Segment Service Schema
export const segmentServiceSchema = z.array(z.object({
    service_id: z.string(),
    service_quantity: z.coerce.number(),
    service_rate: z.coerce.number(),
    service_start_date: z.date(),
    service_end_date: z.date(),
    service_segment_id: z.coerce.number(),
    service_user_id: z.string().nonempty(),
    service_status: z.string().nonempty(),
}))


// Segment Service Schema
export const segmentClosureSchema = z.array(z.object({
    project_closure_parameter_id: z.string(),
    segment_id: z.any(),
    create_date: z.any(),
    user_id: z.string(),
}))



// Segment Material Schema
export const segmentMaterialSchema = z.array(z.object({
    segment_id: z.number(),
    material_id: z.string().nonempty(),
    material_quantity: z.coerce.number(),
    user_id: z.string(),
    unit_cost: z.coerce.number().optional(),
    material_status: z.string().nonempty(),
}));


// Client Schema
export const clientSchema = z.object({
    customer_profile: z.any().nullable().optional(),
    customer_name: z.string().nonempty(),
    customer_email: z.string().nonempty(),
    customer_contact: z.string().nonempty(),
    customer_company_id: z.string().optional().nullable(),
    customer_created_by: z.string().optional().nullable(),
});

// Client Schema
export const clientEditSchema = z.object({
    customer_name: z.string().nonempty(),
    customer_email: z.string().nonempty(),
    customer_contact: z.string().nonempty(),
    customer_id: z.coerce.number(),
});

// Services Schema
export const serviceSchema = z.object({
    name: z.string(),
    description: z.string().nonempty(),
})

// Region Schema
export const regionSchema = z.object({
    region_name: z.string().nonempty(),
    region_description: z.string().nonempty(),
    region_company_id: z.string()
})

export const editRegionSchema = z.object({
    region_name: z.string().nonempty(),
    region_description: z.string().nonempty(),
    region_id: z.coerce.number()
})

// User Schema
export const userSchema = z.object({
    user_firstname: z.string(),
    user_lastname: z.string(),
    user_email_address: z.string().nonempty(),
    user_driver_license: z.string().nonempty(),
    user_country_code: z.string().nonempty(),
    user_contact: z.string().nonempty(),
    user_company_id: z.string(),
    role_id: z.any(),
})

// Edit User Schema
export const userEditSchema = z.object({
    first_name: z.string().nonempty(),
    last_name: z.string().nonempty(),
    user_email: z.string().nonempty(),
    user_id: z.coerce.number(),
    user_contact: z.string().nonempty(),
    user_country_code: z.string().nonempty(),
});

// Projects Schema
export const projectSchema = z.object({
    project_name: z.string().nonempty(),
    project_code: z.string().nonempty(),
    company_id: z.string().nonempty(),
    customer_id: z.string().nonempty(),
    manager_id: z.string().nonempty(),
    start_date: z.date(),
    end_date: z.date(),
    segment_number: z.string().nonempty(),
    region_id: z.string().nonempty(),
    user_id: z.string().nonempty(),
    project_status: z.string().nonempty(),
    project_description: z.string().nonempty(),
    project_po_file: z.any().optional(),
    project_ehs_file: z.any().optional(),
    project_permit: z.any().optional(),
    project_design: z.any().optional(),
    project_certificate_of_workers: z.any().optional(),
});

//Projects Schema
export const projectEditSchema = z.object({
    project_name: z.string().optional(),
    project_code: z.string().optional(),
    company_id: z.string().optional(),
    project_id: z.coerce.number(),
    customer_id: z.coerce.number().optional(),
    manager_id: z.coerce.number().optional(),
    start_date: z.date(),
    end_date: z.date(),
    segment_number: z.coerce.number().optional(),
    region_id: z.coerce.number().optional(),
    user_id: z.string().optional(),
    project_status: z.string().optional(),
    project_description: z.string().optional(),
    project_po_file: z.any(),
    project_ehs_file: z.any(),
    project_permit: z.any(),
    project_design: z.any(),
    project_certificate_of_workers: z.any(),
})

// Segment Schema
export const segmentSchema = z.object({
    segment_name: z.string().nonempty(),
    segment_code: z.string().nonempty(),
    project_id: z.number(),
    start_point: z.string().nonempty(),
    end_point: z.string().nonempty(),
    est_distance: z.coerce.number(),
    site: z.coerce.number(),
    overlap: z.coerce.number(),
    user_id: z.string(),
    comment: z.string().nonempty(),
    sub_contractor: z.string().nonempty(),
    segment_status: z.string().nonempty(),
    start_date: z.date(),
    end_date: z.date(),
    material_name: z.string().optional(),
    material_quantity: z.string().optional(),
})

// Segment Schema
export const editSegmentSchema = z.object({
  segment_id: z.coerce.number(),
  segment_name: z.string().nonempty(),
  start_point: z.string().nonempty(),
  end_point: z.string().nonempty(),
  est_distance: z.coerce.number(),
  site: z.coerce.number(),
  overlap: z.coerce.number(),
  comment: z.string().nonempty(),
  sub_contractor: z.string().nonempty(),
  start_date: z.date(),
  end_date: z.date(),
})


// Profile Schema
export const profileSchema = z.object({
    name: z.string().nonempty(),
    url: z.string(),
    slogan: z.string().optional(),
    description: z.string().optional(),
    profile: z.string().optional()
})


// Profile Schema
export const passwordSchema = z.object({
    new_user_password: z.string().min(2),
    old_user_password: z.string().min(2),
    confirm_new_password: z.string().min(2),
    user_email_address: z.string().email(),
}).refine((data) => data.new_user_password=== data.confirm_new_password, {
    message: "Passwords don't match",
    path: ["confirm_new_password"], // path of error
});



// ----------------------------------------------------------------------------------
//---------------------   REQUEST CONFIRMATION FORMS --------------------------------
// ----------------------------------------------------------------------------------

export const leaveApplicationSchema = z.object({
    leave_type: z.string().nonempty(),
    leave_start_date: z.date(),
    leave_end_date: z.date(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string(),
    request_id: z.string(),
    request_type: z.string(),
})

export const fuelRefillSchema = z.object({
    fueling_reason: z.string().nonempty(),
    request_date: z.date(),
    fuel_amount: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string(),
    request_id: z.string(),
    request_type: z.string(),
});

export const vehicleSupportSchema = z.object({
    support_type: z.string().nonempty(),
    request_date: z.date(),
    support_cost: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string().optional(),
    request_id: z.string().optional(),
    request_type: z.string().optional(),
});

export const pettyCashSchema = z.object({
    allowance_type: z.string().nonempty(),
    start_date: z.date(),
    total_days: z.string(),
    allowance_amount: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string().optional(),
    request_id: z.string().optional(),
    request_type: z.string().optional(),
});

export const casualLabourersSchema = z.object({
    work_type: z.string().nonempty(),
    start_date: z.date(),
    total_days: z.string(),
    casual_amount: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string().optional(),
    request_id: z.string().optional(),
    request_type: z.string().optional(),
});

export const vehicleInspectionSchema = z.object({
    inspection_type: z.string().nonempty(),
    inspection_date: z.date(),
    inspection_cost: z.string(),
    user_id: z.string(),
    request_status: z.string(),
    comment: z.string().optional(),
    request_id: z.string().optional(),
    request_type: z.string().optional(),
});
