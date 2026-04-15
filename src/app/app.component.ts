import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ToastNotificationComponent } from './shared/components/toast-notification/toast-notification.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastNotificationComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  showHeader = true;
  showFooter = true;

  constructor(private router: Router) {
    // Optimize navigation detection
    this.router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: any) => {
        const hideRoutes = ['/', '/'];
        const currentUrl = event.url;

        const shouldHide =
          hideRoutes.includes(currentUrl) ||
          currentUrl === '' ||
          currentUrl === '/' ||
          currentUrl.startsWith('/website');

        this.showHeader = !shouldHide;
        this.showFooter = !shouldHide;
      });
  }

  ngOnInit(): void {
    // Smooth scroll to top on route change
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
  }
}
