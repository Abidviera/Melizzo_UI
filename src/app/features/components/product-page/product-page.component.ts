import { Component } from '@angular/core';
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  rating: number;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}
@Component({
  selector: 'app-product-page',
  standalone: false,
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent {
quantity: number = 1;
  seasonalWrapping: boolean = false;
  occasionWrapping: boolean = false;
  giftMessage: string = '';
  selectedImage: number = 0;

  productImage: string = 'assets/images/product.png';
  thumbnails: string[] = [
    '/kunafaa.png',
    '/kunafaa.png',
    '/kunafaa.png'
  ];

  incrementQuantity(): void {
    this.quantity++;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  selectImage(index: number): void {
    this.selectedImage = index;
  }

  addToCart(): void {
    console.log('Adding to cart:', {
      quantity: this.quantity,
      seasonalWrapping: this.seasonalWrapping,
      occasionWrapping: this.occasionWrapping,
      giftMessage: this.giftMessage
    });
    // Add your cart logic here
  }
}
