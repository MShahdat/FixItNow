import { Router } from "express";
import { technicianController } from "./technician.controller";


const route = Router()

route.get('/', technicianController.getAllTechnician)
route.get('/:technicianId', technicianController.getTechnicianById)

export const technicianRouter = route