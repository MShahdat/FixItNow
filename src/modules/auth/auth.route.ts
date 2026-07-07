import { Router } from "express";
import { authController } from "./auth.controller";
import { registerSchema } from "./auth.validation";
import { validateData } from "../../middleware/validationRequest";

const router = Router();

router.post('/register', validateData(registerSchema), authController.userRegister);


export const authRouter = router;