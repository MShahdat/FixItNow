
import { NextFunction, Request, Response } from "express";



export const validateData = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try{
      schema.parse(req.body);
      next();
    }catch(err: any){
      res.status(400).json({ error: err.message });
    }
  };
};