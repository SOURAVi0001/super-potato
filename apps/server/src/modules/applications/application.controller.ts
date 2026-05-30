import { Request, Response } from 'express';
import { ApplicationService } from './application.service';
import { sendSuccess, sendError } from '../../utils/apiResponse';

export class ApplicationController {
  static async savePersonalDetails(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { fullName, pan, dateOfBirth, monthlySalary, employmentMode } = req.body;

    if (!fullName || !pan || !dateOfBirth || monthlySalary === undefined || !employmentMode) {
      return sendError(res, 'Missing required personal details fields', 400);
    }

    const result = await ApplicationService.savePersonalDetails(req.user.id, {
      fullName,
      pan,
      dateOfBirth,
      monthlySalary: Number(monthlySalary),
      employmentMode,
    });

    return sendSuccess(res, result, 200);
  }

  static async saveSalarySlip(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    if (!req.file) {
      return sendError(res, 'No salary slip file uploaded', 400);
    }

    const { salarySlipUrl } = await ApplicationService.saveSalarySlip(req.user.id, req.file.filename);

    return sendSuccess(res, { salarySlipUrl }, 200);
  }

  static async saveLoanConfig(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { amount, tenureDays } = req.body;

    if (amount === undefined || tenureDays === undefined) {
      return sendError(res, 'Missing loan amount or tenure parameters', 400);
    }

    const { loanConfig } = await ApplicationService.saveLoanConfig(
      req.user.id,
      Number(amount),
      Number(tenureDays)
    );

    return sendSuccess(res, { loanConfig }, 200);
  }

  static async submitApplication(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const { loan } = await ApplicationService.submitApplication(req.user.id);

    return sendSuccess(res, { loan }, 201);
  }

  static async getMine(req: Request, res: Response) {
    if (!req.user) {
      return sendError(res, 'Unauthorized', 401);
    }

    const data = await ApplicationService.getMine(req.user.id);

    return sendSuccess(res, data, 200);
  }
}
export default ApplicationController;
