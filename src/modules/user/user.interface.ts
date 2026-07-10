import { UserStatus } from "../../../generated/prisma/enums";


export interface IUserUpdate {
    firstName?: string;
    lastName?: string;
    phone?: string;
    profileImage?: string;
    address?: string;
    city?: string;
    status?: UserStatus
    bio?: string;
    skills?: string[];
    experience?: number | null;
    hourlyRate?: number
    availability?: string[];
}



export interface IUserPass {
  password: string
}

