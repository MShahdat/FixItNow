import { Router } from "express";
import { technicianController } from "./technician.controller";


const route = Router()

route.get('/', technicianController.getAllTechnician)


export const technicianRouter = route