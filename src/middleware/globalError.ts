import { NextFunction, Request, Response } from "express"
import httpCode from 'http-status'
import { Prisma } from "../../generated/prisma/client"


export const globalError = (err: any, req: Request, res: Response, next: NextFunction) => {

  let statusCode
  let errorName = err.name || "Internal Server Error!"
  let message = err.message || "Internal Server Error!"
  let error = err.stack

  if(err instanceof Prisma.PrismaClientKnownRequestError){
    if(err.code === 'P2002'){
      statusCode = httpCode.CONFLICT;
      message = 'A record with this value already exists';
    }else if(err.code === 'P2003'){
      statusCode = httpCode.BAD_REQUEST;
      message = "The provided relational ID reference is invalid or does not exist" 
    }else if(err.code === 'P2006'){
      statusCode = httpCode.BAD_REQUEST;
      message = 'Invalid fields for model schema'
    }else if(err.code === 'P2007'){
      statusCode = httpCode.UNPROCESSABLE_ENTITY;
      message = "Data validatioon error";
    }else if(err.code === 'P2015'){
      statusCode = httpCode.NOT_FOUND;
      message = 'The requested related resource could not be found.'
    }
  }
  else if(err instanceof Prisma.PrismaClientInitializationError){
    if(err.errorCode === 'P1000'){
      statusCode = httpCode.INTERNAL_SERVER_ERROR;
      message = 'An internal server error occured'
    }else if(err.errorCode === 'P1001'){
      statusCode = httpCode.INTERNAL_SERVER_ERROR;
      message = "Service temporarily unavailable"
    }else if(err.errorCode === 'P1002'){
      statusCode = httpCode.INTERNAL_SERVER_ERROR;
      message = "The server took too long to respond"
    }else if(err.errorCode === 'P1003'){
      statusCode = httpCode.INTERNAL_SERVER_ERROR;
      message = "Internal system database configuration error"
    }else if(err.errorCode === 'P1008'){
      statusCode = httpCode.INTERNAL_SERVER_ERROR;
      message = "The request timed out internally. Please try again."
    }
  }
  else if(err instanceof Prisma.PrismaClientValidationError){
    statusCode = httpCode.BAD_REQUEST;
    message = "Incorrect fields or missing fields"
  }
  else if(err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpCode.INTERNAL_SERVER_ERROR;
    message = "A critical system error occurred. The team has been notified"
  }
  else if(err instanceof Prisma.PrismaClientUnknownRequestError){
    statusCode = httpCode.INTERNAL_SERVER_ERROR;
    message = 'An unexpected database error occurred while processing your request'
  }


  const response = {
    status: false,
    statusCode,
    errorName,
    message,
    error
  }
  res.status(httpCode.INTERNAL_SERVER_ERROR).json(response)
}