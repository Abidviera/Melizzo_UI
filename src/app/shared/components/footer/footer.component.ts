import { Component } from '@angular/core';
interface FooterColumn {
  title: string;
  links: string[];
}
@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
 footerColumns: FooterColumn[] = [
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
}
