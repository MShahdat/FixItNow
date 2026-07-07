import { z } from 'zod';


const baseSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(3),
  phone: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
});


const customerSchema = baseSchema.extend({
    role: z.literal("CUSTOMER")
});


const technicianSchema = baseSchema.extend({
    role: z.literal("TECHNICIAN"),
    
    bio: z.string().optional(),
    experience: z.string().optional(),
    workingHours: z.array(z.string())
});


export const registerSchema = z.discriminatedUnion("role",[
    customerSchema,
    technicianSchema
]);