import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RentalService } from '../../core/services/rental.service';
import { UserService } from '../../core/services/user.service';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/models';

@Component({
  selector: 'app-rent-movie',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top:3.5rem;padding-bottom:4rem;">
      <!-- Success View -->
      <div class="success-card" *ngIf="showSuccess">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="checkmark">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        
        <h2>Rental Confirmed!</h2>
        <p class="success-subtitle">Enjoy your cinematic experience with CineVault.</p>

        <div class="ticket-box" *ngIf="movie">
          <div class="ticket-header">
            <span class="badge badge-green">ACTIVE RENTAL</span>
            <span class="ticket-id">#{{ movieId.substring(0, 8).toUpperCase() }}</span>
          </div>
          <div class="ticket-body">
            <h3 class="ticket-title">{{ movie.title }}</h3>
            <p class="ticket-meta">{{ movie.genre }} · {{ movie.releaseYear }}</p>
            
            <div class="ticket-dates">
              <div class="date-col">
                <span class="date-label">RENTED ON</span>
                <span class="date-val">{{ todayDate | date:'dd MMM yyyy' }}</span>
              </div>
              <div class="date-col">
                <span class="date-label">DUE ON</span>
                <span class="date-val">{{ dueDate | date:'dd MMM yyyy' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="success-actions">
          <button class="btn btn-primary" (click)="goToMyRentals()">View My Rentals</button>
          <a routerLink="/movies" class="btn btn-outline">Browse More Movies</a>
        </div>
      </div>

      <!-- Form View -->
      <div class="form-card" *ngIf="!showSuccess">
        <div style="margin-bottom:2rem;">
          <p class="eyebrow">Rental</p>
          <h2>Confirm rental</h2>
          <p class="text-muted text-sm" style="margin-top:.5rem;">
            7-day rental period · Late fee: LKR 150/day
          </p>
        </div>

        <div class="info-box" *ngIf="movie">
          <p class="text-xs text-muted" style="text-transform:uppercase;letter-spacing:.08em;margin-bottom:.3rem;">Movie</p>
          <p style="font-family:var(--font-serif);font-size:1.2rem;color:var(--text);">{{ movie.title }}</p>
          <p class="text-sm text-muted">{{ movie.genre }} · {{ movie.releaseYear }}</p>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div class="form-group">
          <label class="form-label">User ID</label>
          <input type="text" class="form-control" [(ngModel)]="userId" placeholder="Your user ID"/>
        </div>

        <div style="display:flex;gap:.75rem;">
          <button class="btn btn-primary" (click)="confirmRent()" [disabled]="saving">
            {{ saving ? 'Processing…' : 'Confirm rental' }}
          </button>
          <a [routerLink]="['/movies', movieId]" class="btn btn-outline">Cancel</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow { font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem; }
    .info-box { background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;margin-bottom:1.5rem; }

    /* Success Card Styling */
    .success-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      max-width: 480px;
      margin: 0 auto;
      text-align: center;
      box-shadow: 0 24px 64px rgba(0,0,0,0.5);
      backdrop-filter: blur(12px);
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .success-icon {
      width: 72px;
      height: 72px;
      background: rgba(46, 204, 113, 0.15);
      border: 2px solid #2ecc71;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem auto;
      color: #2ecc71;
      box-shadow: 0 0 24px rgba(46, 204, 113, 0.3);
    }
    .checkmark {
      width: 32px;
      height: 32px;
    }
    .success-subtitle {
      color: var(--text-muted);
      font-size: 0.925rem;
      margin-top: 0.4rem;
      margin-bottom: 2rem;
    }
    .ticket-box {
      background: var(--surface-2);
      border: 1px dashed var(--border);
      border-radius: var(--radius);
      padding: 1.25rem;
      margin-bottom: 2rem;
      text-align: left;
    }
    .ticket-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.75rem;
    }
    .ticket-id {
      font-family: monospace;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .ticket-title {
      font-family: var(--font-serif);
      font-size: 1.3rem;
      color: var(--text);
      margin: 0;
    }
    .ticket-meta {
      font-size: 0.825rem;
      color: var(--text-muted);
      margin: 0.25rem 0 1.25rem 0;
    }
    .ticket-dates {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .date-label {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.08em;
      margin-bottom: 0.2rem;
    }
    .date-val {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--accent);
    }
    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class RentMovieComponent implements OnInit {
  movieId = '';
  movie: Movie | null = null;
  userId = '';
  saving = false;
  error = '';

  showSuccess = false;
  todayDate = new Date();
  dueDate = new Date();

  constructor(
    private route: ActivatedRoute, private router: Router,
    private rentalService: RentalService, private userService: UserService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('movieId')!;
    this.userId = this.userService.currentUser?.id || '';
    this.movieService.getById(this.movieId).subscribe(m => this.movie = m);
    
    // Set 7 days due date
    this.dueDate.setDate(this.todayDate.getDate() + 7);
  }

  confirmRent() {
    if (!this.userId.trim()) { this.error = 'User ID is required.'; return; }
    this.saving = true; this.error = '';
    this.rentalService.rent(this.userId, this.movieId).subscribe({
      next: () => {
        this.saving = false;
        this.showSuccess = true;
      },
      error: e => { this.error = e.error?.error || 'Rental failed.'; this.saving = false; }
    });
  }

  goToMyRentals() {
    this.router.navigate(['/rentals/my']);
  }
}
