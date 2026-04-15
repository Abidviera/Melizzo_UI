import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/components/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'ProductPage',
    loadComponent: () => import('./features/components/product-page/product-page.component').then(m => m.ProductPageComponent)
  },
  {
    path: 'i',
    loadComponent: () => import('./features/components/payment/payment.component').then(m => m.PaymentComponent)
  },
  {
    path: 'aboutUs',
    loadComponent: () => import('./features/components/about-us/about-us.component').then(m => m.AboutUsComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/components/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/components/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/components/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'payment',
    loadComponent: () => import('./features/components/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
