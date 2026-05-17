import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../core/services/person.service';
import { AdminService } from '../../core/services/admin.service';
import { Person } from '../../core/models/models';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container">
      <div class="page-header flex-between">
        <div>
          <h1>Directors &amp; Cast</h1>
          <p>Browse people behind and in front of the camera</p>
        </div>
        <!-- Only admins see the Add Person button -->
        <a *ngIf="hasRole(['SUPER_ADMIN', 'PERSON_ADMIN'])" routerLink="/people/add" class="btn btn-primary btn-sm">+ Add person</a>
      </div>

      <div class="search-bar">
        <input type="text" class="form-control" placeholder="Search by name…"
               [(ngModel)]="searchTerm" (keyup.enter)="search()"/>
        <button class="btn btn-outline" (click)="search()">Search</button>
        <button class="btn btn-ghost" *ngIf="searchTerm" (click)="clearSearch()">Clear</button>
      </div>

      <div class="genre-pills">
        <button class="pill" [class.active]="!activeType" (click)="filterType(null)">All</button>
        <button class="pill" [class.active]="activeType==='DIRECTOR'" (click)="filterType('DIRECTOR')">Directors</button>
        <button class="pill" [class.active]="activeType==='ACTOR'"    (click)="filterType('ACTOR')">Actors</button>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div class="person-grid" *ngIf="!loading && people.length">
        <div class="card" *ngFor="let p of people" style="padding:1.25rem;text-align:center;">
          <div class="person-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <!-- Deactivated Overlay -->
          <div class="deactivated-overlay" *ngIf="p.active === false">
            <span class="badge badge-red">DEACTIVATED</span>
          </div>
          <p class="card-title" style="margin-top:.75rem;">{{ p.fullName }}</p>
          <p class="card-text text-xs">
            <span class="badge badge-gold" *ngIf="p.creditType==='DIRECTOR'">Director</span>
            <span class="badge badge-gray" *ngIf="p.creditType==='ACTOR'">Actor</span>
            <span class="badge badge-gold" *ngIf="p.creditType==='BOTH'">Director / Actor</span>
          </p>
          <p class="text-xs text-muted" style="margin-top:.25rem;">{{ p.nationality }}</p>
          <div style="display:flex;gap:.5rem;justify-content:center;margin-top:.75rem;flex-wrap:wrap;">
            <a [routerLink]="['/people', p.id]" class="btn btn-outline btn-sm">View →</a>
            <!-- Admin actions -->
            <ng-container *ngIf="hasRole(['SUPER_ADMIN', 'PERSON_ADMIN'])">
              <a [routerLink]="['/people', p.id, 'edit']" class="btn btn-ghost btn-sm">Edit</a>
              <button class="btn btn-xs" 
                      [class.btn-outline]="p.active !== false" 
                      [class.btn-primary]="p.active === false"
                      (click)="toggleStatus(p)">
                <span class="material-symbols-outlined" style="font-size: 1.1rem;">
                  {{ p.active === false ? 'visibility' : 'visibility_off' }}
                </span>
              </button>
            </ng-container>
          </div>
        </div>
      </div>
      <p *ngIf="!loading && !people.length" class="text-muted" style="padding:3rem 0;">No people found.</p>
    </div>
  `,
  styles: [`
    .person-grid { display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:1.25rem; }
    .person-avatar { width:100%;aspect-ratio:1;background:var(--surface-2);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;font-size:2.5rem; }
    .deactivated-overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6); display: flex; align-items: center;
      justify-content: center; pointer-events: none; z-index: 5;
    }
    .card { position: relative; overflow: hidden; }
  `]
})
export class PeopleListComponent implements OnInit {
  people: Person[] = [];
  loading = true;
  searchTerm = '';
  activeType: string | null = null;

  constructor(private personService: PersonService, private adminService: AdminService) {}
  get currentAdmin() { return this.adminService.currentAdmin; }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }

  ngOnInit() { this.load(); }
  load() {
    this.loading = true;
    this.personService.getAll(this.searchTerm || undefined, this.activeType || undefined).subscribe({
      next: p => { this.people = p; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
  search() { this.activeType = null; this.load(); }
  clearSearch() { this.searchTerm = ''; this.load(); }
  filterType(t: string | null) { this.activeType = t; this.searchTerm = ''; this.load(); }

  toggleStatus(person: Person) {
    const newState = person.active === false ? true : false;
    const action = newState ? 'activate' : 'deactivate';
    if (confirm(`Are you sure you want to ${action} "${person.fullName}"?`)) {
      this.personService.update(person.id, { active: newState }).subscribe({
        next: (updated) => {
          person.active = updated.active;
        },
        error: (err) => {
          console.error('Failed to toggle status', err);
          alert('Failed to update person status.');
        }
      });
    }
  }
}
