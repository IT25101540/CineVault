import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RentalService } from '../../core/services/rental.service';
import { AdminService } from '../../core/services/admin.service';
import { Rental, Admin } from '../../core/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-rentals',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Rental Management</h1>
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

      <!-- Filter pills -->
      <div class="genre-pills" style="margin-bottom:1.25rem;">
        <button class="pill" [class.active]="!filter" (click)="filter=null">All</button>
        <button class="pill" [class.active]="filter==='ACTIVE'"   (click)="filter='ACTIVE'">Active</button>
        <button class="pill" [class.active]="filter==='OVERDUE'"  (click)="filter='OVERDUE'">Overdue</button>
        <button class="pill" [class.active]="filter==='RETURNED'" (click)="filter='RETURNED'">Returned</button>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>
      <div class="table-wrap" *ngIf="!loading">
        <table>
          <thead>
            <tr><th>User</th><th>Movie</th><th>Rented</th><th>Due</th><th>Returned</th><th>Status</th><th>Fee</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of filtered" [style.background]="r.status==='OVERDUE' ? 'rgba(192,57,43,.06)' : ''">
              <td class="text-sm">
                <div style="display:flex;flex-direction:column;">
                  <span style="font-weight:600;">{{ r.username || r.userId }}</span>
                  <span class="text-muted" style="font-size:0.7rem;">{{ r.userEmail }}</span>
                </div>
              </td>
              <td class="text-sm">
                <a [routerLink]="['/movies', r.movieId]" class="text-accent" [title]="r.movieId">
                  {{ r.movieTitle || r.movieId }}
                </a>
              </td>
              <td class="text-xs text-muted">{{ r.rentalDate | date:'dd MMM yy' }}</td>
              <td class="text-xs text-muted">{{ r.dueDate | date:'dd MMM yy' }}</td>
              <td class="text-xs text-muted">{{ r.returnedDate ? (r.returnedDate | date:'dd MMM yy') : '—' }}</td>
              <td>
                <span class="badge badge-green"  *ngIf="r.status==='ACTIVE'">Active</span>
                <span class="badge badge-gray"   *ngIf="r.status==='RETURNED'">Returned</span>
                <span class="badge badge-red"    *ngIf="r.status==='OVERDUE'">Overdue</span>
              </td>
              <td class="text-sm">{{ r.totalFee > 0 ? ('$' + (r.totalFee | number:'1.2-2')) : '—' }}</td>
              <td style="display:flex; gap:0.5rem;">
                <button class="btn btn-outline btn-sm" *ngIf="r.status==='ACTIVE' || r.status==='OVERDUE'" (click)="returnMovie(r.id)">Return</button>
                <button class="btn btn-danger btn-sm" (click)="remove(r.id)">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-muted text-sm" style="padding:.75rem 0;">Showing {{ filtered.length }} of {{ rentals.length }} rentals</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-nav{display:flex;gap:.25rem;flex-wrap:wrap;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);}
    .admin-nav a{display:flex;align-items:center;gap:.35rem;color:var(--text-muted);font-size:.875rem;font-weight:500;padding:.4rem .75rem;border-radius:var(--radius);text-decoration:none;transition:all .18s;}
    .admin-nav a:hover,.admin-nav a.active{color:var(--text);background:var(--surface-2);}
  `]
})
export class AdminRentalsComponent implements OnInit {
  rentals: Rental[] = [];
  loading = true;
  filter: string | null = null;
  currentAdmin: Admin | null = null;
  get filtered() { return this.filter ? this.rentals.filter(r => r.status === this.filter) : this.rentals; }

  constructor(private rentalService: RentalService, private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.currentAdmin = this.adminService.currentAdmin;
    if (!this.currentAdmin || !this.hasRole(['SUPER_ADMIN', 'RENTAL_ADMIN'])) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }
    this.rentalService.getAll().subscribe({ next: r => { this.rentals = r; this.loading = false; }, error: () => { this.loading = false; } });
  }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }
  remove(id: string) {
    if (confirm('Remove this rental record?')) {
      this.rentalService.delete(id).subscribe(() => { this.rentals = this.rentals.filter(r => r.id !== id); });
    }
  }
  returnMovie(id: string) {
    if (confirm('Mark this rental as returned?')) {
      this.rentalService.returnMovie(id).subscribe(() => {
        const r = this.rentals.find(x => x.id === id);
        if (r) {
          r.status = 'RETURNED';
          r.returnedDate = new Date().toISOString();
        }
      });
    }
  }
}
