import { UserRole } from '../../core/constants/user-roles';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
}

export interface UserProfile extends User {
  address?: string;
  dateOfBirth?: Date;
}