import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <h2>Vendor Profile</h2>
      <p>Profile management coming soon...</p>
    </div>
  `,
  styleUrls: ['./profile.scss'],
  imports: [CommonModule]
})
export class ProfileComponent {}
