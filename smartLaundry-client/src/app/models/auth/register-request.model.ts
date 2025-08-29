import { UserRole } from '../../core/constants/user-roles';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  adminPasscode?: string;
  agreeToTerms: boolean;
}