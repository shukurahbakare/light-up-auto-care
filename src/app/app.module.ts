import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import {
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';


import { HeaderComponent } from './layout/header/header.component';
import { SideMenuComponent } from './layout/side-menu/side-menu.component';
// import { ClientComponent } from './client/client.component';
import { AuthHttpInterceptor } from './auth/auth-http-interceptor';
import { InvoiceComponent } from './invoice/invoice.component';
import { StaffComponent } from './our-staff/staff/staff.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './layout/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StaffModalComponent } from './our-staff/staff-modal/staff-modal.component';
import { CapitalizePipe } from './capitalize.pipe';

import { QuotePageComponent } from './quote-page/quote-page.component';
import { AvatarModule } from 'ngx-avatar';
import { NgxPaginationModule } from 'ngx-pagination';
// import { ToastrModule } from 'ngx-toastr';
import { NgHttpLoaderModule } from 'ng-http-loader';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    // ServicesComponent,
    HeaderComponent,
    SideMenuComponent,
    // ClientComponent,
    // VehicleComponent,
 
    FooterComponent,
    InvoiceComponent,
    StaffComponent,
    StaffModalComponent,
    CapitalizePipe,
    QuotePageComponent,
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    // ToastrModule.forRoot(),
    NgHttpLoaderModule.forRoot(),
    AvatarModule,
    NgxPaginationModule

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  // entryComponents: [ModalComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
