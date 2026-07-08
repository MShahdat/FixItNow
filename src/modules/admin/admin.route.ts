import { Router } from "express";
import { adminControler } from "./admin.controller";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";



const route = Router()

route.get('/users', authorization.roleAuth(Role.ADMIN), adminControler.getAll)


export const adminRouter = route