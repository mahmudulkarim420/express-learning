import { pool } from "../../db/index";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/index";
const loginIntoDB = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rows.length === 0) {
    throw new Error("User Not Found");
  }
  const user = result.rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid Password");
  }
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, config.secret_key, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.refresh_secret,
    { expiresIn: "7d" },
  );
  return { token, refreshToken };
};

const generateRefreshToken = async (token: string) => {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const decodedToken = jwt.verify(token, config.refresh_secret as string) as {
    email: string;
    id: string;
    role: string;
  };

  const user = await pool.query(`SELECT * FROM users WHERE email = $1`, [decodedToken.email]);

  if (!user.rows.length) {
    throw new Error("User Not Found");
  }

  const userData = user.rows[0];
  const accessToken = jwt.sign(
    { id: userData.id, email: userData.email, role: userData.role },
    config.secret_key,
    { expiresIn: "1h" },
  );

  return { accessToken };
};

export const authService = {
  loginIntoDB,
  generateRefreshToken,
};
