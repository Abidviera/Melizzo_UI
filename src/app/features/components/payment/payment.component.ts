import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import * as AOS from 'aos';

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

interface Collection {
  id: string;
  title: string;
  image: string;
  category: string;
}

interface Product {
  name: string;
  price: string;
  image: string;
  tag: string;
}

interface DubaiProduct {
  title: string;
  description: string;
  features: string[];
  price: string;
  image: string;
  images: string[];
}

interface TimelineStep {
  step: string;
  title: string;
  description: string;
  icon: string;
}

interface InstagramPost {
  image: string;
  likes: string;
  comments: string;
}

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  image: string;
}

interface BlogPost {
  title: string;
  excerpt: string;
  image: string;
  readTime: string;
}

@Component({
  selector: 'app-payment',
  standalone: false,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss',
})
export class PaymentComponent implements OnInit, OnDestroy {
  isScrolled = false;
  currentSlide = 0;
  activeFilter = 'all';
  private slideInterval: any;
  pulseState: 'pulse1' | 'pulse2' = 'pulse1';

  slides: Slide[] = [
    {
      title: 'Angel Hair White',
      subtitle: 'White Chocolate × Sweet Cotton Candy',
      description:
        'Silky white chocolate fused with fluffy cotton candy for a cloud-soft, melt-in-mouth sweetness.',
      image: 'angelhair.jpg',
    },
    {
      title: 'The Art in Motion',
      subtitle: 'From Bean to Bliss',
      description:
        'Witness the mesmerizing journey of cocoa transformed into pure indulgence — where craftsmanship meets passion.',
      image: 'choclate.mp4',
    },
    {
      title: 'Dubai Collection',
      subtitle: 'Middle Eastern Excellence',
      description: 'Where tradition meets innovation',
      image: 'kunafa.jpg',
    },
    {
      title: 'Expert craftsmanship',
      subtitle: 'Crafted to Perfection',
      description: 'Every piece tells a story',
      image: 'cover.jpg',
    },
    {
      title: 'Dubai Collection',
      subtitle: 'Kunafa Pistachio & Angel Hair',
      description:
        'A taste of Middle Eastern luxury. Kunafas crispy sweetness and the silky threads of Angel Hair, reimagined in chocolate.',
      image: '/choclate images/kunafaangel.jpg',
    },
    {
      title: 'Gift the Extraordinary',
      subtitle: 'Crafted to Perfection',
      description: 'Create unforgettable moments with our exquisite gift sets',
      image:
        'https://images.unsplash.com/photo-1629610306962-a8aa73153d0e?w=1920&q=80',
    },
  ];

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

  collections: Collection[] = [
    {
      id: 'kunafa-pistachio',
      title: 'Kunafa Pistachio Dubai Chocolate',
      image: '/choclate images/IMG_7899.JPG',
      category: 'pistachio',
    },
    {
      id: 'angel-hair',
      title: 'Angel Hair Dubai Chocolate',
      image: '/choclate images/IMG_7911.JPG',
      category: 'special',
    },
  ];

  products: Product[] = [
    {
      name: 'Angel Hair White',
      price: '89',
      image: '/choclate images/IMG_7906.JPG',
      tag: 'Signature',
    },
    {
      name: 'Kunafa Pistachio',
      price: '125',
      image: '/choclate images/IMG_7896.JPG',
      tag: 'Premium',
    },
  ];

    getSelectedImage(productIndex: number, product: DubaiProduct): string {
    const index = this.selectedImageIndex[productIndex] || 0;
    return product.images[index];
  }

   selectProductImage(productIndex: number, imageIndex: number): void {
    this.selectedImageIndex[productIndex] = imageIndex;
  }
  


  prevImage(productIndex: number, product: DubaiProduct): void {
    const currentIndex = this.selectedImageIndex[productIndex] || 0;
    const newIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    this.selectedImageIndex[productIndex] = newIndex;
  }

  nextImage(productIndex: number, product: DubaiProduct): void {
    const currentIndex = this.selectedImageIndex[productIndex] || 0;
    const newIndex = (currentIndex + 1) % product.images.length;
    this.selectedImageIndex[productIndex] = newIndex;
  }
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
      price: '145',
      image: 'kunafa.jpg',
      images: [
        'kunafa.jpg',
        '/choclate images/IMG_7896.JPG',
        '/choclate images/IMG_7899.JPG',
        '/choclate images/IMG_7920.JPG',
        '/choclate images/IMG_7918.JPG',
        '/choclate images/IMG_7927.JPG'
      ]
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
      price: '135',
      image: 'angelhair.jpg',
      images: [
        'angelhair.jpg',
        '/choclate images/IMG_7906.JPG',
        '/choclate images/IMG_7901.JPG',
        '/choclate images/IMG_7925.JPG',
        '/choclate images/IMG_7923.JPG',
        '/choclate images/IMG_7911.JPG',
      ]
    },
  ];

  selectedImageIndex: { [key: number]: number } = {};

  timelineSteps: TimelineStep[] = [
    {
      step: '01',
      title: 'Bean Selection',
      description:
        'We source only the finest cacao beans from sustainable farms across Ecuador, Ghana, and Madagascar. Each bean is hand-selected for its unique flavor profile and quality.',
      icon: '🌱',
    },
    {
      step: '02',
      title: 'Artisan Roasting',
      description:
        "Our master chocolatiers carefully roast each batch to perfection, unlocking complex flavor notes. Temperature and timing are meticulously controlled to bring out the chocolate's full potential.",
      icon: '🔥',
    },
    {
      step: '03',
      title: 'Grinding & Conching',
      description:
        'The beans are ground into a smooth liquid chocolate. Through our conching process, we refine the texture for up to 72 hours, creating an unparalleled silky finish.',
      icon: '⚙️',
    },
    {
      step: '04',
      title: 'Tempering',
      description:
        'Precise temperature control during tempering ensures our chocolate has that perfect snap and glossy finish. This delicate process is where science meets artistry.',
      icon: '🌡️',
    },
    {
      step: '05',
      title: 'Handcrafting',
      description:
        'Every piece is hand-crafted by our artisans. From truffles to bars, each creation receives individual attention and care, ensuring absolute perfection.',
      icon: '✨',
    },
    {
      step: '06',
      title: 'Quality Inspection',
      description:
        'Each chocolate undergoes rigorous quality checks. We taste, examine, and ensure that only perfection makes it to our collection.',
      icon: '🔍',
    },
  ];

  instagramPosts: InstagramPost[] = [
    {
      image: '/choclate images/IMG_7901.JPG',
      likes: '2.3K',
      comments: '455',
    },
    {
      image: '/choclate images/IMG_7896.JPG',
      likes: '1.9K',
      comments: '56',
    },
    {
      image: '/choclate images/IMG_7910.JPG',
      likes: '3.1K',
      comments: '566',
    },
    {
      image:
        'https://images.unsplash.com/photo-1587132164684-cfd0b8214d8e?w=600&q=80',
      likes: '2.7K',
      comments: '45',
    },
    {
      image:
        'https://images.unsplash.com/photo-1634303316622-33b4d64f1f65?w=600&q=80',
      likes: '2.1K',
      comments: '4',
    },
    {
      image: '/choclate images/IMG_7906.JPG',
      likes: '1.8K',
      comments: '23',
    },
  ];

  testimonials: Testimonial[] = [
    {
      name: 'Sara A.',
      location: 'Dubai',
      quote:
        'Each bite feels like luxury — the flavors are perfectly balanced and absolutely divine.',
      image:
        'https://images.unsplash.com/photo-1595956936239-4cad0fa009e6?w=400&q=80',
    },
    {
      name: 'Rami K.',
      location: 'Abu Dhabi',
      quote:
        'The Kunafa Pistachio Chocolate is genius — a beautiful fusion of East and West.',
      image:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
      name: 'Layla M.',
      location: 'Sharjah',
      quote:
        'Exceptional quality and presentation. These chocolates make the perfect gift every time.',
      image:
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    },
  ];

  blogPosts: BlogPost[] = [
    {
      title: 'The Difference Between Cocoa and Cacao',
      excerpt:
        'Discover the fascinating journey from cacao bean to cocoa powder and why it matters for chocolate quality.',
      image:
        'https://images.unsplash.com/photo-1714102367897-4a19259feb75?w=800&q=80',
      readTime: '5 min read',
    },
    {
      title: 'Why Bean Origin Matters in Chocolate Flavor',
      excerpt:
        'Explore how terroir influences chocolate taste, from the rainforests of Ecuador to the farms of Madagascar.',
      image:
        'https://images.unsplash.com/photo-1634303316622-33b4d64f1f65?w=800&q=80',
      readTime: '7 min read',
    },
    {
      title: 'The Secret Behind Chocolate Tempering',
      excerpt:
        'Uncover the science and artistry of tempering that gives chocolate its signature snap and shine.',
      image:
        'https://images.unsplash.com/photo-1646082192921-272df4780996?w=800&q=80',
      readTime: '6 min read',
    },
  ];

  filters = ['pistachio', 'special'];
  navigationItems = ['Collections', 'Artisan', 'Story', 'Contact'];
  footerColumns = [
    {
      title: 'Shop',
      links: ['Collections', 'New Arrivals', 'Gift Sets', 'Corporate'],
    },
    {
      title: 'About',
      links: ['Our Story', 'Artisans', 'Sustainability', 'Press'],
    },
    { title: 'Support', links: ['Contact', 'Shipping', 'Returns', 'FAQ'] },
  ];

  signatureCreations = [
    {
      name: 'Kunafa Pistachio Delight',
      description: 'Golden kunafa meets silky chocolate',
      image:
        'https://images.unsplash.com/photo-1729875749042-695a49842f6e?w=600&q=80',
    },
    {
      name: 'Arabic Coffee Crunch',
      description: 'Bold coffee fusion with milk chocolate',
      image:
        'https://images.unsplash.com/photo-1587132164684-cfd0b8214d8e?w=600&q=80',
    },
    {
      name: 'Rose & Almond Harmony',
      description: 'Fragrant rose petals and crunchy almonds',
      image:
        'https://images.unsplash.com/photo-1644766532391-e5fc3ed1bbb0?w=600&q=80',
    },
    {
      name: 'Dark 70% Classic',
      description: 'Pure, intense, and unforgettable',
      image:
        'https://images.unsplash.com/photo-1758191443045-da47b43f5a89?w=600&q=80',
    },
  ];

  sustainabilityFeatures = [
    {
      icon: '🌍',
      title: 'Fair Trade Partnerships',
      description:
        'We work directly with sustainable farms across Ghana, Ecuador, and Madagascar, ensuring fair wages and ethical practices.',
    },
    {
      icon: '♻️',
      title: 'Eco-Friendly Packaging',
      description:
        'All our packaging is recyclable and biodegradable, minimizing environmental impact without compromising luxury.',
    },
    {
      icon: '🤝',
      title: 'Community Growth',
      description:
        'Supporting farming communities with education, healthcare, and infrastructure for long-term prosperity.',
    },
  ];

  workshopImages = [
    'https://images.unsplash.com/photo-1646082192921-272df4780996?w=800&q=80',
    'https://images.unsplash.com/photo-1714102367897-4a19259feb75?w=800&q=80',
    'cover.jpg',
  ];

  corporateGiftImages = [
    'https://images.unsplash.com/photo-1629610306962-a8aa73153d0e?w=400&q=80',
    'https://images.unsplash.com/photo-1624717130568-a0b177f4ea9f?w=400&q=80',
    'https://images.unsplash.com/photo-1729875749042-695a49842f6e?w=400&q=80',
    'https://images.unsplash.com/photo-1644766532391-e5fc3ed1bbb0?w=400&q=80',
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

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  get filteredCollections(): Collection[] {
    if (this.activeFilter === 'all') {
      return this.collections;
    }
    return this.collections.filter(
      (item) => item.category === this.activeFilter
    );
  }

  getCurrentSlide(): Slide {
    return this.slides[this.currentSlide];
  }

  isSlideActive(index: number): boolean {
    return index === this.currentSlide;
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackById<T extends { id?: string }>(
    index: number,
    item: T
  ): string | number {
    return item.id || index;
  }

  isEven(index: number): boolean {
    return index % 2 === 0;
  }

  isOdd(index: number): boolean {
    return index % 2 === 1;
  }
}
