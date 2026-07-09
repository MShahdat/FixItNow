import { Router } from "express";
import { authorization } from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const route = Router()

route.post( "/create-checkout-session", authorization.roleAuth(Role.CUSTOMER), paymentController.createCheckoutSession
);

route.post("/webhook", paymentController.stripeWebhook);



export const paymentRouter = route