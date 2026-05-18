import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../core/services/review.service';
import { UserService } from '../../core/services/user.service';
import { Review } from '../../core/models/models';

@Component({
  selector: 'app-my-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header"><h2>My Reviews</h2></div>
      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>
      <div class="table-wrap" *ngIf="!loading && reviews.length">
        <table>
          <thead>
            <tr><th>Movie</th><th>Rating</th><th>Comment</th><th>Date</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of reviews">
              <td><a [routerLink]="['/movies', r.movieId]" class="text-accent">{{ r.movieTitle || r.movieId }}</a></td>
              <td><span class="text-accent">{{ r.starRating }}★</span></td>
              <td class="text-sm">{{ r.commentText | slice:0:60 }}{{ r.commentText.length > 60 ? '…' : '' }}</td>
              <td class="text-xs text-muted">{{ r.createdAt | date:'dd MMM yyyy' }}</td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="deleteReview(r.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p *ngIf="!loading && !reviews.length" class="text-muted" style="padding:3rem 0;">
        You haven't written any reviews yet.
        <a routerLink="/movies">Browse movies →</a>
      </p>
    </div>
  `
})
export class MyReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;

  constructor(private reviewService: ReviewService, private userService: UserService) {}

  ngOnInit() {
    const uid = this.userService.currentUser?.id || 'usr-001';
    this.reviewService.getByUser(uid).subscribe({
      next: r => { this.reviews = r; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  deleteReview(id: string) {
    if (confirm('Delete this review?')) {
      this.reviewService.delete(id).subscribe(() => {
        this.reviews = this.reviews.filter(r => r.id !== id);
      });
    }
  }
}
