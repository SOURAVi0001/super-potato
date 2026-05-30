import { Request, Response } from 'express';
import { UserService } from './user.service';
import { sendSuccess } from '../../utils/apiResponse';

export class UserController {
  static async getLeads(req: Request, res: Response) {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);

    const { leads, meta } = await UserService.getLeads(page, limit);

    return sendSuccess(res, leads, 200, meta);
  }
}
export default UserController;
