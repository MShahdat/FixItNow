import { UserStatus } from "../../../generated/prisma/enums";


export interface IUserUpdate {
    firstName?: string;
    lastName?: string;
    phone: string;
    profileImage?: string;
    address?: string;
    city?: string;
    status?: UserStatus
    bio?: string;
    skills?: string[];
    experience?: number | null;
    hourlyRate?: number
    isAvailable?: boolean;
    availability?: string[];
}



export interface IUserPass {
  password: string
}


export interface IUserStatus {
  status: UserStatus
}

