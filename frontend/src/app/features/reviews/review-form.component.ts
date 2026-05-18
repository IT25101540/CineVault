import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../core/services/review.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top:3.5rem;padding-bottom:4rem;">
      <div class="form-card">
        <div style="margin-bottom:2rem;">
          <p class="eyebrow">Review</p>
          <h2>Write a review</h2>
        </div>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="success">Review submitted! Redirecting…</div>

        <div class="form-group">
          <label class="form-label">Your rating</label>
          <div class="star-input">
            <span *ngFor="let s of [5,4,3,2,1]"
                  (click)="starRating = s"
                  style="font-size:1.75rem;cursor:pointer;transition:color .15s;"
                  [style.color]="s <= starRating ? 'var(--accent)' : 'var(--text-dim)'">★</span>
          </div>
          <p class="text-xs text-muted mt-1">{{ starRating }} star{{ starRating !== 1 ? 's' : '' }} selected</p>
        </div>

        <div class="form-group">
          <label class="form-label">Your thoughts</label>
          <textarea class="form-control" [(ngModel)]="comment"
                    placeholder="Share your honest opinion about this film…" required></textarea>
        </div>

        <div style="display:flex;gap:.75rem;margin-top:.5rem;">
          <button class="btn btn-primary" (click)="submit()" [disabled]="saving">
            {{ saving ? 'Submitting…' : 'Submit review' }}
          </button>
          <a [routerLink]="['/movies', movieId]" class="btn btn-outline">Cancel</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow { font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem; }
    .star-input { display:flex;gap:.25rem; }
  `]
})
export class ReviewFormComponent implements OnInit {
  movieId = '';
  starRating = 3;
  comment = '';
  saving = false;
  error = '';
  success = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reviewService: ReviewService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('movieId')!;
  }

  submit() {
    if (!this.comment.trim()) { this.error = 'Please write your review.'; return; }
    this.saving = true; this.error = '';
    const userId = this.userService.currentUser?.id || 'guest';
    this.reviewService.submit(this.movieId, userId, this.starRating, this.comment).subscribe({
      next: () => {
        this.success = true;
        setTimeout(() => this.router.navigate(['/movies', this.movieId]), 1200);
      },
      error: e => { this.error = e.error?.error || 'Failed to submit.'; this.saving = false; }
    });
  }
}
