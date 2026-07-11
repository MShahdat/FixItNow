import { Role, UserStatus } from "../../../generated/prisma/enums";


export interface IUserRegister {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    phone: string;
    profileImage?: string;
    address?: string;
    city?: string;
    role: Role
    status?: UserStatus
    bio?: string;
    skills?: string[];
    experience?: number | null;
    hourlyRate?: number
    averageRating?: number;
    completedJobs?: number;
    availability?: string[];
}


export interface IUserLogin {
    email: string
    password: string
}