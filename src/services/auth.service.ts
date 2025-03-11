import User from '../models/User';
import { sign } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt'; // Fixed import for hash
import { UserCredentials, AuthResponse } from '../types/auth.types';
import { getRepository } from 'typeorm';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace with your secret

const login = async (username: string, password: string): Promise<string> => {
    const user = await User.findOne({ where: { username } });

    if (!user) {
        throw new Error('User not found');
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }

    const token = sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    return token;
};

const register = async (username: string, password: string): Promise<User> => {
    const hashedPassword = await hash(password, 10); // Fixed bcrypt.hash to hash

    const newUser = await User.create({
        username,
        password: hashedPassword,
    });

    return newUser;
};

export const AuthService = {
    login,
    register
};