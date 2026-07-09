import { Router } from "express";
import { paymentController } from "./payment.controller";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";



const route = Router()

route.post('/create-payment-intent',authorization.roleAuth(Role.CUSTOMER), paymentController.createPaymentIntent)



export const paymentRouter = route