import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as AOS from 'aos';
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
      icon: '',
      status: 'Coming Soon',
    },
    {
      name: 'Gourmet Pancakes',
      description: 'Fluffy and irresistible',
      icon: '',
      status: 'Coming Soon',
    },
    {
      name: 'More Surprises',
      description: 'Stay tuned for more',
      icon: '',
      status: 'Coming Soon',
    },
  ];

  navigationItems = [
  { label: 'Our Launch', route: '/our-launch' },
  { label: 'Story', route: '/aboutUs' }, 
  { label: 'Coming Soon', route: '/coming-soon' },
  { label: 'Contact', route: '/contact' }
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

  ngOnInit(): void {
    this.startSlideshow();
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      mirror: false,
      offset: 100,
      delay: 0,
      anchorPlacement: 'top-bottom',
      disable: false,
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      AOS.refresh();
    }, 500);
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  startSlideshow(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 5000);
  }

  stopSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  setSlide(index: number): void {
    this.currentSlide = index;
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
  }

  prevImage(productIndex: number, product: DubaiProduct): void {
    const currentIndex = this.selectedImageIndex[productIndex] || 0;
    const newIndex =
      currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    this.selectedImageIndex[productIndex] = newIndex;
  }

  nextImage(productIndex: number, product: DubaiProduct): void {
    const currentIndex = this.selectedImageIndex[productIndex] || 0;
    const newIndex = (currentIndex + 1) % product.images.length;
    this.selectedImageIndex[productIndex] = newIndex;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
