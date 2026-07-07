import { Request, Response } from "express";
import catchAsync from "../../utility/catchAsync";
import { authService } from "./auth.service";


//& USER REGISTER
const userRegister = catchAsync(
  async(req: Request, res: Response) => {
    const body = req.body
    console.log("body", body)

    const result = await authService.userRegisterIntoDB(body);
    
    return res.status(200).json({
      status: "success",
      message: "User registered successfully",
      data: result
    })
  }
)


export const authController = {
  userRegister,


}