import { Component, signal, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { FooterComponent } from './shared/components/footer/footer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent implements OnInit {
  protected readonly title = signal('smartLaundry-client');
  showNavbar = signal(true);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateNavbarVisibility(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateNavbarVisibility(event.urlAfterRedirects);
    });
  }

  private updateNavbarVisibility(url: string): void {
    // Extract the path from the URL, removing query params and fragments
    const path = url.split('?')[0].split('#')[0];
    if (path.startsWith('/client-dashboard') || path.startsWith('/vendor-dashboard')) {
      this.showNavbar.set(false);
    } else {
      this.showNavbar.set(true);
    }
  }
}

export const App = AppComponent;
