import Stripe from "stripe";
import config from "../config/env";


export const stripe = new Stripe(config.stripe_sercet_key as string)

