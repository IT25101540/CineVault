import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { PersonService } from '../../core/services/person.service';
import { MovieService } from '../../core/services/movie.service';
import { AdminService } from '../../core/services/admin.service';
import { Person, Movie } from '../../core/models/models';

@Component({
  selector: 'app-person-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading && person">
        <!-- Profile Hero -->
        <div class="person-hero">
          <div class="person-photo">
            <img *ngIf="person.photoUrl" [src]="person.photoUrl" [alt]="person.fullName" (error)="onImgError($event)"/>
            <span *ngIf="!person.photoUrl" class="material-symbols-outlined" style="font-size:3rem;">person</span>
          </div>
          <div class="person-info">
            <div class="person-badges">
              <span class="badge badge-gold" *ngIf="person.creditType==='DIRECTOR'">Director</span>
              <span class="badge badge-gray" *ngIf="person.creditType==='ACTOR'">Actor</span>
              <span class="badge badge-gold" *ngIf="person.creditType==='BOTH'">Director / Actor</span>
              <span class="badge badge-gray" *ngIf="person.nationality">{{ person.nationality }}</span>
              <span class="badge badge-gray" *ngIf="person.birthYear > 0">Born {{ person.birthYear }}</span>
            </div>
            <h1 style="margin: 0.5rem 0 1rem;">{{ person.fullName }}</h1>
            <p style="max-width:600px;line-height:1.7;">{{ person.biography }}</p>

            <div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap;" *ngIf="hasRole(['SUPER_ADMIN', 'PERSON_ADMIN'])">
              <a [routerLink]="['/people', person.id, 'edit']" class="btn btn-outline btn-sm">Edit Profile</a>
              <button class="btn btn-danger btn-sm" (click)="deletePerson()">Delete</button>
            </div>
          </div>
        </div>

        <!-- Filmography Grid -->
        <div class="filmography-section">
          <div class="section-header">
            <h2>Filmography</h2>
            <span class="text-muted text-sm">{{ movies.length }} title{{ movies.length !== 1 ? 's' : '' }}</span>
          </div>

          <div class="spinner-wrap" *ngIf="moviesLoading"><div class="spinner"></div></div>

          <div class="movie-grid" *ngIf="!moviesLoading && movies.length">
            <div class="movie-card" *ngFor="let m of movies">
              <a [routerLink]="['/movies', m.id]" class="movie-poster-link">
                <img *ngIf="m.posterUrl" [src]="m.posterUrl" [alt]="m.title" (error)="onImgError($event)"/>
                <div *ngIf="!m.posterUrl" class="no-poster">
                  <span class="material-symbols-outlined" style="font-size:2rem;">movie</span>
                </div>
                <div class="movie-overlay">
                  <span class="btn btn-primary btn-sm">View →</span>
                </div>
              </a>
              <div class="movie-info">
                <p class="movie-title">{{ m.title }}</p>
                <p class="movie-meta">
                  <span class="text-accent">★ {{ m.averageRating | number:'1.1-1' }}</span>
                  <span class="text-muted"> · {{ m.releaseYear }}</span>
                </p>
                <span class="badge badge-gray" style="font-size:0.7rem;">{{ m.genre }}</span>
              </div>
            </div>
          </div>

          <p *ngIf="!moviesLoading && !movies.length" class="text-muted" style="padding:2rem 0;">
            No movies linked to this person yet.
          </p>
        </div>
      </div>

      <p *ngIf="!loading && !person" class="text-muted" style="padding:3rem 0;">
        Person not found. <a routerLink="/people">← Back</a>
      </p>
    </div>
  `,
  styles: [`
    .person-hero {
      display: grid; grid-template-columns: 200px 1fr; gap: 2.5rem;
      padding: 3rem 0 2.5rem; border-bottom: 1px solid var(--border); margin-bottom: 3rem;
    }
    .person-photo {
      aspect-ratio: 1; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); display: flex; align-items: center;
      justify-content: center; font-size: 3.5rem; overflow: hidden;
    }
    .person-photo img { width: 100%; height: 100%; object-fit: cover; }
    .person-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .person-info { display: flex; flex-direction: column; justify-content: center; }

    .filmography-section { margin-bottom: 4rem; }
    .section-header { display: flex; align-items: baseline; gap: 1rem; margin-bottom: 1.5rem; }
    .section-header h2 { margin: 0; }

    .movie-grid {
      display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1.25rem;
    }
    .movie-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; transition: transform var(--transition), box-shadow var(--transition); }
    .movie-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }

    .movie-poster-link { display: block; position: relative; aspect-ratio: 2/3; background: var(--surface-2); overflow: hidden; }
    .movie-poster-link img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
    .movie-card:hover .movie-poster-link img { transform: scale(1.05); }
    .no-poster { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; color: var(--text-dim); }

    .movie-overlay {
      position: absolute; inset: 0; background: rgba(0,0,0,0.5);
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.2s ease;
    }
    .movie-card:hover .movie-overlay { opacity: 1; }

    .movie-info { padding: 0.85rem; }
    .movie-title { font-family: var(--font-serif); font-size: 0.95rem; color: var(--text); margin-bottom: 0.3rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .movie-meta { font-size: 0.8rem; margin-bottom: 0.4rem; }

    @media(max-width: 600px) {
      .person-hero { grid-template-columns: 1fr; }
      .person-photo { max-width: 140px; }
    }
  `]
})
export class PersonDetailComponent implements OnInit {
  person: Person | null = null;
  movies: Movie[] = [];
  loading = true;
  moviesLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private personService: PersonService,
    private movieService: MovieService,
    private adminService: AdminService
  ) {}

  get currentAdmin() { return this.adminService.currentAdmin; }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.personService.getById(id).subscribe({
      next: p => {
        this.person = p;
        this.loading = false;
        // Load all movies and filter by this person
        this.movieService.getAll().subscribe(allMovies => {
          this.movies = allMovies.filter(m =>
            m.directorId === id || (m.actorIds && m.actorIds.includes(id))
          );
          this.moviesLoading = false;
        });
      },
      error: () => { this.loading = false; }
    });
  }

  deletePerson() {
    if (confirm('Remove this person?')) {
      this.personService.delete(this.person!.id).subscribe(() => this.router.navigate(['/people']));
    }
  }

  onImgError(e: Event) { (e.target as HTMLImageElement).style.display = 'none'; }
}
