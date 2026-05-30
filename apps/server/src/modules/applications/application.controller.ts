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

    const { salarySlipUrl } = await ApplicationService.saveSalarySlip(req.user.id, {
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
    });

    return sendSuccess(res, { salarySlipUrl }, 200);
  }

  static async getSalarySlip(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const app = await ApplicationService.getSalarySlipById(id);
      if (!app) {
        return sendError(res, 'Application not found', 404);
      }

      // 1. If buffer exists, serve it directly from MongoDB
      if (app.salarySlip && app.salarySlip.data) {
        res.set('Content-Type', app.salarySlip.contentType || 'application/pdf');
        res.set('Content-Disposition', `inline; filename="${app.salarySlip.filename || 'salary-slip.pdf'}"`);
        return res.send(app.salarySlip.data);
      }

      // 2. Fallback: Serve mock template from local uploads if buffer is empty ( seeded accounts )
      const path = require('path');
      const fs = require('fs');
      const mockPath = path.join(__dirname, '../../../../uploads/salary-slip-mock.pdf');

      if (fs.existsSync(mockPath)) {
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'inline; filename="salary-slip-mock.pdf"');
        return res.sendFile(mockPath);
      }

      return sendError(res, 'Salary slip document not found', 404);
    } catch (err: any) {
      return sendError(res, err.message || 'Internal server error', 500);
    }
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
