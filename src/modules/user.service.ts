import { pool } from "../db/index";
import * as bcrypt from "bcrypt";
import type { IUser } from "./user/user.interface";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
      INSERT INTO users(name, email, password, age, role)
      VALUES($1, $2, $3, $4, COALESCE($5, 'user'))
      RETURNING id, name, email, age, role, isActive AS "isActive", create_at
      `,
    [name, email, hashedPassword, age, role],
  );
  return result;
};

const getAllUserFromDB = async () => {
  const result = await pool.query(`
      SELECT id, name, email, age, role, isActive AS "isActive", create_at 
      FROM users
    `);
  return result;
};

const getUserByIdFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT id, name, email, age, role, isActive AS "isActive", create_at
      FROM users
      WHERE id=$1
      `,
    [id],
  );

  return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<IUser>) => {
  const { name, email, password, age } = payload;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  const result = await pool.query(
    `
      UPDATE users
      SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        password = COALESCE($3, password),
        age = COALESCE($4, age),
        updated_at = NOW()
      WHERE id=$5
      RETURNING id, name, email, age, role, isActive AS "isActive", create_at, updated_at
      `,
    [name, email, hashedPassword, age, id],
  );

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      DELETE FROM users
      WHERE id=$1
      RETURNING id, name, email
      `,
    [id],
  );
  return result;
};
export const userServices = {
  createUserIntoDB,
  getAllUserFromDB,
  getUserByIdFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
