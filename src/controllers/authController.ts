import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { UserCredentials } from '../types/auth.types';

export const login = async (req: Request, res: Response) => {
  const { username, password }: UserCredentials = req.body;

  try {
    const token = await AuthService.login(username, password);
    return res.status(200).json({ token });
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }
};

export const register = async (req: Request, res: Response) => {
  const { username, password }: UserCredentials = req.body;

  try {
    const newUser = await AuthService.register(username, password);
    return res.status(201).json(newUser);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};