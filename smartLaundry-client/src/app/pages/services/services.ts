import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Services</h1>
          <p class="text-gray-600 mb-6">Our amazing laundry services will be available soon!</p>
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ServicesComponent {}