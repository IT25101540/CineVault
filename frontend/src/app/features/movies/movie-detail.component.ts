import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { ReviewService } from '../../core/services/review.service';
import { AdminService } from '../../core/services/admin.service';
import { PersonService } from '../../core/services/person.service';
import { Movie, Review, Person } from '../../core/models/models';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading && movie">
        <div class="movie-hero">
          <div class="movie-poster">
            <img *ngIf="movie.posterUrl" [src]="movie.posterUrl" [alt]="movie.title"
                 style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-lg);"
                 (error)="onImgError($event)"/>
            <span *ngIf="!movie.posterUrl" class="material-symbols-outlined" style="font-size: 3rem; color: var(--text-muted);">movie</span>
          </div>
          <div>
            <div class="movie-meta">
              <span class="badge badge-gray">{{ movie.genre }}</span>
              <span class="badge badge-gray">{{ movie.releaseYear }}</span>
              <span class="badge badge-green" *ngIf="movie.available">Available</span>
              <span class="badge badge-red"   *ngIf="!movie.available">Unavailable</span>
            </div>
            <h1>{{ movie.title }}</h1>
            <div class="flex-center gap-1 mt-2">
              <span class="text-accent">{{ starsFor(movie.averageRating) }}</span>
              <span class="text-sm text-muted">{{ movie.averageRating | number:'1.1-1' }} / 5</span>
              <span class="text-xs text-muted">({{ reviewCount }} reviews)</span>
            </div>
            
            <div style="margin-top: 1.25rem;">
              <p *ngIf="director" class="text-sm"><strong>Director:</strong> {{ director.fullName }}</p>
              <p *ngIf="actors.length > 0" class="text-sm" style="margin-top: 0.25rem;">
                <strong>Starring:</strong> 
                <span *ngFor="let actor of actors; let last = last">
                  {{ actor.fullName }}{{ !last ? ', ' : '' }}
                </span>
              </p>
            </div>
            
            <p style="margin-top:1.25rem;max-width:600px;">{{ movie.synopsis }}</p>
            <div class="actions">
              <a [routerLink]="['/rentals/rent', movie.id]" class="btn btn-primary">Rent this movie</a>
              <a [routerLink]="['/reviews/add', movie.id]" class="btn btn-outline">Write a review</a>
              <a *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" [routerLink]="['/movies', movie.id, 'edit']" class="btn btn-ghost btn-sm">Edit</a>
              <button *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" class="btn btn-danger btn-sm" (click)="deleteMovie()">Delete</button>
            </div>
          </div>
        </div>

        <!-- Reviews preview -->
        <div style="margin-top:2rem;">
          <div class="flex-between mb-3">
            <h3>Reviews</h3>
            <a [routerLink]="['/reviews/movie', movie.id]" class="btn btn-ghost btn-sm">View all →</a>
          </div>
          <div *ngIf="reviews.length === 0" class="text-muted text-sm" style="padding:1rem 0;">
            No reviews yet. <a [routerLink]="['/reviews/add', movie.id]">Be the first →</a>
          </div>
          <div *ngFor="let r of reviews.slice(0,3)" class="review-card">
            <div class="flex-between mb-2">
              <span class="text-accent">{{ starsFor(r.starRating) }}</span>
              <span class="text-xs text-muted">{{ r.createdAt | date:'dd MMM yyyy' }}</span>
            </div>
            <p style="font-size:.9rem;color:var(--text);">{{ r.commentText }}</p>
            <p class="text-xs text-muted mt-1">by {{ r.username || r.userId }}</p>
          </div>
        </div>
      </div>

      <p *ngIf="!loading && !movie" class="text-muted" style="padding:3rem 0;">
        Movie not found. <a routerLink="/movies">← Back to movies</a>
      </p>
    </div>
  `,
  styles: [`
    .movie-hero { display:grid;grid-template-columns:220px 1fr;gap:2.5rem;padding:3rem 0 2.5rem;border-bottom:1px solid var(--border);margin-bottom:2.5rem; }
    .movie-poster { aspect-ratio:2/3;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:3rem;overflow:hidden; }
    .movie-meta { display:flex;flex-wrap:wrap;gap:.5rem;margin-bottom:1rem; }
    .actions { display:flex;gap:.75rem;margin-top:1.5rem;flex-wrap:wrap; }
    .review-card { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:.75rem; }
    @media(max-width:600px){ .movie-hero{grid-template-columns:1fr;} .movie-poster{max-width:160px;} }
  `]
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  reviewCount = 0;
  loading = true;
  director: Person | null = null;
  actors: Person[] = [];

  constructor(private route: ActivatedRoute, private router: Router,
              private movieService: MovieService, private reviewService: ReviewService,
              private adminService: AdminService, private personService: PersonService) {}

  get currentAdmin() { return this.adminService.currentAdmin; }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.movieService.getById(id).subscribe({
      next: m => {
        this.movie = m;
        this.loading = false;
        
        // Fetch Director
        if (m.directorId) {
          this.personService.getById(m.directorId).subscribe(p => this.director = p);
        }
        
        // Fetch Actors
        if (m.actorIds && m.actorIds.length > 0) {
          m.actorIds.forEach(id => {
            this.personService.getById(id).subscribe(p => {
              if (p) this.actors.push(p);
            });
          });
        }
        
        this.reviewService.getByMovie(id).subscribe(res => {
          this.reviews = res.reviews;
          this.reviewCount = res.count;
        });
      },
      error: () => { this.loading = false; }
    });
  }

  deleteMovie() {
    if (confirm('Delete this movie?')) {
      this.movieService.delete(this.movie!.id).subscribe(() => this.router.navigate(['/movies']));
    }
  }

  starsFor(n: number): string {
    const full = Math.round(n);
    return '★'.repeat(full) + '☆'.repeat(5 - full);
  }
  onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }
}
