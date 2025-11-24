import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
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
