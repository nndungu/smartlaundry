import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payments',
  template: `
    <div class="payments-container">
      <h2>Payments</h2>
      <p>Payment history and management coming soon...</p>
    </div>
  `,
  styleUrls: ['./payments.scss'],
  imports: [CommonModule]
})
export class PaymentsComponent {}
