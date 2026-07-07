import { NextFunction, Request, RequestHandler, Response } from "express";
import { errorResponse } from "./sendResponse";



const catchAsync = (fn: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error)
    }
  };
};


export default catchAsync;