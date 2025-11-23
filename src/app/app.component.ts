import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showHeader = true;
  showFooter = true;

 constructor(private router: Router) {
  this.router.events.subscribe((event) => {
    if (event instanceof NavigationStart) {
      const hideRoutes = ['/', '/']; // Landing page

      const currentUrl =  event.url;

      if (
        hideRoutes.includes(currentUrl) ||
        currentUrl === '' ||
        currentUrl === '/' ||
        currentUrl.startsWith('/website')
      ) {
        this.showHeader = false;
        this.showFooter = false;
      } else {
        this.showHeader = true;
        this.showFooter = true;
      }
    }
  });
}

}
