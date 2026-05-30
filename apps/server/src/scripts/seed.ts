import mongoose from 'mongoose';
import { validateEnv } from '../config/env';
import { connectDatabase } from '../config/database';
import User from '../modules/users/user.model';
import { UserRole } from '@lms/shared/src/types/user.types';

const seedUsers = [
  { email: 'admin@lms.com',    password: 'Admin@123',    fullName: 'Admin User',          role: UserRole.ADMIN        },
  { email: 'sales@lms.com',    password: 'Sales@123',    fullName: 'Sales Executive',     role: UserRole.SALES        },
  { email: 'sanction@lms.com', password: 'Sanction@123', fullName: 'Sanction Executive',  role: UserRole.SANCTION     },
  { email: 'disburse@lms.com', password: 'Disburse@123', fullName: 'Disburse Executive',  role: UserRole.DISBURSEMENT },
  { email: 'collect@lms.com',  password: 'Collect@123',  fullName: 'Collection Executive',role: UserRole.COLLECTION   },
  { email: 'borrower@lms.com', password: 'Borrower@123', fullName: 'Test Borrower',       role: UserRole.BORROWER     },
];

async function seed() {
  try {
    console.log('Starting seed operations...');
    validateEnv();
    await connectDatabase();

    const summary: any[] = [];

    for (const seedData of seedUsers) {
      const existingUser = await User.findOne({ email: seedData.email });

      if (existingUser) {
        // Reset and update to ensure correct seed configurations
        existingUser.fullName = seedData.fullName;
        existingUser.role = seedData.role;
        existingUser.password = seedData.password; // Mongoose pre-save hook will capture and rehash
        await existingUser.save();
        summary.push({
          Email: seedData.email,
          Role: seedData.role,
          Action: 'RESET/UPDATED',
        });
      } else {
        const newUser = new User(seedData);
        await newUser.save();
        summary.push({
          Email: seedData.email,
          Role: seedData.role,
          Action: 'CREATED',
        });
      }
    }

    console.log('\n============================================================');
    console.log('                  DATABASE SEED COMPLETED                   ');
    console.log('============================================================');
    console.table(summary);
    console.log('============================================================\n');

    await mongoose.disconnect();
    console.log('Database disconnected cleanly.');
    process.exit(0);
  } catch (error) {
    console.error('CRITICAL SEED ERROR:', error);
    process.exit(1);
  }
}

seed();
