import { Routes } from '@angular/router';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { DeviceManagementComponent } from './device-management/device-management.component';

export const routes: Routes = [
  { path: 'categories', component: CategoryManagementComponent },
  { path: 'devices', component: DeviceManagementComponent },
  { path: '', redirectTo: 'categories', pathMatch: 'full' }
];
