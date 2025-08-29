export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR = 'vendor', 
  ADMIN = 'admin'
}

export const USER_ROLE_LABELS = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.VENDOR]: 'Laundry Service Provider',
  [UserRole.ADMIN]: 'Administrator'
};

export const USER_ROLE_DESCRIPTIONS = {
  [UserRole.CUSTOMER]: 'Book laundry services and track your orders',
  [UserRole.VENDOR]: 'Provide laundry services and manage bookings',
  [UserRole.ADMIN]: 'Manage the platform and oversee operations'
};

export const DEFAULT_ROUTES = {
  [UserRole.CUSTOMER]: '/customer/dashboard',
  [UserRole.VENDOR]: '/vendor/dashboard', 
  [UserRole.ADMIN]: '/admin/dashboard'
};