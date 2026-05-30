import mongoose from 'mongoose';
import { env } from './env';

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

export async function connectDatabase(): Promise<void> {
  let attempt = 1;

  while (attempt <= MAX_RETRIES) {
    try {
      console.log(`Connecting to MongoDB (Attempt ${attempt}/${MAX_RETRIES}) at ${env.MONGODB_URI}...`);
      await mongoose.connect(env.MONGODB_URI);
      console.log('MongoDB connection established successfully.');
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
      attempt++;
      if (attempt <= MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_INTERVAL_MS / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL_MS));
      }
    }
  }

  console.error('CRITICAL ERROR: Max database connection retries reached. Shutting down...');
  process.exit(1);
}
