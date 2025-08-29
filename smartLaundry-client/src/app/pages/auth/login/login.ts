import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-card">
        <h1 class="text-2xl font-bold mb-4">Login</h1>
        <p>Login component - Coming soon!</p>
        <button (click)="goToRegister()" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Go to Register
        </button>
      </div>
    </div>
  `
})
export class LoginComponent {
  goToRegister() {
    // Navigation logic
  }
}