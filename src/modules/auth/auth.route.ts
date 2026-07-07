import { Router } from "express";
import { authController } from "./auth.controller";
import { registerSchema } from "./auth.validation";
import { validateData } from "../../middleware/validationRequest";
import { Role } from "../../../generated/prisma/enums";
import { authorization } from "../../middleware/auth";

const router = Router();

router.post('/register', validateData(registerSchema), authController.userRegister);
router.post('/login', authController.userLogin) 
router.post('/access-token', authorization.roleAuth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN) , authController.generateAccessToken)
router.get('/me', authorization.roleAuth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN), authController.getMe)

export const authRouter = router;