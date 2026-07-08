import { Router } from "express";
import { serviceController } from "./service.controller";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";


const route = Router()


route.post('/', authorization.roleAuth(Role.TECHNICIAN), serviceController.createService)
route.get('/', serviceController.getAllServices)
route.put('/:serviceId', authorization.roleAuth(Role.TECHNICIAN), serviceController.updateService)



export const serviceRouter = route