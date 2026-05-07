import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin.</p>
    </div>
  `
})
export class AdminDashboardComponent {}
