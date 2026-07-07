
import { NextFunction, Request, Response } from "express";
import httpCode from 'http-status'
import { ZodError } from "zod";
import { badResponse } from "../utility/sendResponse";


export const validateData = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try{
      schema.parse(req.body);
      next();
    }catch(error: any){
      const er = error.issues[0]
      const response = {
        success: false,
        statusCode: httpCode.BAD_REQUEST,
        code: er.code,
        path: er.path,
        message: er.message
      }
       res.status(httpCode.BAD_REQUEST).json(response)
    }
  };
};