import { Router } from "express";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const route = Router()

route.post( "/create", authorization.roleAuth(Role.CUSTOMER), paymentController.createCheckoutSession
);

route.post("/webhook", paymentController.stripeWebhook);

route.get('/history', authorization.roleAuth(Role.CUSTOMER), paymentController.history)

route.get('/:paymentId', authorization.roleAuth(Role.CUSTOMER), paymentController.getPayment)




export const paymentRouter = route