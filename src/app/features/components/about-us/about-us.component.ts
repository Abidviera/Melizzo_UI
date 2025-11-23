import { Component } from '@angular/core';
import * as AOS from 'aos';
interface AboutFeature {
  icon: string;
  title: string;
  description: string;
}

interface Certification {
  icon: string;
  title: string;
  subtitle: string;
}

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming';
}
@Component({
  selector: 'app-about-us',
  standalone: false,
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
features: AboutFeature[] = [
    {
      icon: '',
      title: 'Passion for Excellence',
      description: 'Every product is crafted with meticulous attention to detail, bringing together the finest ingredients and innovative techniques.'
    },
    {
      icon: '',
      title: 'Innovation Driven',
      description: 'We constantly explore new flavors and concepts, staying ahead of culinary trends to offer unique taste experiences.'
    },
    {
      icon: '',
      title: 'Customer First',
      description: 'Your satisfaction drives everything we do. We\'re committed to delivering products that exceed expectations.'
    }
  ];

  certifications: Certification[] = [
    {
      icon: '🛡️',
      title: 'CFIA Certified',
      subtitle: 'Canadian Food Inspection Agency'
    },
    {
      icon: '✓',
      title: 'Licensed Importer',
      subtitle: 'Full Regulatory Compliance'
    },
    {
      icon: '🏆',
      title: 'Quality Assured',
      subtitle: 'Highest Safety Standards'
    }
  ];

  timelineItems: TimelineItem[] = [
    {
      date: 'JANUARY 2025',
      title: 'Company Founded',
      description: 'Melizzo Ltd. established with a vision to revolutionize artisan food in Canada',
      status: 'active'
    },
    {
      date: 'JANUARY 2025',
      title: 'Product Launch',
      description: 'Introduced our signature Dubai chocolates: Kunafa Pistachio & Angel Hair',
      status: 'active'
    },
    {
      date: '2025 & BEYOND',
      title: 'Expansion',
      description: 'Growing our product line with brownies, pancakes, and more artisan delights',
      status: 'upcoming'
    }
  ];

  ngOnInit(): void {
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
}
