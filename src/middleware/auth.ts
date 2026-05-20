import jwt from "jsonwebtoken";
import config from "../config";
import type { NextFunction, Request, Response } from "express";
import { pool } from "../db";
import type { Roles } from "../types";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

const auth = (...role: Roles[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided",
      });
    }

    const decodedToken = jwt.verify(
      token,
      config.secret_key as string
    ) as { email: string };

    const user = await pool.query(`SELECT * FROM users WHERE email = $1`,[decodedToken.email])
    req.user = user.rows[0];

    if(!user.rows.length){
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    if(role.length && !role.includes(user.rows[0].role)){
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Insufficient permissions",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default auth;
