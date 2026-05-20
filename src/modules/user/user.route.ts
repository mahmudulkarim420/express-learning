import { Router } from "express";
import userController from "../user.controller";
import auth from "../../middleware/auth";
import { Role } from "../../types";

const router = Router();

// -------------------- CREATE USER --------------------
router.post("/", userController.createUser);
// -------------------- GET ALL USERS --------------------
router.get("/", auth(Role.admin, Role.agent), userController.getUserAll);
// -------------------- GET SINGLE USER --------------------
router.get("/:id", userController.getUserById);
// -------------------- UPDATE USER --------------------
router.put("/:id", userController.updateUser);
// -------------------- DELETE USER --------------------
router.delete("/:id", userController.deleteUser);

export const userRoute = router;
