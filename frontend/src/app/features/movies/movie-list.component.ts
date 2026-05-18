import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../core/services/movie.service';
import { AdminService } from '../../core/services/admin.service';
import { Movie } from '../../core/models/models';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="page-header flex-between">
        <div>
          <h1>Movies</h1>
          <p *ngIf="activeGenre">Browsing: {{ activeGenre }}</p>
          <p *ngIf="!activeGenre">All titles in the catalogue</p>
        </div>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" routerLink="/movies/add" class="btn btn-primary btn-sm">+ Add movie</a>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <input type="text" class="form-control" placeholder="Search by title…" [(ngModel)]="searchTerm"
               (keyup.enter)="search()"/>
        <button class="btn btn-outline" (click)="search()">Search</button>
        <button class="btn btn-ghost" *ngIf="searchTerm" (click)="clearSearch()">Clear</button>
      </div>

      <!-- Genre Pills -->
      <div class="genre-pills">
        <button class="pill" [class.active]="!activeGenre" (click)="filterGenre(null)">All</button>
        <button class="pill" *ngFor="let g of genres" [class.active]="activeGenre === g" (click)="filterGenre(g)">
          {{ g }}
        </button>
      </div>

      <!-- Loading -->
      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <!-- Grid -->
      <div class="movie-grid" *ngIf="!loading && movies.length">
        <div class="card" *ngFor="let movie of movies">
          <img *ngIf="movie.posterUrl" [src]="movie.posterUrl" [alt]="movie.title" class="card-img"
               (error)="onImgError($event)"/>
          <div *ngIf="!movie.posterUrl" class="card-img-placeholder">
            <span class="material-symbols-outlined" style="font-size: 2rem;">movie</span>
          </div>
          <!-- Deactivated Overlay -->
          <div class="deactivated-overlay" *ngIf="!movie.available">
            <span class="badge badge-red">DEACTIVATED</span>
          </div>
          <div class="card-body">
            <p class="card-title">{{ movie.title }}</p>
            <p class="card-text">{{ movie.genre }}</p>
            <p class="text-xs text-muted">{{ movie.releaseYear }}</p>
            <div class="rating-bar mt-1">
              <div class="rating-fill" [style.width.%]="movie.averageRating * 20"></div>
            </div>
            <div class="flex-between mt-2">
              <span class="text-xs text-muted">{{ movie.averageRating | number:'1.1-1' }} / 5</span>
              <div class="flex gap-1">
                <!-- Admin Toggle Button -->
                <button *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" 
                        class="btn btn-xs" 
                        [class.btn-outline]="movie.available"
                        [class.btn-primary]="!movie.available"
                        (click)="$event.stopPropagation(); toggleAvailability(movie)">
                  <span class="material-symbols-outlined" style="font-size: 1.1rem;">
                    {{ movie.available ? 'visibility_off' : 'visibility' }}
                  </span>
                </button>
                <a [routerLink]="['/movies', movie.id]" class="btn btn-ghost btn-sm">View →</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && !movies.length" style="padding:4rem 0;text-align:center;">
        <p style="font-size:2rem;margin-bottom:1rem; color: var(--text-muted);">
          <span class="material-symbols-outlined" style="font-size: 3rem;">movie</span>
        </p>
        <p class="text-muted">No movies found.</p>
      </div>
    </div>
  `,
  styles: [`
    .rating-bar { height:3px;background:var(--surface-2);border-radius:999px; }
    .rating-fill { height:100%;background:var(--accent);border-radius:999px; }
    .deactivated-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6); display: flex; align-items: center;
      justify-content: center; pointer-events: none; z-index: 5;
    }
    .card { position: relative; overflow: hidden; }
    
    /* Mobile enhancements for genre pills */
    @media (max-width: 768px) {
      .genre-pills { 
        display: flex; 
        flex-wrap: nowrap; 
        overflow-x: auto; 
        padding-bottom: 0.5rem; 
        scrollbar-width: none; /* Firefox */
      }
      .genre-pills::-webkit-scrollbar { display: none; }
      .pill { flex: 0 0 auto; white-space: nowrap; }
    }
  `]
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  loading = true;
  searchTerm = '';
  activeGenre: string | null = null;
  genres = ['Action', 'Drama', 'Comedy', 'SciFi', 'Thriller', 'Horror', 'Crime', 'Animation', 'Romance'];

  constructor(private movieService: MovieService, private adminService: AdminService) {}

  get currentAdmin() { return this.adminService.currentAdmin; }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }

  ngOnInit() { this.loadMovies(); }

  loadMovies() {
    this.loading = true;
    this.movieService.getAll(this.searchTerm || undefined, this.activeGenre || undefined).subscribe({
      next: m => { this.movies = m; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  search() { this.activeGenre = null; this.loadMovies(); }
  clearSearch() { this.searchTerm = ''; this.loadMovies(); }
  filterGenre(genre: string | null) { this.activeGenre = genre; this.searchTerm = ''; this.loadMovies(); }
  onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

  toggleAvailability(movie: Movie) {
    const newState = !movie.available;
    const action = newState ? 'activate' : 'deactivate';
    if (confirm(`Are you sure you want to ${action} "${movie.title}"?`)) {
      this.movieService.update(movie.id, { available: newState }).subscribe({
        next: (updated) => {
          movie.available = updated.available;
        },
        error: (err) => {
          console.error('Failed to toggle availability', err);
          alert('Failed to update movie status.');
        }
      });
    }
  }
}
