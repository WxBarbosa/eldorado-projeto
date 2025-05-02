import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category, Device } from '../../types';

@Component({
  selector: 'app-device-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './device-details.component.html',
})
export class DeviceDetailsComponent implements OnInit {
  device: Device | null = null;
  category: Category | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDevice(parseInt(id));
    }
  }

  loadDevice(id: number): void {
    this.apiService.getDevice(id).subscribe({
      next: (device: Device) => {
        this.device = device;
        if (device.category_id) {
          this.loadCategory(device.category_id);
        }
      },
      error: () => {
        this.router.navigate(['/devices']);
      }
    });
  }

  loadCategory(categoryId: number): void {
    this.apiService.getCategory(categoryId).subscribe({
      next: (category: Category) => {
        this.category = category;
      },
      error: () => {
        this.category = null;
      }
    });
  }

  deleteDevice(): void {
    if (this.device && confirm('Are you sure you want to delete this device?')) {
      this.apiService.deleteDevice(this.device.id).subscribe(() => {
        this.router.navigate(['/devices']);
      });
    }
  }
}