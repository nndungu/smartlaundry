# Smart Laundry Project Summary

## 1. Project Summary

### Pages and Components

- **Home Page**
  - Displays hero slider with laundry service highlights.
  - Lists services offered, features, steps to use, testimonials, and team info.
- **Auth Pages**
  - Register, Login, Forgot Password pages for user authentication.
- **Dashboard Pages**
  - **Client Dashboard**
    - Dashboard overview, orders, profile, payments, notifications.
    - Sub-pages: Book Service, Order Tracking, Order History, Payment Checkout, Profile Update, Notifications.
  - **Vendor Dashboard**
    - Vendor overview with order management, profile, payments.
    - Sub-pages: Order Status, Profile, Payments.
  - **Admin Dashboard** (structure present, details not fully explored)
- **Other Pages**
  - Services, Pricing, Contact.

### Services

- **Api Service**
  - Basic HTTP GET wrapper for API calls.
- **Auth Service**
  - Handles Firebase authentication: register, login, logout, password reset.
  - Manages current user state and authentication status.

### Features Status

- Authentication with Firebase is implemented.
- Client and Vendor dashboards with order and profile management are partially implemented.
- Home page with static content and UI animations is complete.
- API integration is minimal; many API calls are placeholders or TODOs.
- Admin dashboard and some client/vendor features may be incomplete or missing.

---

## 2. API Requirements

### Modules and Endpoints

- **Authentication**
  - POST `/auth/login`
  - POST `/auth/register`
  - POST `/auth/refresh`
  - POST `/auth/logout`
  - POST `/auth/forgot-password`
  - POST `/auth/reset-password`

- **User**
  - GET `/user/profile`
  - PATCH `/user/update-profile`

- **Admin**
  - GET `/admin/users`
  - GET `/admin/vendors`

- **Orders (Client & Vendor)**
  - GET `/orders` (list orders)
  - POST `/orders` (create order)
  - PATCH `/orders/{id}` (update order status)
  - GET `/orders/{id}` (order details)

- **Payments**
  - POST `/payments` (process payment)
  - GET `/payments/{userId}` (payment history)

- **Notifications**
  - GET `/notifications/{userId}`
  - POST `/notifications/mark-read`

---

## 3. Models and Data Structures

### User
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'customer' | 'vendor' | 'admin';
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  profileImage?: string;
  address?: string;
  dateOfBirth?: Date;
}
```

### Order
```typescript
interface Order {
  id: number;
  customerId: string;
  vendorId: string;
  service: string;
  pickupDateTime: Date;
  status: 'Pending' | 'Accepted' | 'Rejected' | 'Picked' | 'In Progress' | 'Delivered' | 'Completed';
  createdAt: Date;
  updatedAt: Date;
}
```

### Payment
```typescript
interface Payment {
  id: string;
  orderId: number;
  userId: string;
  amount: number;
  paymentDate: Date;
  status: 'Pending' | 'Completed' | 'Failed';
  method: string;
}
```

### Notification
```typescript
interface Notification {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
```

### LaundryItem (Service)
```typescript
interface LaundryItem {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}
```

---

## 4. Backend To-Do List

- **Controllers**
  - AuthController: login, register, logout, password reset.
  - UserController: profile retrieval and update.
  - OrderController: create, update, list, detail.
  - PaymentController: process payments, list payments.
  - NotificationController: list and mark notifications.

- **Services**
  - AuthService: handle authentication logic.
  - UserService: user management.
  - OrderService: order processing.
  - PaymentService: payment processing.
  - NotificationService: notification management.

- **Database Schema**
  - Use SQL or NoSQL (e.g., PostgreSQL or MongoDB).
  - Tables/Collections: Users, Orders, Payments, Notifications, LaundryItems.
  - Relationships:
    - Order references User (customer) and Vendor.
    - Payment references Order and User.
    - Notification references User.

- **Validation Rules**
  - Email: required, valid format.
  - Password: required, min length 8.
  - User role: enum (customer, vendor, admin).
  - Order status: enum with allowed values.
  - Payment status: enum with allowed values.

---

## 5. Best Practices & Improvements

- **Code Structure**
  - Organize components and pages by feature modules.
  - Use consistent naming conventions (e.g., PascalCase for components).
  - Extract reusable UI components (buttons, modals, alerts).

- **UI Consistency**
  - Standardize footer, navbar, sidebar behavior across pages.
  - Use shared styles and theme constants.

- **Security**
  - Implement route guards for role-based access control.
  - Secure token storage (e.g., HttpOnly cookies or secure storage).
  - Validate all API inputs on backend.
  - Use HTTPS in production.

- **API Integration**
  - Expand Api service to support POST, PATCH, DELETE.
  - Handle API errors gracefully with interceptors.

- **Testing**
  - Add unit and integration tests for services and components.

---

## 6. Frontend To-Do List

- **Complete API Integration**
  - Implement full CRUD operations in Api service (POST, PATCH, DELETE).
  - Connect all dashboard pages (client, vendor, admin) to backend APIs.
  - Implement order status updates with real API calls.
  - Integrate payment processing API in payment checkout.

- **Enhance UI/UX**
  - Add loading spinners and error handling on API calls.
  - Improve mobile responsiveness and accessibility.
  - Standardize modals, notifications, and alerts across the app.
  - Implement user profile update functionality fully.

- **Security and Access Control**
  - Complete implementation of route guards for all roles.
  - Secure token storage and refresh mechanisms.
  - Implement role-based UI visibility and restrictions.

- **Testing**
  - Write unit tests for components and services lacking coverage.
  - Add end-to-end tests for critical user flows (login, booking, payment).

- **Code Quality**
  - Refactor duplicated code into reusable components.
  - Enforce consistent naming and folder structure.
  - Document components and services for maintainability.

- **Performance**
  - Optimize image loading and assets.
  - Lazy load modules and components where applicable.

---

This summary provides a clear overview of the current state of the Smart Laundry Angular project, API needs, data models, backend requirements, and suggestions for improvements.
