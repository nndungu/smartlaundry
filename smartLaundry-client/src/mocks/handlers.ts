import { http, HttpResponse } from 'msw';
import {
  MOCK_CREDENTIALS,
  MOCK_USERS,
  MOCK_TOKENS,
  MOCK_SERVICES,
  MOCK_CATEGORIES,
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
  MOCK_PAYMENT_METHODS
} from './mock-data';
import { generateFakeJwt } from './fake-jwt';

const BASE = 'http://localhost:8080/api';

export const handlers = [

  // ─── AUTH ────────────────────────────────────────────────────────────────

  http.post(`${BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { email: string; password: string };

    const match = MOCK_CREDENTIALS.find(
      c => c.email === body.email && c.password === body.password
    );

    if (!match) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = match.role === 'admin' ? MOCK_USERS.admin : MOCK_USERS.customer;
    const tokens = match.role === 'admin' ? MOCK_TOKENS.admin : MOCK_TOKENS.customer;

    return HttpResponse.json({
      user,
      token: tokens.token,
      refreshToken: tokens.refreshToken,
      expiresIn: tokens.expiresIn
    });
  }),

  http.post(`${BASE}/auth/register`, async ({ request }) => {
    const body = await request.json() as any;

    return HttpResponse.json({
      message: 'Registration successful! Please check your email for verification.',
      user: {
        id: String(Date.now()),
        email: body.email,
        firstName: body.fullName?.split(' ')[0] || '',
        lastName: body.fullName?.split(' ')[1] || '',
        phone: body.phone,
        role: body.role?.id === 3 ? 'admin' : 'customer',
        isActive: true,
        isEmailVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }, { status: 201 });
  }),

  http.post(`${BASE}/auth/logout`, () => {
    return HttpResponse.json({ message: 'Logged out successfully' });
  }),

  http.post(`${BASE}/auth/refresh`, async ({ request }) => {
    const body = await request.json() as { refreshToken: string };

    if (!body.refreshToken) {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    // Return new tokens for customer by default
    return HttpResponse.json({
      user: MOCK_USERS.customer,
      token: generateFakeJwt({ sub: '2', role: 'customer' }),
      refreshToken: generateFakeJwt({ sub: '2', type: 'refresh' }, 604800),
      expiresIn: 86400
    });
  }),

  http.post(`${BASE}/auth/forgot-password`, async ({ request }) => {
    const body = await request.json() as { email: string };
    return HttpResponse.json({
      message: `Password reset link sent to ${body.email}`
    });
  }),

  http.post(`${BASE}/auth/reset-password`, () => {
    return HttpResponse.json({ message: 'Password reset successfully' });
  }),

  // ─── SERVICES ────────────────────────────────────────────────────────────

  http.get(`${BASE}/service-types`, () => {
    return HttpResponse.json(MOCK_SERVICES);
  }),

  // ─── CATEGORIES ──────────────────────────────────────────────────────────

  http.get(`${BASE}/categories`, () => {
    return HttpResponse.json(MOCK_CATEGORIES);
  }),

  // ─── PAYMENT METHODS ─────────────────────────────────────────────────────

  http.get(`${BASE}/payment-methods`, () => {
    return HttpResponse.json(MOCK_PAYMENT_METHODS);
  }),

  // ─── ORDERS ──────────────────────────────────────────────────────────────

  http.get(`${BASE}/orders`, () => {
    return HttpResponse.json(MOCK_ORDERS);
  }),

  http.get(`${BASE}/orders/:id`, ({ params }) => {
    const order = MOCK_ORDERS.find(o => o.id === Number(params['id']));
    if (!order) {
      return HttpResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    return HttpResponse.json(order);
  }),

  http.post(`${BASE}/orders`, async ({ request }) => {
    const body = await request.json() as any;
    const newOrder = {
      id: MOCK_ORDERS.length + 1,
      customerId: 2,
      customerName: 'Jane Doe',
      status: 'Pending',
      createdAt: new Date(),
      ...body
    };
    MOCK_ORDERS.push(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.patch(`${BASE}/orders/:id`, async ({ params, request }) => {
    const body = await request.json() as any;
    const index = MOCK_ORDERS.findIndex(o => o.id === Number(params['id']));
    if (index === -1) {
      return HttpResponse.json({ message: 'Order not found' }, { status: 404 });
    }
    MOCK_ORDERS[index] = { ...MOCK_ORDERS[index], ...body };
    return HttpResponse.json(MOCK_ORDERS[index]);
  }),

  // ─── CUSTOMERS ───────────────────────────────────────────────────────────

  http.get(`${BASE}/customers/:id/profile`, ({ params }) => {
    const customer = MOCK_CUSTOMERS.find(c => c.id === Number(params['id']));
    if (!customer) {
      return HttpResponse.json({ message: 'Customer not found' }, { status: 404 });
    }
    return HttpResponse.json(customer);
  }),

  http.get(`${BASE}/customers/:id/tier`, ({ params }) => {
    return HttpResponse.json({
      customerId: Number(params['id']),
      tier: 'Gold',
      points: 1200,
      nextTier: 'Platinum',
      pointsToNextTier: 800
    });
  }),

  // ─── USERS (admin) ───────────────────────────────────────────────────────

  http.get(`${BASE}/users`, () => {
    return HttpResponse.json(MOCK_CUSTOMERS);
  }),

  // ─── ROLES ───────────────────────────────────────────────────────────────

  http.get(`${BASE}/roles`, () => {
    return HttpResponse.json([
      { id: 1, name: 'customer' },
      { id: 3, name: 'admin' }
    ]);
  }),

  // ─── DRIVERS (kept minimal since we removed vendor) ──────────────────────

  http.get(`${BASE}/drivers`, () => {
    return HttpResponse.json([]);
  }),
];
    