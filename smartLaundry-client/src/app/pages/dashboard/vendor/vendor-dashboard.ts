import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vendor-dashboard',
  imports: [CommonModule],
  templateUrl: './vendor-dashboard.html',
  styleUrls: ['./vendor-dashboard.scss']
})
export class VendorDashboardComponent implements OnInit {
  activeSection: string = 'dashboard';
  pageTitle: string = 'Dashboard';
  pageContent: string = '';
  vendorName: string = 'SmartLaundry Vendor';

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
        this.router.navigate(['/orders']);
        break;
      case 'profile':
        this.router.navigate(['/profile']);
        break;
      case 'payments':
        this.router.navigate(['/payments']);
        break;
      default:
        this.pageTitle = '';
        this.pageContent = '';
    }
  }
}
