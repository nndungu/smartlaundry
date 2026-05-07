export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin'
}

export const USER_ROLE_LABELS = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.ADMIN]: 'Administrator'
};

export const USER_ROLE_DESCRIPTIONS = {
  [UserRole.CUSTOMER]: 'Book laundry services and track your orders',
  [UserRole.ADMIN]: 'Manage the platform and oversee operations'
};

export const DEFAULT_ROUTES = {
  [UserRole.CUSTOMER]: '/client-dashboard',
  [UserRole.ADMIN]: '/admin-dashboard'
};