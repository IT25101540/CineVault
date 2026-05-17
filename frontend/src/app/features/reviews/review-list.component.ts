import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../core/services/review.service';
import { Review } from '../../core/models/models';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header flex-between">
        <div>
          <h2>Reviews</h2>
          <p class="text-sm text-muted">
            Average rating:
            <strong class="text-accent">{{ avgRating | number:'1.1-1' }} / 5</strong>
            &nbsp;({{ reviews.length }} reviews)
          </p>
        </div>
        <a [routerLink]="['/reviews/add', movieId]" class="btn btn-primary btn-sm">+ Write a review</a>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading">
        <div class="review-card" *ngFor="let r of reviews">
          <div class="review-header">
            <div class="flex-center gap-1">
              <span class="stars-display">{{ starsFor(r.starRating) }}</span>
              <span class="badge badge-verified" *ngIf="r.verified"><span class="material-symbols-outlined" style="font-size:inherit; vertical-align:text-bottom; margin-right: 2px;">check_circle</span> Verified</span>
            </div>
            <span class="text-xs text-muted">{{ r.createdAt | date:'dd MMM yyyy' }}</span>
          </div>
          <p style="font-size:.9rem;color:var(--text);">{{ r.commentText }}</p>
          <p class="text-xs text-muted mt-1">by <a [routerLink]="['/profile', r.userId]" class="text-accent" style="text-decoration:none;font-weight:500;">{{ r.username || r.userId }}</a></p>
        </div>

        <p *ngIf="!reviews.length" class="text-muted" style="padding:3rem 0;">
          No reviews yet.
          <a [routerLink]="['/reviews/add', movieId]">Be the first to write one →</a>
        </p>
      </div>

      <a [routerLink]="['/movies', movieId]" class="btn btn-outline btn-sm mt-4">← Back to movie</a>
    </div>
  `,
  styles: [`
    .review-card { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:.75rem; }
    .review-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem; }
    .stars-display { color:var(--accent);font-size:1rem;letter-spacing:1px; }
  `]
})
export class ReviewListComponent implements OnInit {
  reviews: Review[] = [];
  avgRating = 0;
  loading = true;
  movieId = '';

  constructor(private route: ActivatedRoute, private reviewService: ReviewService) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('movieId')!;
    this.reviewService.getByMovie(this.movieId).subscribe({
      next: res => {
        this.reviews = res.reviews;
        this.avgRating = res.averageRating;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  starsFor(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }
}
