import { Routes } from '@angular/router';
import { CategoryManagementComponent } from './category-management/category-management.component';
import { DeviceManagementComponent } from './device-management/device-management.component';
import { CategoryFormComponent } from './category-management/category-form/category-form.component';
import { CategoryDetailsComponent } from './category-management/category-details/category-details.component';
import { DeviceFormComponent } from './device-management/device-form/device-form.component';
import { DeviceDetailsComponent } from './device-management/device-details/device-details.component';

export const routes: Routes = [
  { path: 'categories', component: CategoryManagementComponent },
  { path: 'categories/new', component: CategoryFormComponent },
  { path: 'categories/:id', component: CategoryDetailsComponent },
  { path: 'categories/:id/edit', component: CategoryFormComponent },
  { path: 'devices', component: DeviceManagementComponent },
  { path: 'devices/new', component: DeviceFormComponent },
  { path: 'devices/:id', component: DeviceDetailsComponent },
  { path: 'devices/:id/edit', component: DeviceFormComponent },
  { path: '', redirectTo: 'categories', pathMatch: 'full' }
];
