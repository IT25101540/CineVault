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
          <p class="text-muted text-sm">{{ filtered.length }} titles found</p>
        </div>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" routerLink="/movies/add" class="btn btn-primary btn-sm">+ Add movie</a>
      </div>

      <!-- ── SEARCH BAR ── -->
      <div class="search-bar">
        <span class="material-symbols-outlined search-icon">search</span>
        <input type="text" class="form-control search-input" placeholder="Search by title…"
               [(ngModel)]="searchTerm" (ngModelChange)="applyFilters()"/>
        <button class="btn btn-ghost btn-sm" *ngIf="searchTerm" (click)="searchTerm=''; applyFilters()">✕</button>
        <button class="btn-filter-toggle" (click)="showFilters = !showFilters">
          <span class="material-symbols-outlined">tune</span>
          Filters
          <span class="filter-count" *ngIf="activeFilterCount > 0">{{ activeFilterCount }}</span>
        </button>
      </div>

      <!-- ── ADVANCED FILTER PANEL ── -->
      <div class="filter-panel" [class.open]="showFilters">
        <div class="filter-grid">

          <!-- Genre -->
          <div class="filter-group">
            <label class="filter-label">Genre</label>
            <div class="genre-pills">
              <button class="pill" [class.active]="!activeGenre" (click)="activeGenre = null; applyFilters()">All</button>
              <button class="pill" *ngFor="let g of genres"
                      [class.active]="activeGenre === g"
                      (click)="activeGenre = g; applyFilters()">{{ g }}</button>
            </div>
          </div>

          <!-- Year Range -->
          <div class="filter-group">
            <label class="filter-label">Release Year</label>
            <div class="range-inputs">
              <input type="number" class="form-control range-input" placeholder="From"
                     [(ngModel)]="yearFrom" (ngModelChange)="applyFilters()" min="1900" max="2026"/>
              <span class="range-sep">—</span>
              <input type="number" class="form-control range-input" placeholder="To"
                     [(ngModel)]="yearTo" (ngModelChange)="applyFilters()" min="1900" max="2026"/>
            </div>
          </div>

          <!-- Min Rating -->
          <div class="filter-group">
            <label class="filter-label">Min Rating: <strong class="text-accent">{{ minRating }}★</strong></label>
            <div class="star-filter">
              <button class="star-btn" *ngFor="let s of [1,2,3,4,5]"
                      [class.active]="minRating >= s"
                      (click)="minRating = minRating === s ? 0 : s; applyFilters()">★</button>
              <button class="btn btn-ghost btn-sm" *ngIf="minRating > 0"
                      (click)="minRating = 0; applyFilters()">Clear</button>
            </div>
          </div>

          <!-- Sort -->
          <div class="filter-group">
            <label class="filter-label">Sort By</label>
            <div class="sort-pills">
              <button class="pill" *ngFor="let s of sortOptions"
                      [class.active]="sortBy === s.value"
                      (click)="sortBy = s.value; applyFilters()">{{ s.label }}</button>
            </div>
          </div>

        </div>

        <div class="filter-actions">
          <span class="text-sm text-muted">{{ filtered.length }} results</span>
          <button class="btn btn-ghost btn-sm" (click)="clearAllFilters()">
            <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:middle;">restart_alt</span>
            Reset All
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <!-- Grid -->
      <div class="movie-grid" *ngIf="!loading && filtered.length">
        <div class="card" *ngFor="let movie of filtered">
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
            <div class="card-meta">
              <span class="genre-tag">{{ movie.genre }}</span>
              <span class="text-xs text-muted">{{ movie.releaseYear }}</span>
            </div>
            <div class="rating-bar mt-1">
              <div class="rating-fill" [style.width.%]="movie.averageRating * 20"></div>
            </div>
            <div class="flex-between mt-2">
              <span class="text-xs text-accent">★ {{ movie.averageRating | number:'1.1-1' }}</span>
              <div class="flex gap-1">
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

      <div *ngIf="!loading && !filtered.length" style="padding:4rem 0;text-align:center;">
        <span class="material-symbols-outlined" style="font-size:3rem;color:var(--text-muted);">search_off</span>
        <p class="text-muted" style="margin-top:.5rem;">No movies match your filters.</p>
        <button class="btn btn-outline btn-sm mt-2" (click)="clearAllFilters()">Reset filters</button>
      </div>
    </div>
  `,
  styles: [`
    /* ── Search bar ── */
    .search-bar {
      display:flex;align-items:center;gap:.5rem;
      background:var(--surface);border:1px solid var(--border);
      border-radius:var(--radius-lg);padding:.5rem .75rem;
      margin-bottom:1rem;
    }
    .search-icon { color:var(--text-muted);font-size:1.1rem; }
    .search-input { flex:1;background:transparent;border:none;outline:none;color:var(--text); padding:0; }
    .btn-filter-toggle {
      display:inline-flex;align-items:center;gap:.35rem;
      padding:.35rem .85rem;border-radius:999px;font-size:.8rem;font-weight:600;
      background:var(--surface-2);border:1px solid var(--border);color:var(--text);
      cursor:pointer;transition:all .2s;white-space:nowrap;
    }
    .btn-filter-toggle:hover { border-color:var(--accent);color:var(--accent); }
    .btn-filter-toggle .material-symbols-outlined { font-size:.95rem; }
    .filter-count {
      background:var(--accent);color:#000;font-size:.65rem;font-weight:800;
      border-radius:999px;padding:1px 6px;
    }

    /* ── Filter Panel ── */
    .filter-panel {
      overflow:hidden;max-height:0;transition:max-height .35s ease, opacity .25s ease;
      opacity:0;
    }
    .filter-panel.open { max-height:400px;opacity:1; }
    .filter-grid {
      display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.25rem;
      background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);
      padding:1.25rem;margin-bottom:1rem;
    }
    .filter-label { font-size:.75rem;letter-spacing:.8px;text-transform:uppercase;color:var(--text-muted);display:block;margin-bottom:.5rem; }
    .range-inputs { display:flex;align-items:center;gap:.5rem; }
    .range-input { width:80px;padding:.3rem .5rem;font-size:.85rem; }
    .range-sep { color:var(--text-muted); }
    .star-filter { display:flex;align-items:center;gap:.25rem; }
    .star-btn {
      background:none;border:none;font-size:1.3rem;color:var(--text-muted);cursor:pointer;
      transition:color .15s,transform .15s;padding:0;
    }
    .star-btn.active { color:#facc15; }
    .star-btn:hover { transform:scale(1.2); }
    .sort-pills { display:flex;flex-wrap:wrap;gap:.4rem; }
    .filter-actions { display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem; }

    /* ── Card enhancements ── */
    .rating-bar { height:3px;background:var(--surface-2);border-radius:999px; }
    .rating-fill { height:100%;background:var(--accent);border-radius:999px; }
    .deactivated-overlay {
      position:absolute;top:0;left:0;right:0;bottom:0;
      background:rgba(0,0,0,0.6);display:flex;align-items:center;
      justify-content:center;pointer-events:none;z-index:5;
    }
    .card { position:relative;overflow:hidden; }
    .card-meta { display:flex;align-items:center;justify-content:space-between;margin-top:.25rem; }
    .genre-tag {
      font-size:.68rem;background:rgba(249,115,22,.12);color:var(--accent);
      border-radius:999px;padding:.15rem .55rem;font-weight:600;
    }
  `]
})
export class MovieListComponent implements OnInit {
  allMovies: Movie[] = [];
  filtered:  Movie[] = [];
  loading    = true;
  searchTerm = '';
  showFilters = false;

  // Filter state
  activeGenre: string | null = null;
  yearFrom: number | null = null;
  yearTo:   number | null = null;
  minRating = 0;
  sortBy = 'title';

  genres = ['Action', 'Drama', 'Comedy', 'SciFi', 'Thriller', 'Horror', 'Crime', 'Animation', 'Romance'];
  sortOptions = [
    { label: 'Title A–Z',   value: 'title' },
    { label: 'Newest',      value: 'year_desc' },
    { label: 'Oldest',      value: 'year_asc' },
    { label: 'Top Rated',   value: 'rating' },
  ];

  get activeFilterCount(): number {
    let c = 0;
    if (this.activeGenre) c++;
    if (this.yearFrom)    c++;
    if (this.yearTo)      c++;
    if (this.minRating)   c++;
    if (this.sortBy !== 'title') c++;
    return c;
  }

  constructor(private movieService: MovieService, private adminService: AdminService) {}
  get currentAdmin() { return this.adminService.currentAdmin; }
  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }

  ngOnInit() { this.loadMovies(); }

  loadMovies() {
    this.loading = true;
    this.movieService.getAll().subscribe({
      next: m => { this.allMovies = m; this.applyFilters(); this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  applyFilters() {
    let result = [...this.allMovies];

    // Search
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(m => m.title.toLowerCase().includes(term));
    }
    // Genre
    if (this.activeGenre) {
      result = result.filter(m => m.genre === this.activeGenre);
    }
    // Year from
    if (this.yearFrom) {
      result = result.filter(m => m.releaseYear >= this.yearFrom!);
    }
    // Year to
    if (this.yearTo) {
      result = result.filter(m => m.releaseYear <= this.yearTo!);
    }
    // Rating
    if (this.minRating > 0) {
      result = result.filter(m => m.averageRating >= this.minRating);
    }
    // Sort
    switch (this.sortBy) {
      case 'title':     result.sort((a,b) => a.title.localeCompare(b.title)); break;
      case 'year_desc': result.sort((a,b) => b.releaseYear - a.releaseYear);  break;
      case 'year_asc':  result.sort((a,b) => a.releaseYear - b.releaseYear);  break;
      case 'rating':    result.sort((a,b) => b.averageRating - a.averageRating); break;
    }
    this.filtered = result;
  }

  clearAllFilters() {
    this.searchTerm = ''; this.activeGenre = null;
    this.yearFrom = null; this.yearTo = null;
    this.minRating = 0; this.sortBy = 'title';
    this.applyFilters();
  }

  onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }

  toggleAvailability(movie: Movie) {
    const newState = !movie.available;
    const action = newState ? 'activate' : 'deactivate';
    if (confirm(`Are you sure you want to ${action} "${movie.title}"?`)) {
      this.movieService.update(movie.id, { available: newState }).subscribe({
        next: (updated) => { movie.available = updated.available; },
        error: (err) => { console.error('Failed to toggle availability', err); alert('Failed to update movie status.'); }
      });
    }
  }
}
