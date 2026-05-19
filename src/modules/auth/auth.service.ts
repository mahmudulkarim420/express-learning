import { pool } from "../../db/index";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config/index";
const loginIntoDB = async (payload: {
    email: string;
    password: string;
}) => {
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
    const token = jwt.sign({id: user.id, email: user.email}, config.secret_key, {expiresIn: "1h"});
    return {token};
}

export const authService = {
    loginIntoDB
}
