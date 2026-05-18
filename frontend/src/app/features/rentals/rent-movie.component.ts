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
      <div class="form-card">
        <div style="margin-bottom:2rem;">
          <p class="eyebrow">Rental</p>
          <h2>Confirm rental</h2>
          <p class="text-muted text-sm" style="margin-top:.5rem;">
            7-day rental period · Late fee: $1.50/day
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
  `]
})
export class RentMovieComponent implements OnInit {
  movieId = '';
  movie: Movie | null = null;
  userId = '';
  saving = false;
  error = '';

  constructor(
    private route: ActivatedRoute, private router: Router,
    private rentalService: RentalService, private userService: UserService,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('movieId')!;
    this.userId = this.userService.currentUser?.id || '';
    this.movieService.getById(this.movieId).subscribe(m => this.movie = m);
  }

  confirmRent() {
    if (!this.userId.trim()) { this.error = 'User ID is required.'; return; }
    this.saving = true; this.error = '';
    this.rentalService.rent(this.userId, this.movieId).subscribe({
      next: () => this.router.navigate(['/rentals/my']),
      error: e => { this.error = e.error?.error || 'Rental failed.'; this.saving = false; }
    });
  }
}
