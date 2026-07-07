
import { z } from 'zod';

const updateProfileSchema = z.object({
  firstName: z.string().min(3).optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),

  // technician-only fields, still optional at schema level
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  experience: z.number().optional(),
  hourlyRate: z.number().optional(),
  availability: z.array(z.string()).optional(),
}).strict();

export type IUserUpdate = z.infer<typeof updateProfileSchema>;