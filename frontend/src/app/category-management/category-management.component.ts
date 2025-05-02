import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: any[] = [];
  categoryForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(128)]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.http.get('/api/categories').subscribe((data: any) => {
      this.categories = data;
    });
  }

  addCategory(): void {
    if (this.categoryForm.valid) {
      this.http.post('/api/categories', this.categoryForm.value).subscribe(() => {
        this.loadCategories();
        this.categoryForm.reset();
      });
    }
  }

  deleteCategory(id: number): void {
    this.http.delete(`/api/categories/${id}`).subscribe(() => {
      this.loadCategories();
    });
  }
}