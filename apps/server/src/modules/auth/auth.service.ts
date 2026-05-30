import bcrypt from 'bcrypt';
import User from '../users/user.model';
import { UserRole } from '@lms/shared/src/types/user.types';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/tokens';

export class AuthService {
  static async register(email: string, password: string, fullName: string) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error: any = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    // New self-registrations are strictly BORROWER profiles
    const user = new User({
      email: email.toLowerCase(),
      password,
      fullName,
      role: UserRole.BORROWER,
    });

    await user.save();

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.isActive) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    user.lastLogin = new Date();
    await user.save();

    const payload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  static async refresh(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        const error: any = new Error('Invalid or expired refresh token');
        error.statusCode = 401;
        throw error;
      }

      const payload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role as UserRole,
      };

      const accessToken = signAccessToken(payload);
      return { accessToken };
    } catch (err: any) {
      const error: any = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      throw error;
    }
  }

  static async getMe(userId: string) {
    const user = await User.findById(userId);
    if (!user || !user.isActive) {
      const error: any = new Error('User not found or inactive');
      error.statusCode = 404;
      throw error;
    }
    return user;
  }
}
