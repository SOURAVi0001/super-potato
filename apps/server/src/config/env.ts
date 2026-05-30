import dotenv from 'dotenv';
import path from 'path';

// Resolve directory path to load local environment configuration
dotenv.config({ path: path.join(__dirname, '../../.env') });

const REQUIRED_ENV_VARS = [
  'PORT',
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'CLIENT_URL',
];

export function validateEnv(): void {
  const missingVars: string[] = [];

  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.error('============================================================');
    console.error('CRITICAL SERVER STARTUP ERROR: Missing required env variables:');
    for (const v of missingVars) {
      console.error(`  [MISSING] ${v}`);
    }
    console.error('============================================================');
    process.exit(1);
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  MONGODB_URI: process.env.MONGODB_URI!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  CLIENT_URL: process.env.CLIENT_URL!,
  NODE_ENV: process.env.NODE_ENV || 'development',
};
