import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../services/api.service';
import { Category, Device } from '../types';

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.css']
})
export class DeviceManagementComponent implements OnInit {
  devices: Device[] = [];
  categories: Category[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDevices();
    this.loadCategories();
  }

  loadDevices(): void {
    this.apiService.getDevices().subscribe(data => {
      this.devices = data;
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  deleteDevice(id: number): void {
    if (confirm('Are you sure you want to delete this device?')) {
      this.apiService.deleteDevice(id).subscribe(() => {
        this.loadDevices();
      });
    }
  }
}