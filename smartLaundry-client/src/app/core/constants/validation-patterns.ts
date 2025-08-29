export const VALIDATION_PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NAME: /^[a-zA-Z\s]{2,50}$/
};

export const VALIDATION_MESSAGES = {
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  NAME: 'Name must be between 2-50 characters and contain only letters',
  REQUIRED: 'This field is required'
};