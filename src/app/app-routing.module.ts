import { Quote } from '@angular/compiler';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClientComponent } from './client/client.component';
import { VehicleComponent } from './Our-vehicle/vehicle/vehicle.component';
import { ServicesComponent } from './our-services/services/services.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { QuoteComponent } from './quote/quote.component';
import { StaffComponent } from './staff/staff.component';


const routes: Routes = [
  { path:'home', component:HomeComponent},
  { path:'services', component:ServicesComponent},
  { path:'quote', component:QuoteComponent},
  { path: 'invoice', component:InvoiceComponent},
  { path: 'staff', component:StaffComponent},
  { path: 'vehicle', component: VehicleComponent },
  { path: 'client', component: ClientComponent },
  { path:'' ,loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }



