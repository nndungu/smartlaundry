export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:3000/api',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/update-profile'
  },
  ADMIN: {
    USERS: '/admin/users',
    VENDORS: '/admin/vendors'
  }
};