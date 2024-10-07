// src/types/express.d.ts
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      userId?: string;  // or number, depending on how you handle IDs
    }
  }
}
