import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Category {
  id: number;
  name: string;
}

interface Device {
  id: number;
  category_id: number;
  color: string;
  part_number: number;
}

@Component({
  selector: 'app-device-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './device-management.component.html',
  styleUrls: ['./device-management.component.css']
})
export class DeviceManagementComponent implements OnInit {
  devices: Device[] = [];
  categories: Category[] = [];
  deviceForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.deviceForm = this.fb.group({
      category_id: ['', Validators.required],
      color: ['', [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-Z]+$')]],
      part_number: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadDevices();
    this.loadCategories();
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  loadDevices(): void {
    this.http.get<Device[]>('/api/devices').subscribe(data => {
      this.devices = data;
    });
  }

  loadCategories(): void {
    this.http.get<Category[]>('/api/categories').subscribe(data => {
      this.categories = data;
    });
  }

  addDevice(): void {
    if (this.deviceForm.valid) {
      this.http.post<Device>('/api/devices', this.deviceForm.value).subscribe(() => {
        this.loadDevices();
        this.deviceForm.reset();
      });
    }
  }

  deleteDevice(id: number): void {
    this.http.delete(`/api/devices/${id}`).subscribe(() => {
      this.loadDevices();
    });
  }
}