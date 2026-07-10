import { Router } from "express";
import { technicianController } from "./technician.controller";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const route = Router()

route.get('/', technicianController.getAllTechnician)
route.get('/booking', authorization.roleAuth(Role.TECHNICIAN), technicianController.getBooking)

route.get('/:technicianId', technicianController.getTechnicianById)

route.patch('/booking/:bookingId', authorization.roleAuth(Role.TECHNICIAN), technicianController.updateBooking)

route.get('/bookings/incomming', authorization.roleAuth(Role.TECHNICIAN), technicianController.incommingbook)

route.patch('/availability', authorization.roleAuth(Role.TECHNICIAN), technicianController.setAvailability)



export const technicianRouter = route