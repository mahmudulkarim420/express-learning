import type { Request, Response } from "express";
import { authService } from "./auth.service";

const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginIntoDB(req.body);

    res.status(200).json({
      success: true,
      message: "Login Successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const authController = {
  login
}