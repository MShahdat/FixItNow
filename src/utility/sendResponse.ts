import { Response } from "express";
import httpStatus from "http-status";


export const rootResponse = (res: Response) => {
  res.status(httpStatus.OK).json({
    success: true,
    status: httpStatus.OK,
    author: "Md. Shahdat Hossain",
    message: "Welcome to the FixItNow to your trusted home service platform",
  });
}