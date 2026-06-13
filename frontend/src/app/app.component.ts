import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, Event, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  template: `
    <app-header *ngIf="showHeader" />
    <router-outlet />
  `
})
export class AppComponent implements OnInit {
  showHeader = false;

  private readonly hiddenRoutes = ['/register', '/login', '/forgot-password', '/reset-password', '/reset-success'];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.showHeader = !this.hiddenRoutes.includes(event.urlAfterRedirects);
      }
    });
  }
}
