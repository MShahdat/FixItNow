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
    isAvailable?: boolean;
    availability?: string[];
    verified?: boolean;
}


export interface IUserLogin {
    email: string
    password: string
}