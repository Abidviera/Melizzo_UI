import { Component, HostListener, Input } from '@angular/core';
interface NavigationItem {
  label: string;
  route: string;
}
@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
 
    navigationItems = [
    { label: 'Our Launch', route: '' },
    { label: 'Story', route: '/aboutUs' }, 
    { label: 'Coming Soon', route: '' },
    { label: 'Contact', route: '' }
  ];
  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }
}
