import { UserStatus, Role } from "../../generated/prisma/enums"



declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        firstName: string
        lastName: string
        email: string
        phone: string
        role: Role
        status: UserStatus
      }
    }
  }
}