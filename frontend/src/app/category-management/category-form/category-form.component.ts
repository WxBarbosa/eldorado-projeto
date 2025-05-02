import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category } from '../../types';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditing = false;
  categoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(128)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.categoryId = parseInt(id);
      this.loadCategory(this.categoryId);
    }
  }

  loadCategory(id: number): void {
    this.apiService.getCategory(id).subscribe((category: Category) => {
      this.categoryForm.patchValue(category);
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      const request = this.isEditing
        ? this.apiService.updateCategory(this.categoryId!, this.categoryForm.value)
        : this.apiService.createCategory(this.categoryForm.value);

      request.subscribe(() => {
        this.router.navigate(['/categories']);
      });
    }
  }
}