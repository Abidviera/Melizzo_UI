import {
  ChangeDetectorRef,
  Component,
  HostListener,
  NgZone,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import AOS from 'aos';
import { CartService } from '../../../services/cart.service';

interface NavigationItem {
  label: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit, OnDestroy {
  isScrolled = false;
  isMobileMenuOpen = false;
  cartItemCount = 0;
  wishlistCount = 0;

  navigationItems: NavigationItem[] = [
    { label: 'Our Launch', route: '' },
    { label: 'Our Story', route: '/aboutUs' },
    { label: 'Coming Soon', route: '' },
    { label: 'Contact', route: '/contact' },
  ];

  private rafId: number | null = null;
  private lastScrollTop = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.checkScroll();
    this.initAOS();
    this.subscribeToCart();
    this.subscribeToWishlist();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => AOS.refresh(), 150);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cancelAnimationFrame();
    this.closeMobileMenu();
  }

  /**
   * Subscribe to cart changes to update cart icon count
   */
  private subscribeToCart(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cartItemCount = this.cartService.getCartItemCount();
        this.cdr.markForCheck();
      });
  }

  /**
   * Subscribe to wishlist changes to update wishlist icon count
   */
  private subscribeToWishlist(): void {
    this.cartService.wishlist$
      .pipe(takeUntil(this.destroy$))
      .subscribe(wishlist => {
        this.wishlistCount = this.cartService.getWishlistCount();
        this.cdr.markForCheck();
      });
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
    this.cdr.markForCheck();
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
    this.cdr.markForCheck();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.enableBodyScroll();
    this.cdr.markForCheck();
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

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    } else {
      // If route is empty, scroll to top of current page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.closeMobileMenu();
  }

  openSearch(): void {
    // TODO: Implement search functionality
    console.log('Search functionality - to be implemented');
    // You can implement a search modal/overlay here
  }

  openCart(): void {
    this.router.navigate(['/cart']);
    this.closeMobileMenu();
  }

  openAccount(): void {
    // TODO: Implement account page
    console.log('Account page - to be implemented');
    // For now, you can redirect to a placeholder or show a message
    this.closeMobileMenu();
  }

  openWishlist(): void {
    // TODO: Implement wishlist page
    console.log('Wishlist page - to be implemented');
    this.closeMobileMenu();
  }

  openOrders(): void {
    // TODO: Implement orders page
    console.log('Orders page - to be implemented');
    this.closeMobileMenu();
  }

  /**
   * Get cart total for display (optional)
   */
  getCartTotal(): number {
    const cart = this.cartService.getCurrentCart();
    return cart ? cart.total : 0;
  }

  /**
   * Check if user has items in cart
   */
  hasCartItems(): boolean {
    return this.cartItemCount > 0;
  }

  /**
   * Check if user has items in wishlist
   */
  hasWishlistItems(): boolean {
    return this.wishlistCount > 0;
  }
}