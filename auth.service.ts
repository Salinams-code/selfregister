import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../repositories/user.repository';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

const JWT_SECRET = 'supersecret'; // Replace with env

export const registerUser = async ({ email, password }: RegisterInput) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  return createUser(email, hashedPassword);
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return { token };
};
