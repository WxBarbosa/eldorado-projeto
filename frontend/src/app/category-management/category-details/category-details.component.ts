import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category } from '../../types';

@Component({
  selector: 'app-category-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-details.component.html',
})
export class CategoryDetailsComponent implements OnInit {
  category: Category | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCategory(parseInt(id));
    }
  }

  loadCategory(id: number): void {
    this.apiService.getCategory(id).subscribe({
      next: (category: Category) => {
        this.category = category;
      },
      error: () => {
        this.router.navigate(['/categories']);
      }
    });
  }

  deleteCategory(): void {
    if (this.category && confirm('Are you sure you want to delete this category?')) {
      this.apiService.deleteCategory(this.category.id).subscribe(() => {
        this.router.navigate(['/categories']);
      });
    }
  }
}