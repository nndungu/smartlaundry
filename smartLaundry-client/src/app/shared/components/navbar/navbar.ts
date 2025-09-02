import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, Droplet, Menu, X } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent implements OnInit {
  // Icons
  readonly DropletIcon = Droplet;
  readonly MenuIcon = Menu;
  readonly XIcon = X;

  isMobileMenuOpen = false;
  activeItem = 'Home';

  navigationItems = [
    { name: 'Home', route: '/home' },
    { name: 'Services', route: '/services' },
    { name: 'About', route: '/about' },
    { name: 'Contact Us', route: '/contact' },
    { name: 'Sign In', route: '/login' },
    { name: 'Get Started', route: '/register', isButton: true }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.setActiveItemFromRoute();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.toggleBodyScroll();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.enableBodyScroll();
  }

  handleNavClick(item: { name: string, route: string }): void {
    this.activeItem = item.name;
    this.closeMobileMenu();
    this.router.navigate([item.route]);
  }

  private setActiveItemFromRoute(): void {
    const currentRoute = this.router.url;
    const activeItem = this.navigationItems.find(item =>
      item.route === currentRoute || currentRoute.startsWith(item.route)
    );
    if (activeItem) {
      this.activeItem = activeItem.name;
    }
  }

  private toggleBodyScroll(): void {
    document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : 'auto';
  }

  private enableBodyScroll(): void {
    document.body.style.overflow = 'auto';
  }
}
