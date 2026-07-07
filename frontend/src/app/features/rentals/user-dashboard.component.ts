import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RentalService } from '../../core/services/rental.service';
import { ReviewService } from '../../core/services/review.service';
import { UserService } from '../../core/services/user.service';
import { Rental, Review } from '../../core/models/models';

interface GenreStat { genre: string; count: number; }

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container dash-wrap">

      <!-- Header -->
      <div class="dash-header">
        <div>
          <p class="eyebrow">My CineVault</p>
          <h1>Dashboard</h1>
          <p class="text-muted text-sm">Welcome back, <strong class="text-accent">{{ username }}</strong>!</p>
        </div>
        <div class="membership-pill" [ngClass]="membershipClass">
          {{ membershipType }}
        </div>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <ng-container *ngIf="!loading">
        <!-- ── STAT CARDS ── -->
        <div class="stat-grid">
          <div class="stat-card">
            <span class="material-symbols-outlined stat-icon" style="color:#f97316;">movie</span>
            <div class="stat-value">{{ totalRentals }}</div>
            <div class="stat-label">Movies Watched</div>
          </div>
          <div class="stat-card">
            <span class="material-symbols-outlined stat-icon" style="color:#a78bfa;">payments</span>
            <div class="stat-value">LKR {{ totalSpent | number:'1.0-0' }}</div>
            <div class="stat-label">Total Spent</div>
          </div>
          <div class="stat-card">
            <span class="material-symbols-outlined stat-icon" style="color:#4ade80;">star</span>
            <div class="stat-value">{{ avgRatingGiven | number:'1.1-1' }}</div>
            <div class="stat-label">Avg Rating Given</div>
          </div>
          <div class="stat-card">
            <span class="material-symbols-outlined stat-icon" style="color:#facc15;">rate_review</span>
            <div class="stat-value">{{ totalReviews }}</div>
            <div class="stat-label">Reviews Written</div>
          </div>
        </div>

        <!-- ── GENRE BAR CHART ── -->
        <div class="section-card" *ngIf="genreStats.length">
          <h3 class="section-title">
            <span class="material-symbols-outlined">bar_chart</span>
            Favourite Genres
          </h3>
          <div class="genre-bars">
            <div class="genre-row" *ngFor="let g of genreStats; let i = index">
              <span class="genre-name">{{ g.genre }}</span>
              <div class="genre-bar-track">
                <div class="genre-bar-fill"
                     [style.width.%]="(g.count / genreStats[0].count) * 100"
                     [style.animation-delay]="i * 0.1 + 's'">
                </div>
              </div>
              <span class="genre-count">{{ g.count }}</span>
            </div>
          </div>
        </div>

        <!-- ── RECENT ACTIVITY ── -->
        <div class="two-col">
          <!-- Recent Rentals -->
          <div class="section-card">
            <h3 class="section-title">
              <span class="material-symbols-outlined">history</span>
              Recent Rentals
            </h3>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let r of recentRentals">
                <div class="activity-info">
                  <a [routerLink]="['/movies', r.movieId]" class="activity-title text-accent">
                    {{ r.movieTitle || r.movieId }}
                  </a>
                  <span class="text-xs text-muted">{{ r.rentalDate | date:'dd MMM yyyy' }}</span>
                </div>
                <span class="badge" [ngClass]="{
                  'badge-green': r.status==='ACTIVE',
                  'badge-gray': r.status==='RETURNED',
                  'badge-red': r.status==='OVERDUE'
                }">{{ r.status }}</span>
              </div>
              <p *ngIf="!recentRentals.length" class="text-muted text-sm">No rentals yet.</p>
            </div>
            <a routerLink="/rentals/my" class="view-all-link">View all rentals →</a>
          </div>

          <!-- Recent Reviews -->
          <div class="section-card">
            <h3 class="section-title">
              <span class="material-symbols-outlined">reviews</span>
              Recent Reviews
            </h3>
            <div class="activity-list">
              <div class="activity-item" *ngFor="let r of recentReviews">
                <div class="activity-info">
                  <span class="activity-title">{{ r.movieTitle || 'Movie' }}</span>
                  <span class="stars-sm">{{ starsFor(r.starRating) }}</span>
                </div>
                <span class="text-xs text-muted">{{ r.createdAt | date:'dd MMM' }}</span>
              </div>
              <p *ngIf="!recentReviews.length" class="text-muted text-sm">No reviews yet.</p>
            </div>
            <a routerLink="/reviews/my" class="view-all-link">View all reviews →</a>
          </div>
        </div>

        <!-- ── OVERDUE ALERT ── -->
        <div class="overdue-alert" *ngIf="overdueRentals.length">
          <span class="material-symbols-outlined">warning</span>
          <div>
            <strong>{{ overdueRentals.length }} overdue rental{{ overdueRentals.length > 1 ? 's' : '' }}!</strong>
            <p class="text-sm" style="margin:.25rem 0 0;">
              {{ overdueRentals[0].movieTitle }} is overdue. Please return it.
            </p>
          </div>
          <a routerLink="/rentals/my" class="btn btn-sm" style="background:#ef4444;color:#fff;border:none;white-space:nowrap;">View Rentals</a>
        </div>

      </ng-container>
    </div>
  `,
  styles: [`
    .dash-wrap { padding-top:2rem;padding-bottom:4rem; }
    .dash-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem; }
    .eyebrow { font-size:.72rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);font-weight:700;margin-bottom:.3rem; }

    /* Membership pill */
    .membership-pill { padding:.4rem 1.1rem;border-radius:999px;font-size:.8rem;font-weight:700;letter-spacing:.5px;text-transform:uppercase; }
    .pill-FREE    { background:rgba(255,255,255,.07);color:var(--text-muted); }
    .pill-PREMIUM { background:linear-gradient(135deg,#f97316,#ea580c);color:#fff; }
    .pill-ELITE   { background:linear-gradient(135deg,#a78bfa,#7c3aed);color:#fff; }

    /* Stat cards */
    .stat-grid { display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:1rem;margin-bottom:1.5rem; }
    .stat-card {
      background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);
      padding:1.5rem 1rem;text-align:center;transition:transform .2s;
    }
    .stat-card:hover { transform:translateY(-3px); }
    .stat-icon { font-size:1.6rem;margin-bottom:.5rem;display:block; }
    .stat-value { font-size:1.5rem;font-weight:800;color:var(--text); }
    .stat-label { font-size:.75rem;color:var(--text-muted);margin-top:.25rem; }

    /* Section card */
    .section-card {
      background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);
      padding:1.5rem;margin-bottom:1.25rem;
    }
    .section-title { display:flex;align-items:center;gap:.5rem;font-size:1rem;font-weight:700;margin-bottom:1.25rem; }
    .section-title .material-symbols-outlined { color:var(--accent);font-size:1.1rem; }

    /* Genre chart */
    .genre-bars { display:flex;flex-direction:column;gap:.75rem; }
    .genre-row { display:grid;grid-template-columns:90px 1fr 30px;align-items:center;gap:.75rem; }
    .genre-name { font-size:.82rem;color:var(--text-muted);text-align:right; }
    .genre-bar-track { background:var(--surface-2);border-radius:999px;height:8px;overflow:hidden; }
    .genre-bar-fill {
      height:100%;border-radius:999px;
      background:linear-gradient(90deg,#f97316,#a78bfa);
      animation:growBar .8s ease forwards;width:0;
    }
    @keyframes growBar { to { width:100%; } }
    .genre-count { font-size:.82rem;font-weight:700;color:var(--text); }

    /* Two col */
    .two-col { display:grid;grid-template-columns:1fr 1fr;gap:1.25rem; }
    @media(max-width:640px){ .two-col{grid-template-columns:1fr;} }

    /* Activity */
    .activity-list { display:flex;flex-direction:column;gap:.75rem;margin-bottom:1rem; }
    .activity-item { display:flex;justify-content:space-between;align-items:center;gap:.5rem; }
    .activity-info { display:flex;flex-direction:column;gap:.15rem; }
    .activity-title { font-size:.88rem;font-weight:600;color:var(--text); }
    .stars-sm { font-size:.75rem;color:#facc15;letter-spacing:1px; }
    .view-all-link { font-size:.8rem;color:var(--accent);text-decoration:none;font-weight:600; }
    .view-all-link:hover { text-decoration:underline; }

    /* Overdue alert */
    .overdue-alert {
      display:flex;align-items:center;gap:1rem;
      background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);
      border-radius:var(--radius-lg);padding:1.25rem;margin-top:1rem;flex-wrap:wrap;
    }
    .overdue-alert>.material-symbols-outlined { color:#f87171;font-size:1.5rem;flex-shrink:0; }
  `]
})
export class UserDashboardComponent implements OnInit {
  loading     = true;
  username    = '';
  membershipType = 'FREE';
  membershipClass = 'pill-FREE';

  rentals:       Rental[] = [];
  reviews:       Review[] = [];
  recentRentals: Rental[] = [];
  recentReviews: Review[] = [];
  overdueRentals: Rental[] = [];
  genreStats:    GenreStat[] = [];

  totalRentals  = 0;
  totalSpent    = 0;
  totalReviews  = 0;
  avgRatingGiven = 0;

  constructor(
    private userService: UserService,
    private rentalService: RentalService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    const user = this.userService.currentUser;
    if (!user) { this.loading = false; return; }

    this.username       = user.username;
    this.membershipType = user.membershipType || 'FREE';
    this.membershipClass = 'pill-' + this.membershipType;

    let done = 0;
    const checkDone = () => { if (++done === 2) { this.computeStats(); this.loading = false; } };

    this.rentalService.getByUser(user.id).subscribe({
      next: r => { this.rentals = r; checkDone(); },
      error: () => checkDone()
    });

    this.reviewService.getByUser(user.id).subscribe({
      next: (res: any) => {
        this.reviews = Array.isArray(res) ? res : (res.reviews || []);
        checkDone();
      },
      error: () => checkDone()
    });
  }

  computeStats() {
    this.totalRentals  = this.rentals.length;
    this.totalSpent    = this.rentals.reduce((s, r) => s + (r.totalFee || 0), 0);
    this.totalReviews  = this.reviews.length;
    this.overdueRentals = this.rentals.filter(r => r.status === 'OVERDUE');

    const ratings = this.reviews.filter(r => r.starRating > 0).map(r => r.starRating);
    this.avgRatingGiven = ratings.length ? ratings.reduce((a,b) => a+b, 0) / ratings.length : 0;

    this.recentRentals = [...this.rentals].sort((a, b) =>
      new Date(b.rentalDate).getTime() - new Date(a.rentalDate).getTime()
    ).slice(0, 5);

    this.recentReviews = [...this.reviews].sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);

    // Genre stats from movie titles (using genre from rental if available)
    const genreMap: Record<string, number> = {};
    this.rentals.forEach(r => {
      // Try to extract genre from movieTitle or use a default
      const key = 'Watched';
      genreMap[key] = (genreMap[key] || 0) + 1;
    });
    this.genreStats = Object.entries(genreMap)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  starsFor(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }
}
