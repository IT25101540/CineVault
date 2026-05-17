import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../core/services/movie.service';
import { PersonService } from '../../core/services/person.service';
import { Movie, Person } from '../../core/models/models';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top:3rem;padding-bottom:4rem;">
      <div style="max-width:600px;">
        <div class="page-header">
          <p class="eyebrow">Admin</p>
          <h2>{{ isEdit ? 'Edit movie' : 'Add new movie' }}</h2>
        </div>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <!-- Basic Info -->
        <div class="form-group">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" [(ngModel)]="form.title" placeholder="Movie title" required/>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Genre</label>
            <select class="form-control" [(ngModel)]="form.genre">
              <option *ngFor="let g of genres" [value]="g">{{ g }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Release Year</label>
            <input type="number" class="form-control" [(ngModel)]="form.releaseYear" placeholder="2024"/>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Synopsis</label>
          <textarea class="form-control" [(ngModel)]="form.synopsis" placeholder="Brief description…"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Poster URL</label>
          <input type="url" class="form-control" [(ngModel)]="form.posterUrl" placeholder="https://…"/>
        </div>

        <!-- ── Director ── -->
        <div class="section-divider">
          <span>Director</span>
        </div>

        <div class="form-group" style="position:relative;">
          <input type="text" class="form-control"
                 [(ngModel)]="directorSearch"
                 (input)="filterDirectors()"
                 (focus)="showDirectorDrop=true"
                 (blur)="hideDirectorDrop()"
                 [placeholder]="selectedDirectorName ? 'Change director…' : 'Search or create director…'"
                 autocomplete="off"/>

          <div class="drop-list" *ngIf="showDirectorDrop">
            <div class="drop-item"
                 *ngFor="let d of filteredDirectors"
                 [class.sel]="form.directorId === d.id"
                 (mousedown)="pickDirector(d)">
              <span>{{ d.fullName }}</span>
              <span class="role-badge">{{ d.creditType }}</span>
            </div>
            <!-- Create new option -->
            <div class="drop-item create-item"
                 *ngIf="directorSearch.trim() && !exactDirectorMatch"
                 (mousedown)="createAndPickDirector()">
              <span class="material-symbols-outlined" style="font-size:1.1rem; vertical-align:middle; margin-right: 0.25rem;">add</span> Create "{{ directorSearch.trim() }}" as Director
            </div>
            <div class="drop-empty" *ngIf="!filteredDirectors.length && !directorSearch.trim()">
              No directors yet — start typing to create one
            </div>
          </div>

          <!-- Selected tag -->
          <div class="selected-tag" *ngIf="selectedDirectorName">
            <span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle;">movie</span> {{ selectedDirectorName }}
            <button type="button" (click)="clearDirector()"><span class="material-symbols-outlined" style="font-size:1rem;">close</span></button>
          </div>
        </div>

        <!-- ── Actors / Cast ── -->
        <div class="section-divider">
          <span>Cast (Actors)</span>
        </div>

        <div class="form-group" style="position:relative;">
          <input type="text" class="form-control"
                 [(ngModel)]="actorSearch"
                 (input)="filterActors()"
                 (focus)="showActorDrop=true"
                 (blur)="hideActorDrop()"
                 placeholder="Search or create actor, add multiple…"
                 autocomplete="off"/>

          <div class="drop-list" *ngIf="showActorDrop">
            <div class="drop-item"
                 *ngFor="let a of filteredActors"
                 [class.sel]="isActorSelected(a.id)"
                 (mousedown)="toggleActorSelect(a)">
              <span>{{ a.fullName }}</span>
              <span class="check-mark" *ngIf="isActorSelected(a.id)"><span class="material-symbols-outlined" style="font-size:1.1rem;">check</span></span>
              <span class="role-badge" *ngIf="!isActorSelected(a.id)">{{ a.creditType }}</span>
            </div>
            <!-- Create new option -->
            <div class="drop-item create-item"
                 *ngIf="actorSearch.trim() && !exactActorMatch"
                 (mousedown)="createAndAddActor()">
              <span class="material-symbols-outlined" style="font-size:1.1rem; vertical-align:middle; margin-right: 0.25rem;">add</span> Create "{{ actorSearch.trim() }}" as Actor
            </div>
            <div class="drop-empty" *ngIf="!filteredActors.length && !actorSearch.trim()">
              No actors yet — start typing to create one
            </div>
          </div>

          <!-- Actor Tags -->
          <div class="tag-row" *ngIf="selectedActorObjects.length">
            <span class="actor-tag" *ngFor="let a of selectedActorObjects">
              <span class="material-symbols-outlined" style="font-size:1rem; vertical-align:middle;">person</span> {{ a.fullName }}
              <button type="button" (click)="removeActor(a.id)"><span class="material-symbols-outlined" style="font-size:1rem;">close</span></button>
            </span>
          </div>
        </div>

        <!-- Submit -->
        <div style="display:flex;gap:.75rem;margin-top:1.5rem;">
          <button class="btn btn-primary" (click)="submit()" [disabled]="saving">
            {{ saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Add movie') }}
          </button>
          <a routerLink="/movies" class="btn btn-outline">Cancel</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow { font-size:.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.1em; color:var(--accent); margin-bottom:.4rem; }

    .section-divider {
      display:flex; align-items:center; gap:1rem; margin:1.5rem 0 1rem;
      color:var(--text-muted); font-size:.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.08em;
    }
    .section-divider::before, .section-divider::after { content:''; flex:1; height:1px; background:var(--border); }

    .drop-list {
      position:absolute; top:calc(100% - .25rem); left:0; right:0; z-index:999;
      background: var(--bg-2);
      border:1px solid rgba(255, 255, 255, 0.1);
      border-radius:0 0 var(--radius) var(--radius);
      max-height:200px; overflow-y:auto; box-shadow: 0 10px 30px rgba(0,0,0,0.8);
    }
    .drop-item {
      display:flex; align-items:center; justify-content:space-between;
      padding:.6rem 1rem; cursor:pointer; font-size:.875rem; color:var(--text);
      transition:background var(--transition);
    }
    .drop-item:hover, .drop-item.sel { background:rgba(255, 255, 255, 0.05); }
    .drop-item.create-item { color:var(--accent); font-style:italic; }
    .drop-item.create-item:hover { background:var(--accent-soft); }
    .drop-empty { padding:.75rem 1rem; color:var(--text-muted); font-size:.85rem; font-style:italic; }

    .role-badge { font-size:.7rem; padding:.15rem .4rem; border-radius:4px; background:rgba(255,255,255,0.05); color:var(--text-muted); }
    .check-mark { color:var(--accent); font-weight:bold; }

    .selected-tag {
      display:inline-flex; align-items:center; gap:.4rem; margin-top:.6rem;
      background:var(--accent-soft); border:1px solid rgba(249,115,22,0.3);
      color:var(--accent); border-radius:999px; padding:.25rem .75rem; font-size:.85rem;
    }
    .selected-tag button { background:none; border:none; cursor:pointer; color:var(--text-muted); font-size:.8rem; padding:0; }
    .selected-tag button:hover { color:var(--danger); }

    .tag-row { display:flex; flex-wrap:wrap; gap:.4rem; margin-top:.6rem; }
    .actor-tag {
      display:inline-flex; align-items:center; gap:.35rem;
      background:var(--accent-soft); border:1px solid rgba(249,115,22,0.2);
      color:var(--accent); border-radius:999px; padding:.25rem .75rem; font-size:.82rem;
    }
    .actor-tag button { background:none; border:none; cursor:pointer; color:var(--accent); font-size:.75rem; padding:0; }
    .actor-tag button:hover { color:var(--text); }
  `]
})
export class MovieFormComponent implements OnInit {
  form: Partial<Movie> = { genre: 'Drama', releaseYear: new Date().getFullYear(), actorIds: [] };
  isEdit = false;
  saving = false;
  error = '';
  genres = ['Action','Drama','Comedy','SciFi','Thriller','Horror','Crime','Animation','Romance','Documentary'];

  allDirectors: Person[] = [];
  allActors: Person[] = [];
  filteredDirectors: Person[] = [];
  filteredActors: Person[] = [];

  directorSearch = '';
  actorSearch = '';
  showDirectorDrop = false;
  showActorDrop = false;
  selectedDirectorName = '';

  private movieId = '';
  private directorBlurTimer: any;
  private actorBlurTimer: any;

  constructor(private route: ActivatedRoute, private router: Router,
              private movieService: MovieService, private personService: PersonService) {}

  ngOnInit() {
    this.loadPeople();
    this.movieId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.movieId;
    if (this.isEdit) {
      this.movieService.getById(this.movieId).subscribe(m => {
        this.form = { ...m };
        if (!this.form.actorIds) this.form.actorIds = [];
        if (m.directorId) {
          this.personService.getById(m.directorId).subscribe(p => {
            this.directorSearch = p.fullName;
            this.selectedDirectorName = p.fullName;
          });
        }
      });
    }
  }

  loadPeople() {
    this.personService.getAll().subscribe(people => {
      this.allDirectors = people.filter(p => p.creditType === 'DIRECTOR' || p.creditType === 'BOTH');
      this.allActors    = people.filter(p => p.creditType === 'ACTOR'    || p.creditType === 'BOTH');
      this.filteredDirectors = [...this.allDirectors];
      this.filteredActors    = [...this.allActors];
    });
  }

  // ── Director ──
  filterDirectors() {
    const q = this.directorSearch.toLowerCase();
    this.filteredDirectors = q
      ? this.allDirectors.filter(d => d.fullName.toLowerCase().includes(q))
      : [...this.allDirectors];
    this.showDirectorDrop = true;
    if (!q) { this.selectedDirectorName = ''; this.form.directorId = ''; }
  }

  get exactDirectorMatch(): boolean {
    return this.allDirectors.some(d => d.fullName.toLowerCase() === this.directorSearch.trim().toLowerCase());
  }

  pickDirector(d: Person) {
    this.form.directorId = d.id;
    this.directorSearch = d.fullName;
    this.selectedDirectorName = d.fullName;
    this.showDirectorDrop = false;
  }

  clearDirector() {
    this.form.directorId = '';
    this.directorSearch = '';
    this.selectedDirectorName = '';
  }

  createAndPickDirector() {
    const name = this.directorSearch.trim();
    if (!name) return;
    this.personService.create({ fullName: name, creditType: 'DIRECTOR', nationality: '', birthYear: 0, biography: '', photoUrl: '' })
      .subscribe(p => {
        this.allDirectors.push(p);
        this.pickDirector(p);
      });
  }

  hideDirectorDrop() { this.directorBlurTimer = setTimeout(() => this.showDirectorDrop = false, 200); }

  // ── Actors ──
  filterActors() {
    const q = this.actorSearch.toLowerCase();
    this.filteredActors = q
      ? this.allActors.filter(a => a.fullName.toLowerCase().includes(q))
      : [...this.allActors];
    this.showActorDrop = true;
  }

  get exactActorMatch(): boolean {
    return this.allActors.some(a => a.fullName.toLowerCase() === this.actorSearch.trim().toLowerCase());
  }

  isActorSelected(id: string): boolean {
    return (this.form.actorIds || []).includes(id);
  }

  toggleActorSelect(a: Person) {
    const ids = this.form.actorIds || [];
    this.form.actorIds = ids.includes(a.id) ? ids.filter(i => i !== a.id) : [...ids, a.id];
    this.actorSearch = '';
    this.filteredActors = [...this.allActors];
  }

  removeActor(id: string) {
    this.form.actorIds = (this.form.actorIds || []).filter(i => i !== id);
  }

  createAndAddActor() {
    const name = this.actorSearch.trim();
    if (!name) return;
    this.personService.create({ fullName: name, creditType: 'ACTOR', nationality: '', birthYear: 0, biography: '', photoUrl: '' })
      .subscribe(p => {
        this.allActors.push(p);
        this.filteredActors = [...this.allActors];
        this.toggleActorSelect(p);
      });
  }

  hideActorDrop() { this.actorBlurTimer = setTimeout(() => this.showActorDrop = false, 200); }

  get selectedActorObjects(): Person[] {
    return (this.form.actorIds || [])
      .map(id => this.allActors.find(a => a.id === id)!)
      .filter(Boolean);
  }

  submit() {
    if (!this.form.title) { this.error = 'Title is required.'; return; }
    this.saving = true; this.error = '';
    const op = this.isEdit
      ? this.movieService.update(this.movieId, this.form)
      : this.movieService.create(this.form);
    op.subscribe({
      next: m => this.router.navigate(['/movies', m.id]),
      error: e => { this.error = e.error?.error || 'An error occurred.'; this.saving = false; }
    });
  }
}
