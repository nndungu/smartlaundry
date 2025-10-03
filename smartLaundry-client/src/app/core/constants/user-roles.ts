export enum UserRole {
  CUSTOMER = 'customer',
  DRIVER = 'driver',
  ADMIN = 'admin'
}

export const USER_ROLE_LABELS = {
  [UserRole.CUSTOMER]: 'Customer',
  [UserRole.DRIVER]: 'Driver',
  [UserRole.ADMIN]: 'Administrator'
};

export const USER_ROLE_DESCRIPTIONS = {
  [UserRole.CUSTOMER]: 'Book laundry services and track your orders',
  [UserRole.DRIVER]: 'Provide laundry services and manage bookings',
  [UserRole.ADMIN]: 'Manage the platform and oversee operations'
};

export const DEFAULT_ROUTES = {
  [UserRole.CUSTOMER]: '/customer/dashboard',
  [UserRole.DRIVER]: '/vendor/dashboard',
  [UserRole.ADMIN]: '/admin/dashboard'
};
