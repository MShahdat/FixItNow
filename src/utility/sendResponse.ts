import { Response } from "express";
import httpCode from "http-status";


//* ROOT RESPONSE
export const rootResponse = (res: Response) => {
  res.status(httpCode.OK).json({
    success: true,
    status: httpCode.OK,
    author: "Md. Shahdat Hossain",
    message: "Welcome to the FixItNow to your trusted home service platform",
  });
}

//* SUCCESS
export const successResponse = <T> (res: Response, statusCode: number, message?: string, data?: T) => {
  const response = {
    success: true,
    statusCode,
    message: message || "Request completed successfully",
    data
  }
  res.status(httpCode.OK).json(response)
}


//& NOT-FOUND RESPNSE
export const notFoundResponse = (res: Response, message?: string) => {
  const response = {
    success: false,
    statusCode: httpCode.NOT_FOUND,
    message : message || "Not Found!!",
    data: null
  }
  res.status(httpCode.NOT_FOUND).json(response)
}


//& UNAUTHORIZED RESPONSE
export const unauthorizedResponse = (res: Response, message?: string) => {
  const response = {
    success: false,
    statusCode: httpCode.UNAUTHORIZED,
    message : message || "Unauthorized access!",
  }
  res.status(httpCode.UNAUTHORIZED).json(response)
}



//& FORBIDDEN RESPONSE
export const forbiddenResponse = (res: Response, message: string) => {
  const response = {
    success: false,
    statusCode: httpCode.FORBIDDEN,
    message : message,
  }
  res.status(httpCode.FORBIDDEN).json(response)
}


//& BAD RESPONSE
export const badResponse = (res: Response, message: string) => {
  const response = {
    success: false,
    statusCode: httpCode.BAD_REQUEST,
    message : message,
  }
  res.status(httpCode.BAD_REQUEST).json(response)
}


export const errorResponse = <T> (res: Response, message: string, data?: T) => {
  const response = {
    success: false,
    statusCode: httpCode.INTERNAL_SERVER_ERROR,
    message,
    data
  }
  res.status(httpCode.INTERNAL_SERVER_ERROR).json(response)
}