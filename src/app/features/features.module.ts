import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeaturesRoutingModule } from './features-routing.module';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { SharedModule } from '../shared/shared.module';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { PaymentComponent } from './components/payment/payment.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ContactComponent } from './components/contact/contact.component';


@NgModule({
  declarations: [
    LandingPageComponent,
    ProductPageComponent,
    PaymentComponent,
    AboutUsComponent,
    ContactComponent
  ],
  imports: [
    CommonModule,
    FeaturesRoutingModule,
    SharedModule,
    FormsModule 
  ]
})
export class FeaturesModule { }
