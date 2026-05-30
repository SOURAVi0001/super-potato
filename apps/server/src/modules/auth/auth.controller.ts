import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { registerSchema, loginSchema } from './auth.validation';
import { sendSuccess, sendError } from '../../utils/apiResponse';

export class AuthController {
  static async register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return sendError(res, 'Validation failed', 400, fieldErrors);
    }

    const { email, password, fullName } = parsed.data;
    const { user, accessToken, refreshToken } = await AuthService.register(email, password, fullName);

    // Set HTTP-Only refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, { user, accessToken }, 201);
  }

  static async login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return sendError(res, 'Validation failed', 400, fieldErrors);
    }

    const { email, password } = parsed.data;
    const { user, accessToken, refreshToken } = await AuthService.login(email, password);

    // Set HTTP-Only refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return sendSuccess(res, { user, accessToken }, 200);
  }

  static async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return sendError(res, 'Invalid or expired refresh token', 401);
    }

    const { accessToken } = await AuthService.refresh(refreshToken);
    return sendSuccess(res, { accessToken }, 200);
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return sendSuccess(res, null, 200);
  }

  static async me(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }
    const user = await AuthService.getMe(req.user.id);
    return sendSuccess(res, { user }, 200);
  }
}
