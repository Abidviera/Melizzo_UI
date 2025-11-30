import { ChangeDetectorRef, Component, HostListener, Input, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import AOS from 'aos';

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
   isScrolled = false;
  isMobileMenuOpen = false;
  cartItemCount = 0;

  navigationItems: NavigationItem[] = [
    { label: 'Our Launch', route: '' },
    { label: 'Our Story', route: '/aboutUs' },
    { label: 'Coming Soon', route: '' },
    { label: 'Contact', route: '/contact' },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkScroll();
    this.initAOS();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => AOS.refresh(), 150);
    });
  }

  ngOnDestroy(): void {
    this.cancelAnimationFrame();
    this.closeMobileMenu();
  }

  private initAOS(): void {
    this.ngZone.runOutsideAngular(() => {
      AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        offset: 100,
        delay: 0,
        anchorPlacement: 'top-bottom',
        disable: false,
        throttleDelay: 99,
      });
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.rafId) {
      this.ngZone.runOutsideAngular(() => {
        this.rafId = requestAnimationFrame(() => {
          this.updateScrollState();
          this.rafId = null;
        });
      });
    }
  }

  checkScroll(): void {
    this.isScrolled = window.pageYOffset > 50;
  }

  private updateScrollState(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (Math.abs(scrollTop - this.lastScrollTop) > 5) {
      const newScrollState = scrollTop > 50;
      
      if (this.isScrolled !== newScrollState) {
        this.ngZone.run(() => {
          this.isScrolled = newScrollState;
          this.cdr.detectChanges();
        });
      }
      
      this.lastScrollTop = scrollTop;
    }
  }

  private cancelAnimationFrame(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.toggleBodyScroll();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.enableBodyScroll();
  }

  private toggleBodyScroll(): void {
    document.body.classList.toggle('mobile-menu-open', this.isMobileMenuOpen);
  }

  private enableBodyScroll(): void {
    document.body.classList.remove('mobile-menu-open');
  }

  navigateHome(): void {
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  openSearch(): void {
    console.log('Open search');
  }

  openCart(): void {
    this.router.navigate(['/cart']);
  }

  openAccount(): void {
    this.router.navigate(['/account']);
    this.closeMobileMenu();
  }

  openWishlist(): void {
    this.router.navigate(['/wishlist']);
    this.closeMobileMenu();
  }

  openOrders(): void {
    this.router.navigate(['/orders']);
    this.closeMobileMenu();
  }

  private rafId: number | null = null;
  private lastScrollTop = 0;
}
