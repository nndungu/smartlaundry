export const API_BASE_URL = 'http://localhost:8080/api';

export const ENDPOINTS = {
  auth: '/auth',
  users: '/users',
  orders: '/orders',
  //branches: '/branches',
  //payments: '/payments',
  //deliveries: '/deliveries',
  //driverLocations: '/driver-locations',
  //loyaltyTiers: '/loyalty-tiers'
};

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,

  // Authentication
  AUTH: {
    LOGIN: `${ENDPOINTS.auth}/login`,
    REGISTER: `${ENDPOINTS.auth}/register`,
    REFRESH: `${ENDPOINTS.auth}/refresh`,
    LOGOUT: `${ENDPOINTS.auth}/logout`,
    FORGOT_PASSWORD: `${ENDPOINTS.auth}/forgot-password`,
    RESET_PASSWORD: `${ENDPOINTS.auth}/reset-password`
  },

  // Roles
  ROLES: {
    ALL: '/roles'
  },

  // Users
  USERS: {
    BY_ID: (id: number) => `${ENDPOINTS.users}/${id}`
  },

  // Branches
  //BRANCHES: {
   // ALL: ENDPOINTS.branches,
   // BY_ID: (id: number) => `${ENDPOINTS.branches}/${id}`
 // },

  // Services
  SERVICE_TYPES: {
    ALL: '/service-types'
  },

  CATEGORIES: {
    ALL: '/categories'
  },

  // Orders
  ORDERS: {
    ALL: ENDPOINTS.orders,
    BY_ID: (id: number) => `${ENDPOINTS.orders}/${id}`,
    CREATE: ENDPOINTS.orders
  },

  // Customers
  CUSTOMERS: {
    PROFILE: (customerId: number) => `/customers/${customerId}/profile`,
    TIER: (customerId: number) => `/customers/${customerId}/tier`
  },

  // Payments
  PAYMENT_METHODS: {
    ALL: '/payment-methods'
  },

  //PAYMENTS: {
  //  ALL: ENDPOINTS.payments,
  //  BY_ID: (id: number) => `${ENDPOINTS.payments}/${id}`
  //},

  // Deliveries
  //DELIVERIES: {
   // ALL: ENDPOINTS.deliveries,
   // BY_ID: (id: number) => `${ENDPOINTS.deliveries}/${id}`
  //},

  // Drivers
  DRIVERS: {
    ALL: '/drivers',
    LOCATION: (driverId: number) => `/drivers/${driverId}/location`
  },

  // Driver Locations
  //DRIVER_LOCATIONS: {
  //  ALL: ENDPOINTS.driverLocations,
  //  BY_DRIVER: (driverId: number) => `${ENDPOINTS.driverLocations}/${driverId}`
  //},

  // Loyalty Tiers
  //LOYALTY_TIERS: {
   // ALL: ENDPOINTS.loyaltyTiers
  //}
};
