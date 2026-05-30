export enum UserRole {
  ADMIN       = 'ADMIN',
  SALES       = 'SALES',
  SANCTION    = 'SANCTION',
  DISBURSEMENT = 'DISBURSEMENT',
  COLLECTION  = 'COLLECTION',
  BORROWER    = 'BORROWER',
}

export interface IUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}
