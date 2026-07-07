import { Role, UserStatus } from "../../../generated/prisma/enums";


export interface IUserRegister {
    firstName: string;
    lastName?: string;
    email: string;
    password: string;
    phone: string;
    address?: string;
    city?: string;
    role: Role
    status?: UserStatus
    bio?: string;
    experience?: string;
    workingHours?: string[];
    availability?: boolean;
    verified?: boolean;
}