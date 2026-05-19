import { Router } from "express";
import { profileController } from "./profile.controller";


const router = Router();

router.post("/", profileController.createProfile)
router.get("/", profileController.getProfile)
router.put("/:id", profileController.updateProfile)
router.delete("/:id", profileController.deleteProfile)


export const profileRoute = router;
