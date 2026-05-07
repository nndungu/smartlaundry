import { generateFakeJwt } from './fake-jwt';

// ─── USERS ───────────────────────────────────────────────────────────────────

export const MOCK_USERS = {
  admin: {
    id: '1',
    email: 'admin@washwise.com',
    firstName: 'Admin',
    lastName: 'User',
    phone: '0712345678',
    role: 'admin',
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    profileImage: null
  },
  customer: {
    id: '2',
    email: 'customer@washwise.com',
    firstName: 'Jane',
    lastName: 'Doe',
    phone: '0798765432',
    role: 'customer',
    isActive: true,
    isEmailVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    profileImage: null
  }
};

// ─── TOKENS ──────────────────────────────────────────────────────────────────

export const MOCK_TOKENS = {
  admin: {
    token: generateFakeJwt({ sub: '1', role: 'admin', email: 'admin@washwise.com' }),
    refreshToken: generateFakeJwt({ sub: '1', type: 'refresh' }, 604800),
    expiresIn: 86400
  },
  customer: {
    token: generateFakeJwt({ sub: '2', role: 'customer', email: 'customer@washwise.com' }),
    refreshToken: generateFakeJwt({ sub: '2', type: 'refresh' }, 604800),
    expiresIn: 86400
  }
};

// ─── CREDENTIALS ─────────────────────────────────────────────────────────────

export const MOCK_CREDENTIALS = [
  { email: 'admin@washwise.com', password: 'admin1234', role: 'admin' },
  { email: 'customer@washwise.com', password: 'customer1234', role: 'customer' }
];

// ─── SERVICES ────────────────────────────────────────────────────────────────

export const MOCK_SERVICES = [
  { id: 1, name: 'Wash & Fold', price: 500, duration: '24hrs', description: 'Full wash and fold service', category: 'Basic' },
  { id: 2, name: 'Dry Cleaning', price: 800, duration: '48hrs', description: 'Professional dry cleaning', category: 'Premium' },
  { id: 3, name: 'Iron Only', price: 300, duration: '12hrs', description: 'Ironing and pressing only', category: 'Basic' },
  { id: 4, name: 'Duvet Cleaning', price: 1200, duration: '72hrs', description: 'Heavy items cleaning', category: 'Premium' },
  { id: 5, name: 'Stain Removal', price: 600, duration: '24hrs', description: 'Specialized stain treatment', category: 'Special' }
];

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES = [
  { id: 1, name: 'Basic', description: 'Everyday laundry services' },
  { id: 2, name: 'Premium', description: 'High-end cleaning services' },
  { id: 3, name: 'Special', description: 'Specialized treatments' }
];

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export let MOCK_ORDERS = [
  {
    id: 1,
    customerId: 2,
    customerName: 'Jane Doe',
    service: 'Wash & Fold',
    status: 'Pending',
    totalPrice: 500,
    createdAt: new Date('2026-05-01'),
    items: [{ id: '1', name: 'Shirts', quantity: 5, price: 100, serviceType: 'Wash & Fold' }]
  },
  {
    id: 2,
    customerId: 2,
    customerName: 'Jane Doe',
    service: 'Dry Cleaning',
    status: 'In Progress',
    totalPrice: 800,
    createdAt: new Date('2026-05-03'),
    items: [{ id: '2', name: 'Suit', quantity: 1, price: 800, serviceType: 'Dry Cleaning' }]
  },
  {
    id: 3,
    customerId: 2,
    customerName: 'Jane Doe',
    service: 'Iron Only',
    status: 'Completed',
    totalPrice: 300,
    createdAt: new Date('2026-04-28'),
    items: [{ id: '3', name: 'Trousers', quantity: 3, price: 100, serviceType: 'Iron Only' }]
  }
];

// ─── CUSTOMERS (for admin view) ───────────────────────────────────────────────

export let MOCK_CUSTOMERS = [
  {
    id: 2,
    fullName: 'Jane Doe',
    email: 'customer@washwise.com',
    phone: '0798765432',
    role: 'customer',
    isActive: true,
    totalOrders: 3,
    createdAt: new Date('2024-01-01')
  }
];

// ─── PAYMENT METHODS ─────────────────────────────────────────────────────────

export const MOCK_PAYMENT_METHODS = [
  { id: 1, name: 'M-Pesa', description: 'Pay via M-Pesa mobile money' },
  { id: 2, name: 'Cash on Delivery', description: 'Pay when your order is delivered' },
  { id: 3, name: 'Credit Card', description: 'Pay with Visa or Mastercard' }
];