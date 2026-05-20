import type { Request, Response } from "express";
import { userServices } from "./user.service";
import sendResponse from "../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUserIntoDB(req.body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Created Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getUserAll = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getAllUserFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users Get Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const result = await userServices.getUserByIdFromDB(id as string);

    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Get Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const result = await userServices.updateUserIntoDB(id as string, req.body);

    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Updated Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userServices.deleteUserFromDB(id as string);

    if (result.rows.length === 0) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "User Not Found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User Deleted Successfully",
      data: [],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const userController = {
  createUser,
  getUserAll,
  getUserById,
  updateUser,
  deleteUser,
};

export default userController;
