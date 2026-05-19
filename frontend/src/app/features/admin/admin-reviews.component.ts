import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../core/services/review.service';
import { AdminService } from '../../core/services/admin.service';
import { Review, Admin } from '../../core/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Review Moderation</h1>
      </div>

      <!-- Admin Nav -->
      <div class="admin-nav" *ngIf="currentAdmin">
        <a routerLink="/admin/dashboard" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Dashboard</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'USER_ADMIN'])" routerLink="/admin/users" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Users</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'REVIEW_ADMIN'])" routerLink="/admin/reviews" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Reviews</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'RENTAL_ADMIN'])" routerLink="/admin/rentals" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> Rentals</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'ADMIN_ADMIN'])" routerLink="/admin/admins" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admins</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" routerLink="/movies/add" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg> Add Movie</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'PERSON_ADMIN'])" routerLink="/people/add" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> Add Person</a>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>
      <div class="table-wrap" *ngIf="!loading">
        <table>
          <thead>
            <tr><th>Movie</th><th>User</th><th>Rating</th><th>Comment</th><th>Verified</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of reviews">
              <td class="text-sm">
                <a [routerLink]="['/movies', r.movieId]" class="text-accent" [title]="r.movieId">
                  {{ r.movieTitle || r.movieId }}
                </a>
              </td>
              <td class="text-sm">
                <div style="display:flex;flex-direction:column;">
                  <span style="font-weight:600;color:var(--text);">{{ r.username || r.userId }}</span>
                  <span class="text-muted" style="font-size:0.75rem;">{{ r.userEmail }}</span>
                </div>
              </td>
              <td><span class="text-accent">{{ r.starRating }}★</span></td>
              <td class="text-sm">{{ r.commentText | slice:0:50 }}{{ r.commentText.length > 50 ? '…' : '' }}</td>
              <td>
                <span class="badge badge-green" *ngIf="r.verified">Yes</span>
                <span class="badge badge-gray"  *ngIf="!r.verified">No</span>
              </td>
              <td>
                <span class="badge badge-red"  *ngIf="r.hidden">Hidden</span>
                <span class="badge badge-gray" *ngIf="!r.hidden">Visible</span>
              </td>
              <td style="display:flex;gap:.4rem;flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm" (click)="openEditModal(r)">Edit</button>
                <button *ngIf="!r.hidden" class="btn btn-outline btn-sm" (click)="hide(r.id)">Hide</button>
                <button *ngIf="r.hidden"  class="btn btn-ghost btn-sm"   (click)="unhide(r.id)">Unhide</button>
                <button class="btn btn-danger btn-sm" (click)="delete(r.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-muted text-sm" style="padding:.75rem 0;">{{ reviews.length }} reviews total</p>
      </div>

      <!-- Edit Review Modal -->
      <div class="modal-backdrop" *ngIf="selectedReviewForEdit" (click)="closeEditModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Edit Review Content</h2>
            <button class="btn-close" (click)="closeEditModal()">×</button>
          </div>
          <form (submit)="saveReviewEdit($event)">
            <div class="modal-body">
              <div class="form-group">
                <label>Star Rating (1 - 5)</label>
                <select [(ngModel)]="editStarRating" name="starRating" class="form-control">
                  <option [ngValue]="1">1★</option>
                  <option [ngValue]="2">2★</option>
                  <option [ngValue]="3">3★</option>
                  <option [ngValue]="4">4★</option>
                  <option [ngValue]="5">5★</option>
                </select>
              </div>
              <div class="form-group">
                <label>Review Comment</label>
                <textarea [(ngModel)]="editCommentText" name="commentText" class="form-control" rows="4" required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="closeEditModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-nav{display:flex;gap:.25rem;flex-wrap:wrap;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);}
    .admin-nav a{display:flex;align-items:center;gap:.35rem;color:var(--text-muted);font-size:.875rem;font-weight:500;padding:.4rem .75rem;border-radius:var(--radius);text-decoration:none;transition:all .18s;}
    .admin-nav a:hover,.admin-nav a.active{color:var(--text);background:var(--surface-2);}

    /* Modal styles with beautiful Glassmorphism */
    .modal-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:1000;}
    .modal-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);width:100%;max-width:480px;box-shadow:0 24px 64px rgba(0,0,0,0.6);animation:fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);overflow:hidden;}
    .modal-header{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);}
    .modal-header h2{font-size:1.2rem;font-weight:600;margin:0;}
    .btn-close{background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;padding:0;line-height:1;}
    .btn-close:hover{color:var(--text);}
    .modal-body{padding:1.5rem;display:flex;flex-direction:column;gap:1.1rem;}
    .modal-footer{display:flex;justify-content:flex-end;gap:.5rem;padding:1.1rem 1.5rem;background:var(--surface-2);border-top:1px solid var(--border);}
    .form-group{display:flex;flex-direction:column;gap:.35rem;}
    .form-group label{font-size:.825rem;color:var(--text-muted);font-weight:500;}
    .form-control{background:var(--surface-2);border:1px solid var(--border);color:var(--text);padding:.6rem .75rem;border-radius:var(--radius);font-size:.9rem;outline:none;transition:border-color 0.15s;}
    .form-control:focus{border-color:var(--accent);}
    @keyframes fadeIn { from{opacity:0;transform:scale(0.96);} to{opacity:1;transform:scale(1);} }
  `]
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = true;
  currentAdmin: Admin | null = null;

  // Modal Controls
  selectedReviewForEdit: Review | null = null;
  editStarRating = 5;
  editCommentText = '';

  constructor(private reviewService: ReviewService, private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.currentAdmin = this.adminService.currentAdmin;
    if (!this.currentAdmin || !this.hasRole(['SUPER_ADMIN', 'REVIEW_ADMIN'])) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getAll().subscribe({
      next: r => { this.reviews = r; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }

  openEditModal(review: Review) {
    this.selectedReviewForEdit = review;
    this.editStarRating = review.starRating;
    this.editCommentText = review.commentText;
  }

  closeEditModal() {
    this.selectedReviewForEdit = null;
  }

  saveReviewEdit(event: Event) {
    event.preventDefault();
    if (!this.selectedReviewForEdit) return;

    this.reviewService.update(this.selectedReviewForEdit.id, this.editStarRating, this.editCommentText).subscribe({
      next: (updatedReview) => {
        this.reviews = this.reviews.map(r => r.id === updatedReview.id ? { ...r, starRating: updatedReview.starRating, commentText: updatedReview.commentText } : r);
        this.closeEditModal();
      },
      error: (err) => {
        console.error("Failed to update review", err);
        alert("Failed to update review.");
      }
    });
  }

  hide(id: string) {
    this.reviewService.hide(id).subscribe(() => {
      this.reviews = this.reviews.map(r => r.id === id ? { ...r, hidden: true } : r);
    });
  }
  unhide(id: string) {
    this.reviewService.unhide(id).subscribe(() => {
      this.reviews = this.reviews.map(r => r.id === id ? { ...r, hidden: false } : r);
    });
  }
  delete(id: string) {
    if (confirm('Delete this review permanently?')) {
      this.reviewService.delete(id).subscribe(() => { this.reviews = this.reviews.filter(r => r.id !== id); });
    }
  }
}
