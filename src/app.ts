import express, { type Application, type Request, type Response } from "express";
import { userRoute } from "./modules/user/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";

const app: Application = express();

// -------------------- MIDDLEWARE --------------------
app.use(express.json());

// -------------------- ROOT --------------------
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server Is Running",
    author: "Prem",
  });
});

app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute)
app.use("/api/auth", authRoute)

export default app;
