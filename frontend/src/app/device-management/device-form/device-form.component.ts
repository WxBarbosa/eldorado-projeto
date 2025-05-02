import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category, Device } from '../../types';

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './device-form.component.html',
})
export class DeviceFormComponent implements OnInit {
  deviceForm: FormGroup;
  categories: Category[] = [];
  isEditing = false;
  deviceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.deviceForm = this.fb.group({
      category_id: ['', Validators.required],
      color: ['', [Validators.required, Validators.maxLength(16), Validators.pattern('^[a-zA-Z]+$')]],
      part_number: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.deviceId = parseInt(id);
      this.loadDevice(this.deviceId);
    }
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadDevice(id: number): void {
    this.apiService.getDevice(id).subscribe((device: Device) => {
      this.deviceForm.patchValue(device);
    });
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      const request = this.isEditing
        ? this.apiService.updateDevice(this.deviceId!, this.deviceForm.value)
        : this.apiService.createDevice(this.deviceForm.value);

      request.subscribe(() => {
        this.router.navigate(['/devices']);
      });
    }
  }
}