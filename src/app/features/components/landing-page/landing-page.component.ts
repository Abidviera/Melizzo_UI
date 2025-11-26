import {
  Component,
  HostListener,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import AOS from 'aos';
import { WhatsAppService } from '../../../services/whats-app.service';
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
}

interface DubaiProduct {
  title: string;
  description: string;
  features: string[];
  image: string;
  images: string[];
}

interface InstagramPost {
  image: string;
  likes: string;
}

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
}
@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent {
  isScrolled = false;
  currentSlide = 0;
  private slideInterval: any;
  private rafId: number | null = null;
  private lastScrollTop = 0;

  slides: Slide[] = [
    {
      title: 'Our First Collection',
      subtitle: 'Kunafa Pistachio & Angel Hair',
      description:
        'A taste of Middle Eastern luxury. Kunafas crispy sweetness and the silky threads of Angel Hair, reimagined in chocolate.',
      image: '/choclate images/kunafaangel2.jpg',
    },
    {
      title: 'Angel Hair White',
      subtitle: 'White Chocolate × Sweet Cotton Candy',
      description:
        'Silky white chocolate fused with fluffy cotton candy for a cloud-soft, melt-in-mouth sweetness.',
      image: 'angelhair.jpg',
    },
    {
      title: 'Kunafa Pistachio',
      subtitle: 'Middle Eastern Excellence',
      description: 'Where tradition meets innovation in every bite',
      image: 'kunafa.jpg',
    },
    {
      title: 'Introducing Melizzo',
      subtitle: 'A New Era of Artisan Chocolate',
      description:
        'Witness the mesmerizing journey of cocoa transformed into pure indulgence — where craftsmanship meets passion.',
      image: 'choclate.mp4',
    },
  ];

  products: Product[] = [
    {
      name: 'Angel Hair White',
      image: '/choclate images/IMG_7906.webp',
      tag: 'New Launch',
    },
    {
      name: 'Kunafa Pistachio',
      image: '/choclate images/IMG_7896.webp',
      tag: 'New Launch',
    },
  ];

  dubaiProducts: DubaiProduct[] = [
    {
      title: 'Kunafa Pistachio Dubai Chocolate',
      description:
        'Indulge in a taste of authentic Middle Eastern luxury. This exquisite chocolate bar combines rich milk chocolate with a creamy pistachio filling and the unique, crispy texture of roasted kunafa pastry. Its a sophisticated treat where creamy, nutty, and crunchy textures meet in perfect harmony.',
      features: [
        'Premium Milk Chocolate',
        'Creamy Pistachio Filling',
        'Crunchy Roasted Kunafa',
        'Visually Appealing',
      ],
      image: 'kunafa.jpg',
      images: [
        'kunafa.jpg',
        '/choclate images/IMG_7896.webp',
        '/choclate images/IMG_7899.webp',
        '/choclate images/IMG_7920.webp',
        '/choclate images/IMG_7918.webp',
        '/choclate images/IMG_7927.webp',
      ],
    },
    {
      title: 'Angel Hair Dubai Chocolate',
      description:
        'Indulge in a delightful fusion of textures. Rich white chocolate is perfectly blended with sweet, fluffy cotton candy and crisp, golden pastry strands, offering a playful contrast between creamy melt and airy crunch. A uniquely luxurious experience.',
      features: [
        'Cotton Candy Infused White Chocolate',
        'Crisp Angel Hair Pastry',
        'Vibrant Pink & Blue Colors',
        'A Perfect Balance of Creamy & Airy Textures',
      ],
      image: 'angelhair.jpg',
      images: [
        'angelhair.jpg',
        '/choclate images/IMG_7906.webp',
        '/choclate images/IMG_7901.webp',
        '/choclate images/IMG_7925.webp',
        '/choclate images/IMG_7923.webp',
        '/choclate images/IMG_7911.webp',
      ],
    },
  ];

  selectedImageIndex: { [key: number]: number } = {};

  instagramPosts: InstagramPost[] = [
    {
      image: '/choclate images/IMG_7901.webp',
      likes: '2.3K',
    },
    {
      image: '/choclate images/IMG_7896.webp',
      likes: '1.9K',
    },
    {
      image: '/choclate images/IMG_7910.webp',
      likes: '3.1K',
    },
    {
      image: '/choclate images/IMG_7899.webp',
      likes: '2.7K',
    },
    {
      image: '/choclate images/IMG_7925.webp',
      likes: '2.1K',
    },
    {
      image: '/choclate images/IMG_7906.webp',
      likes: '1.8K',
    },
  ];

  blogPosts: BlogPost[] = [
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
      image: 'kunafa.jpg',
      readTime: '6 min read',
    },
    {
      title: 'Coming Soon: More Artisan Delights',
      excerpt:
        'Get a sneak peek at our upcoming products including brownies, pancakes, and other packed food innovations.',
      image: 'angelhair.jpg',
      readTime: '4 min read',
    },
  ];

  upcomingProducts = [
    {
      name: 'Artisan Brownies',
      description: 'Rich, fudgy, and decadent',
      icon: '🍫',
      status: 'Coming Soon',
    },
    {
      name: 'Gourmet Pancakes',
      description: 'Fluffy and irresistible',
      icon: '🥞',
      status: 'Coming Soon',
    },
    {
      name: 'More Surprises',
      description: 'Stay tuned for more',
      icon: '✨',
      status: 'Coming Soon',
    },
  ];

  navigationItems = [
    { label: 'Our Launch', route: '' },
    { label: 'Our Story', route: '/aboutUs' },
    { label: 'Coming Soon', route: '' },
    { label: 'Contact', route: '/contact' },
  ];

  footerColumns = [
    {
      title: 'Shop',
      links: ['New Launch', 'Gift Sets', 'Corporate Gifting', 'Pre-Order'],
    },
    {
      title: 'About',
      links: ['Our Story', 'Craftsmanship', 'Vision', 'Press'],
    },
    { title: 'Support', links: ['Contact', 'Shipping', 'Returns', 'FAQ'] },
    {
      title: 'Contact',
      links: [
        'info@melizzo.com',
        '+1 705 927-0127',
        '525 Macintosh Grove',
        'Peterborough, ON K9H 0K1',
      ],
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
        'Melizzo Ltd. has successfully met all Canadian regulatory requirements for importing and distributing food products. We hold the necessary food license and CFIA certifications, ensuring every product meets the highest standards of quality, safety, and legal compliance.',
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
    'https://images.unsplash.com/photo-1646082192921-272df4780996?w=800&q=80',
    'https://images.unsplash.com/photo-1714102367897-4a19259feb75?w=800&q=80',
    'cover.jpg',
  ];

  corporateGiftImages = [
    '/choclate images/IMG_7896.webp',
    '/choclate images/IMG_7906.webp',
    '/choclate images/IMG_7899.webp',
    '/choclate images/IMG_7901.webp',
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private whatsappService: WhatsAppService
  ) {}

  ngOnInit(): void {
    this.startSlideshow();

  
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

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        AOS.refresh();
      }, 150);
    });
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
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

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
      this.cdr.detectChanges();
    }, 5000);
  }

  stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  setSlide(index: number): void {
    this.currentSlide = index;
    this.cdr.detectChanges();
  }

  getCurrentSlide(): Slide {
    return this.slides[this.currentSlide];
  }

  isSlideActive(index: number): boolean {
    return index === this.currentSlide;
  }

  isImage(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    const lowerUrl = url.toLowerCase();

    if (videoExtensions.some((ext) => lowerUrl.includes(ext))) {
      return false;
    }
    if (imageExtensions.some((ext) => lowerUrl.includes(ext))) {
      return true;
    }
    return !lowerUrl.includes('video') && !lowerUrl.includes('mp4');
  }

  isVideo(url: string): boolean {
    return !this.isImage(url);
  }

  getSelectedImage(productIndex: number, product: DubaiProduct): string {
    const index = this.selectedImageIndex[productIndex] || 0;
    return product.images[index];
  }

  selectProductImage(productIndex: number, imageIndex: number): void {
    this.selectedImageIndex[productIndex] = imageIndex;
    this.cdr.detectChanges();
  }

  prevImage(productIndex: number, product: DubaiProduct): void {
    const currentIndex = this.selectedImageIndex[productIndex] || 0;
    const newIndex =
      currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    this.selectedImageIndex[productIndex] = newIndex;
    this.cdr.detectChanges();
  }

  nextImage(productIndex: number, product: DubaiProduct): void {
    const currentIndex = this.selectedImageIndex[productIndex] || 0;
    const newIndex = (currentIndex + 1) % product.images.length;
    this.selectedImageIndex[productIndex] = newIndex;
    this.cdr.detectChanges();
  }

  trackByIndex(index: number): number {
    return index;
  }

  prevSlide(): void {
    this.stopSlideshow();
    this.currentSlide =
      this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
    this.startSlideshow();
    this.cdr.detectChanges();
  }

  nextSlide(): void {
    this.stopSlideshow();
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.startSlideshow();
    this.cdr.detectChanges();
  }


  orderDubaiProduct(product: DubaiProduct): void {
    this.whatsappService.sendProductInquiry({
      name: product.title,
      description: product.description,
      image: product.image,
      price: 'Please inquire', 
    });
  }


  orderProduct(product: Product): void {
    this.whatsappService.sendProductInquiry({
      name: product.name,
      description: `${product.tag} - Premium Dubai Chocolate`,
      image: product.image,
    });
  }


  discoverLaunch(): void {
    const message = `Hello Melizzo! 👋\n\nI saw your launch collection and I'm very interested!\n\nCould you tell me more about:\n• Kunafa Pistachio\n• Angel Hair Dubai Chocolate\n\nThank you! 😊`;
    this.whatsappService.sendCustomMessage(message);
  }


  orderLimitedEdition(): void {
    this.whatsappService.sendProductInquiry({
      name: 'Christmas Gift Collection',
      description:
        'Exclusive Christmas collection featuring handcrafted chocolates inspired by traditional Middle Eastern flavors - 24-piece luxury assortment with premium gold packaging',
      price: 'Contact for pricing',
    });
  }


  requestCorporateQuote(): void {
    const message = `Hello Melizzo! 👋\n\nI'm interested in Corporate Gifting for my company.\n\nPlease provide information about:\n• Custom branding & packaging\n• Bulk order discounts\n• Minimum order quantities\n• Delivery timeline\n\nThank you! 😊`;
    this.whatsappService.sendCustomMessage(message);
  }

  notifyMe(): void {
    const message = `Hello Melizzo! 👋\n\nI'd like to be notified when you launch new products!\n\nI'm particularly interested in:\n• Artisan Brownies\n• Gourmet Pancakes\n• Other upcoming delights\n\nPlease add me to your notification list.\n\nThank you! 😊`;
    this.whatsappService.sendCustomMessage(message);
  }
}
