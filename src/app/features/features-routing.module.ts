import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactComponent } from './components/contact/contact.component';

const routes: Routes = [
  {path: '', component:LandingPageComponent },
  {path: 'ProductPage', component:ProductPageComponent },
  {path: 'i', component:PaymentComponent },
  {path: 'aboutUs', component:AboutUsComponent },
  {path: 'contact', component:ContactComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeaturesRoutingModule { }
