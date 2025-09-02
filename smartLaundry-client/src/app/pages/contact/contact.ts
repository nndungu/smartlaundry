import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 flex items-center justify-center p-4">
      <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Contact us</h1>
          <p class="text-gray-600 mb-6">Learn about our story and mission - coming soon!</p>
          <div class="animate-pulse">
            <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2"></div>
            <div class="h-4 bg-gray-200 rounded w-4/5 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {}