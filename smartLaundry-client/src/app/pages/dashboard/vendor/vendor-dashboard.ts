import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

@Component({
  selector: 'app-vendor-dashboard',
  templateUrl: './vendor-dashboard.html',
  styleUrls: ['./vendor-dashboard.scss'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive]
})
export class VendorDashboardComponent implements OnInit {
  userName: string = 'Loading...';
  userRole: string = 'Vendor';
  userProfile: UserProfile | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  async loadUserProfile(): Promise<void> {
    try {
      // Fetch user profile from API
      const profile = await this.http.get<UserProfile>('/api/auth/profile').toPromise();
      this.userProfile = profile ?? null;
      this.userName = this.userProfile?.name || 'User';
      this.userRole = this.userProfile?.role || 'Vendor';
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to default values
      this.userName = 'Vendor User';
      this.userRole = 'Vendor';
    }
  }

  getUserInitials(): string {
    if (!this.userName || this.userName === 'Loading...') {
      return 'U';
    }
    
    const names = this.userName.split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  async logout(): Promise<void> {
    try {
      // Call logout API
      await this.http.post('/api/auth/logout', {}).toPromise();
      
      // Clear local storage or session storage
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');
      
      // Redirect to login page
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
      // Still redirect to login even if API call fails
      this.router.navigate(['/login']);
    }
  }

  // Navigation helper methods
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  navigateToOrders(): void {
    this.router.navigate(['/orders']);
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  // Check if current route is active for conditional styling
  isActiveRoute(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}