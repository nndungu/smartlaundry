import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './vendor-dashboard.html',
  styleUrls: ['./vendor-dashboard.scss']
})
export class VendorDashboardComponent implements OnInit {
  activeSection: string = 'dashboard';
  pageTitle: string = 'Dashboard';
  pageContent: string = '';
  vendorName: string = 'SmartLaundry Vendor';
  sidebarOpen: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.navigateToSection('dashboard');
  }

  navigateToSection(section: string): void {
    this.activeSection = section;

    switch (section) {
      case 'dashboard':
        this.pageTitle = 'Dashboard';
        this.pageContent = 'Dashboard statistics and overview will be shown here.';
        break;
      case 'orders':
        this.router.navigate(['vendor-dashboard/orders']);
        break;
      case 'profile':
        this.router.navigate(['vendor-dashboard/profile']);
        break;
      case 'payments':
        this.router.navigate(['vendor-dashboard/payments']);
        break;
      default:
        this.pageTitle = '';
        this.pageContent = '';
    }
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
