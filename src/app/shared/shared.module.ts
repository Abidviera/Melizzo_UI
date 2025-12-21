import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { CheckoutSidebarComponent } from './components/checkout-sidebar/checkout-sidebar.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastNotificationComponent } from './components/toast-notification/toast-notification.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    CheckoutSidebarComponent,
    ToastNotificationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    CheckoutSidebarComponent,
    ToastNotificationComponent
  ]
})
export class SharedModule { }
