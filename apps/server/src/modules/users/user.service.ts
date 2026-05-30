import User from './user.model';
import Application from '../applications/application.model';
import { UserRole } from '@lms/shared/src/types/user.types';
import { ApplicationStatus } from '@lms/shared/src/types/loan.types';

export class UserService {
  static async getLeads(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Fetch applications that have transitioned to APPLIED status
    const appliedApps = await Application.find({ status: ApplicationStatus.APPLIED }, 'userId');
    const appliedUserIds = appliedApps.map(app => app.userId.toString());

    // Filter out registered borrowers who are already applied
    const query = {
      role: UserRole.BORROWER,
      _id: { $nin: appliedUserIds },
    };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Enrich borrower profiles with draft or BRE-failed statuses
    const enrichedLeads = await Promise.all(
      users.map(async user => {
        const app = await Application.findOne({ userId: user._id });
        return {
          id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          applicationStatus: app ? app.status : null,
        };
      })
    );

    const totalPages = Math.ceil(total / limit);

    return {
      leads: enrichedLeads,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  static async getUserById(id: string) {
    return User.findById(id);
  }
}
export default UserService;
