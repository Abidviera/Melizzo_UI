import {
  Component,
  HostListener,
  ChangeDetectorRef,
  NgZone,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import AOS from 'aos';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WhatsAppService } from '../../../services/whats-app.service';

interface ChristmasProduct {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  images: string[];
  price: number;
  originalPrice?: number;
  includes: string[];
}

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface Product {
  name: string;
  image: string;
  tag: string;
  price: number;
  id: string;
  description: string;
}

interface DubaiProduct {
  id: string;
  title: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
  price: number;
}

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {
  showScrollToTop = false;
  private lastScrollTime = 0;
  private scrollThrottle = 100;
  private isBrowser: boolean;
  @ViewChild('heroVideo') heroVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('sustainabilityGrid') sustainabilityGrid!: ElementRef;
  currentSustainabilityIndex = 0;
  sustainabilityProgress = 0;
  showScrollHint = true;
  private scrollHintTimer: any;

  isScrolled = false;
  isMobileMenuOpen = false;
  cartItemCount = 0;

  currentSlide = 0;
  private slideInterval: any;

  selectedImageIndex: { [key: number]: number } = {};

  christmasProduct: ChristmasProduct = {
    id: 'christmas-festive-combo-2024',
    title: 'Christmas Gift Collection',
    subtitle: 'Dubai Chocolate Festive Combo Pack',
    description:
      'A refined Dubai Chocolate ensemble crafted especially for the season of gifting. Featuring 2 Pistachio Kunafa and 2 Angel Hair White Dubai chocolates in premium festive packaging.',
    features: [
      '4-piece luxury combo pack',
      '2 × Pistachio Kunafa Dubai Chocolate',
      '2 × Angel Hair White Dubai Chocolate',
      'Premium festive packaging',
      'Perfect for holiday gifting',
      'Limited seasonal edition',
    ],
    images: ['chris.jpg', 'chris1.jpg', 'chris2.png', 'chris3.png'],
    price: 55.9,
    originalPrice: 59.9,
    includes: [
      'Pistachio Kunafa: Milk chocolate, pistachio cream, roasted kunafa, emulsifiers, and permitted colors. Contains dairy, nuts, soy, gluten; may contain peanuts or sesame.',
      'Angel Hair White: White chocolate, sweet cotton candy, emulsifier, flavors, and approved colors. Contains dairy, gluten, soy. May contain traces of nuts, peanuts, sesame.',
    ],
  };

  currentChristmasImageIndex = 0;
  private christmasSlideInterval: any;

  slides: Slide[] = [
     {
      title: 'Introducing Melizzo',
      subtitle: 'A New Era of Artisan Chocolate',
      description:
        'Witness the mesmerizing journey of cocoa transformed into pure indulgence — where craftsmanship meets passion.',
      image: 'melizzopromo.mp4',
    },
    {
      title: 'Our First Collection',
      subtitle: 'Kunafa Pistachio & Angel Hair',
      description:
        'A taste of Middle Eastern luxury. Kunafas crispy sweetness and the silky threads of Angel Hair, reimagined in chocolate.',
      image: '/choclate images/kunafaangel.webp',
    },
    {
      title: 'Angel Hair White',
      subtitle: 'White Chocolate × Sweet Cotton Candy',
      description:
        'Silky white chocolate fused with fluffy cotton candy for a cloud-soft, melt-in-mouth sweetness.',
      image: 'angelhair.webp',
    },
     {
      title: 'Angel Hair White',
      subtitle: 'A Visual Treat in Motion',
      description:
        'Watch our Angel Hair White Chocolate come alive — silky white chocolate blended with sweet cotton candy and delicate angel hair strands, crafted to mesmerize every sense.',
      image: 'angelHairWhitevideo.mp4',
    },
    {
      title: 'Kunafa Pistachio',
      subtitle: 'Middle Eastern Excellence',
      description: 'Where tradition meets innovation in every bite',
      image: 'kunafa.webp',
    },

  ];

  products: Product[] = [
    {
      id: 'angel-hair-white',
      name: 'Angel Hair White',
      image: '/choclate images/IMG_7906.webp',
      tag: 'New Launch',
      price: 13.99,
      description:
        'Silky white chocolate with fluffy cotton candy and crisp angel hair pastry',
    },
    {
      id: 'kunafa-pistachio',
      name: 'Kunafa Pistachio',
      image: '/choclate images/IMG_7896.webp',
      tag: 'New Launch',
      price: 13.99,
      description:
        'Premium milk chocolate with creamy pistachio filling and roasted kunafa',
    },
  ];

  dubaiProducts: DubaiProduct[] = [
    {
      id: 'kunafa-pistachio-dubai',
      title: 'Kunafa Pistachio Dubai Chocolate',
      description:
        'Indulge in a taste of authentic Middle Eastern luxury. This exquisite chocolate bar combines rich milk chocolate with a creamy pistachio filling and the unique, crispy texture of roasted kunafa pastry.',
      features: [
        'Premium Milk Chocolate',
        'Creamy Pistachio Filling',
        'Crunchy Roasted Kunafa',
        'Visually Appealing',
      ],
      image: 'kunafa.webp',
      images: [
        'kunafa.webp',
        '/choclate images/IMG_7896.webp',
        '/choclate images/IMG_7899.webp',
        '/choclate images/IMG_7920.webp',
        '/choclate images/IMG_7918.webp',
        '/choclate images/IMG_7927.webp',
      ],
      price: 13.99,
    },
    {
      id: 'angel-hair-dubai',
      title: 'Angel Hair Dubai Chocolate',
      description:
        'Indulge in a delightful fusion of textures. Rich white chocolate is perfectly blended with sweet, fluffy cotton candy and crisp, golden pastry strands.',
      features: [
        'Cotton Candy Infused White Chocolate',
        'Crisp Angel Hair Pastry',
        'Vibrant Pink & Blue Colors',
        'A Perfect Balance of Creamy & Airy Textures',
      ],
      image: 'angelhair.webp',
      images: [
        'angelhair.webp',
        '/choclate images/IMG_7906.webp',
        '/choclate images/IMG_7901.webp',
        '/choclate images/IMG_7925.webp',
        '/choclate images/IMG_7923.webp',
        '/choclate images/IMG_7911.webp',
      ],
      price: 13.99,
    },
  ];

  instagramPosts = [
    { image: '/choclate images/IMG_7901.webp', likes: '2.3K' },
    { image: '/choclate images/IMG_7896.webp', likes: '1.9K' },
    { image: '/choclate images/IMG_7910.webp', likes: '3.1K' },
    { image: '/choclate images/mixed.webp', likes: '2.7K' },
    { image: '/choclate images/IMG_7925.webp', likes: '2.1K' },
    { image: '/choclate images/IMG_7906.webp', likes: '1.8K' },
  ];


playCurrentVideo(): void {
  if (!this.isBrowser) return;

  this.ngZone.runOutsideAngular(() => {
    setTimeout(() => {
      const currentSlide = this.slides[this.currentSlide];
      if (this.isVideo(currentSlide.image)) {
        const videoElement = document.querySelector('.hero-slide.active video') as HTMLVideoElement;
        if (videoElement) {
          // Reset video to start
          videoElement.currentTime = 0;

          // Attempt to play
          const playPromise = videoElement.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                // Video started successfully
                console.log('Video playing successfully');
              })
              .catch((error) => {
                // Autoplay was prevented
                console.warn('Video autoplay prevented:', error);
                // Optionally: show a play button overlay for user interaction
              });
          }
        }
      }
    }, 100); // Small delay to ensure DOM is ready
  });
}

getSlideDuration(): number {
  const currentSlide = this.slides[this.currentSlide];
  return this.isVideo(currentSlide.image) ? 15000 : 5000; // 15s for video, 5s for image
}

  blogPosts = [
    {
      title: 'The Art of Dubai Chocolate',
      excerpt:
        'Discover what makes Dubai chocolate unique and why our handcrafted creations are taking the world by storm.',
      image: '/choclate images/IMG_7896.webp',
      readTime: '5 min read',
    },
    {
      title: 'Kunafa Meets Chocolate',
      excerpt:
        'The fascinating story behind our signature Kunafa Pistachio chocolate and the traditional flavors that inspired it.',
      image: 'kunafa.webp',
      readTime: '6 min read',
    },
    {
      title: 'Coming Soon: More Artisan Delights',
      excerpt:
        'Get a sneak peek at our upcoming products including brownies, pancakes, and other packed food innovations.',
      image: 'angelhair.webp',
      readTime: '4 min read',
    },
  ];

  upcomingProducts = [
    {
      name: 'Something Sweet',
      description: 'Rich, indulgent, unforgettable',
      icon: '🎁',
      status: 'Mystery Awaits',
    },
    {
      name: 'Something Fluffy',
      description: 'Light, delightful, irresistible',
      icon: '✨',
      status: 'Coming Soon',
    },
    {
      name: 'Something Magical',
      description: 'Beyond your imagination',
      icon: '🌟',
      status: 'Stay Tuned',
    },
  ];

  sustainabilityFeatures = [
    {
      icon: '🌍',
      title: 'Quality First',
      description:
        'We source only the finest ingredients from trusted suppliers, ensuring every product meets our high standards.',
    },
    {
      icon: '✓',
      title: 'Canadian Regulatory Compliance',
      description:
        'Melizzo Ltd. has successfully met all Canadian regulatory requirements for importing and distributing food products.',
    },
    {
      icon: '♻️',
      title: 'Sustainable Packaging',
      description:
        'Our packaging is designed to be both luxurious and environmentally responsible, using recyclable materials.',
    },
    {
      icon: '🤝',
      title: 'Community Focus',
      description:
        'Built on the foundation of bringing people together through exceptional artisan food experiences.',
    },
  ];

  workshopImages = [
    '/choclate images/choclateBean.webp',
    '/choclate images/choclatemaking.webp',
    '/choclate images/beanwithmelizzo.webp',
  ];

  corporateGiftImages = [
    '/choclate images/IMG_7896.webp',
    '/choclate images/IMG_7906.webp',
    '/choclate images/IMG_7899.webp',
    '/choclate images/IMG_7901.webp',
  ];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private router: Router,
    private whatsappService: WhatsAppService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

 ngOnInit(): void {
  if (!this.isBrowser) return;
  this.startChristmasSlideshow();
  this.checkScroll();
  this.startSlideshow();
  this.initAOS();

  // Play video on initial load
  setTimeout(() => this.playCurrentVideo(), 500);

  this.scrollHintTimer = setTimeout(() => {
    this.showScrollHint = false;
    this.cdr.markForCheck();
  }, 5000);
}
  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => AOS.refresh(), 150);
    });
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
    this.closeMobileMenu();
    if (this.scrollHintTimer) {
      clearTimeout(this.scrollHintTimer);
    }
    this.stopChristmasSlideshow();
  }

  private initAOS(): void {
    if (!this.isBrowser) return;
    const isMobile = window.innerWidth < 768;
    AOS.init({
      duration: 400,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 80,
      delay: 0,
      anchorPlacement: 'top-bottom',
      throttleDelay: 150,
      disable: isMobile,
    });
  }

  // WhatsApp ordering methods
  orderDubaiProduct(product: DubaiProduct): void {
    this.whatsappService.sendProductInquiry({
      name: product.title,
      description: product.description,
      image: product.image,
      price: `CAD ${product.price.toFixed(2)}`,
    });
  }

  orderProduct(product: Product): void {
    this.whatsappService.sendProductInquiry({
      name: product.name,
      description: `${product.tag} - ${product.description}`,
      image: product.image,
      price: `CAD ${product.price.toFixed(2)}`,
    });
  }

  orderChristmasProduct(): void {
    const message = `Hello Melizzo! 👋\n\n`;
    const msg =
      message +
      `I'm interested in ordering:\n\n` +
      `🎄 ${this.christmasProduct.title}\n` +
      `${this.christmasProduct.subtitle}\n\n` +
      `${this.christmasProduct.description}\n\n` +
      `💰 Price: CAD ${this.christmasProduct.price.toFixed(2)}` +
      (this.christmasProduct.originalPrice
        ? ` (Save CAD ${(this.christmasProduct.originalPrice - this.christmasProduct.price).toFixed(2)}!)`
        : '') +
      `\n\n` +
      `Could you please provide more details about:\n` +
      `• Availability\n` +
      `• Delivery options\n` +
      `• Payment methods\n\n` +
      `Thank you! 😊🎄`;

    this.whatsappService.sendCustomMessage(msg);
  }

  notifyLimitedEdition(): void {
    this.orderChristmasProduct();
  }

  discoverLaunch(): void {
    const element = document.getElementById('our-launch');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  requestCorporateQuote(): void {
    const message = `Hello Melizzo! 👋\n\nI'm interested in Corporate Gifting for my company.\n\nPlease provide information about:\n• Custom branding & packaging\n• Bulk order discounts\n• Minimum order quantities\n• Delivery timeline\n\nThank you! 😊`;
    this.whatsappService.sendCustomMessage(message);
  }

  notifyMe(): void {
    const message = `Hello Melizzo! 👋\n\nI'd like to be notified when you launch new products!\n\nI'm particularly interested in:\n• Artisan Brownies\n• Gourmet Pancakes\n• Other upcoming delights\n\nPlease add me to your notification list.\n\nThank you! 😊`;
    this.whatsappService.sendCustomMessage(message);
  }

  openCart(): void {
    this.router.navigate(['/cart']);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    const now = Date.now();
    if (now - this.lastScrollTime < this.scrollThrottle) {
      return;
    }
    this.lastScrollTime = now;
    this.ngZone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const newScrollState = scrollTop > 50;
        const newScrollToTopState = scrollTop > 500;
        if (
          this.isScrolled !== newScrollState ||
          this.showScrollToTop !== newScrollToTopState
        ) {
          this.ngZone.run(() => {
            this.isScrolled = newScrollState;
            this.showScrollToTop = newScrollToTopState;
            this.cdr.markForCheck();
          });
        }
      });
    });
  }

  checkScroll(): void {
    if (!this.isBrowser) return;
    this.isScrolled = window.pageYOffset > 50;
    this.cdr.markForCheck();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;
    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isBrowser) {
      document.body.classList.toggle('mobile-menu-open', this.isMobileMenuOpen);
    }
    this.cdr.markForCheck();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    if (this.isBrowser) {
      document.body.classList.remove('mobile-menu-open');
    }
    this.cdr.markForCheck();
  }

  navigateHome(): void {
    this.router.navigate(['/']);
    this.closeMobileMenu();
  }

  navigateTo(route: string): void {
    if (route) {
      this.router.navigate([route]);
    }
    this.closeMobileMenu();
  }

  startSlideshow(): void {
  if (!this.isBrowser) return;
  this.ngZone.runOutsideAngular(() => {
    const duration = this.getSlideDuration(); // Get duration based on content type
    this.slideInterval = setTimeout(() => {
      this.ngZone.run(() => {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.playCurrentVideo();
        this.startSlideshow(); // Recursively call to get new duration
        this.cdr.markForCheck();
      });
    }, duration);
  });
}

 stopSlideshow(): void {
  if (this.slideInterval) {
    clearTimeout(this.slideInterval); // Changed from clearInterval
    this.slideInterval = null;
  }
}
setSlide(index: number): void {
  this.stopSlideshow();
  this.currentSlide = index;
  this.playCurrentVideo(); // Add this
  this.startSlideshow();
  this.cdr.markForCheck();
}
prevSlide(): void {
  this.stopSlideshow();
  this.currentSlide =
    this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  this.playCurrentVideo(); // Add this
  this.startSlideshow();
  this.cdr.markForCheck();
}

nextSlide(): void {
  this.stopSlideshow();
  this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  this.playCurrentVideo(); // Add this
  this.startSlideshow();
  this.cdr.markForCheck();
}

  getCurrentSlide(): Slide {
    return this.slides[this.currentSlide];
  }

  isSlideActive(index: number): boolean {
    return index === this.currentSlide;
  }

  isImage(url: string): boolean {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return !videoExtensions.some((ext) => url.toLowerCase().includes(ext));
  }

  isVideo(url: string): boolean {
    return !this.isImage(url);
  }

  onSustainabilityScroll(event: Event): void {
    const element = event.target as HTMLElement;
    if (this.showScrollHint) {
      this.showScrollHint = false;
      this.cdr.markForCheck();
    }
    const scrollLeft = element.scrollLeft;
    const scrollWidth = element.scrollWidth - element.clientWidth;
    this.sustainabilityProgress = (scrollLeft / scrollWidth) * 100;
    const cards = element.querySelectorAll('.sustainability-card');
    const containerCenter = element.scrollLeft + element.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Infinity;
    cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;
      const cardCenter = cardElement.offsetLeft + cardElement.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    if (this.currentSustainabilityIndex !== closestIndex) {
      this.currentSustainabilityIndex = closestIndex;
      this.cdr.markForCheck();
    }
  }

  scrollToSustainabilityCard(index: number): void {
    if (!this.sustainabilityGrid) return;
    const grid = this.sustainabilityGrid.nativeElement;
    const cards = grid.querySelectorAll('.sustainability-card');
    if (cards[index]) {
      const card = cards[index] as HTMLElement;
      const scrollLeft =
        card.offsetLeft - (grid.clientWidth - card.offsetWidth) / 2;
      grid.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      this.currentSustainabilityIndex = index;
      this.cdr.markForCheck();
    }
  }

  getSelectedImage(productIndex: number, product: DubaiProduct): string {
    const index = this.selectedImageIndex[productIndex] || 0;
    return product.images[index];
  }

  selectProductImage(productIndex: number, imageIndex: number): void {
    this.selectedImageIndex[productIndex] = imageIndex;
    this.cdr.markForCheck();
  }

  prevImage(productIndex: number, product: DubaiProduct): void {
    const currentIndex = this.selectedImageIndex[productIndex] || 0;
    this.selectedImageIndex[productIndex] =
      currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    this.cdr.markForCheck();
  }

  nextImage(productIndex: number, product: DubaiProduct): void {
    const currentIndex = this.selectedImageIndex[productIndex] || 0;
    this.selectedImageIndex[productIndex] =
      (currentIndex + 1) % product.images.length;
    this.cdr.markForCheck();
  }

  trackByIndex(index: number): number {
    return index;
  }

  scrollToTop(): void {
    if (!this.isBrowser) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  startChristmasSlideshow(): void {
    if (!this.isBrowser) return;
    this.ngZone.runOutsideAngular(() => {
      this.christmasSlideInterval = setInterval(() => {
        this.ngZone.run(() => {
          this.currentChristmasImageIndex =
            (this.currentChristmasImageIndex + 1) %
            this.christmasProduct.images.length;
          this.cdr.markForCheck();
        });
      }, 4000);
    });
  }

  stopChristmasSlideshow(): void {
    if (this.christmasSlideInterval) {
      clearInterval(this.christmasSlideInterval);
      this.christmasSlideInterval = null;
    }
  }

  setChristmasImage(index: number): void {
    this.stopChristmasSlideshow();
    this.currentChristmasImageIndex = index;
    this.startChristmasSlideshow();
    this.cdr.markForCheck();
  }

  prevChristmasImage(): void {
    this.stopChristmasSlideshow();
    this.currentChristmasImageIndex =
      this.currentChristmasImageIndex === 0
        ? this.christmasProduct.images.length - 1
        : this.currentChristmasImageIndex - 1;
    this.startChristmasSlideshow();
    this.cdr.markForCheck();
  }

  nextChristmasImage(): void {
    this.stopChristmasSlideshow();
    this.currentChristmasImageIndex =
      (this.currentChristmasImageIndex + 1) %
      this.christmasProduct.images.length;
    this.startChristmasSlideshow();
    this.cdr.markForCheck();
  }
}
