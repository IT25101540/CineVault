import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AdminService } from '../../core/services/admin.service';
import { User, Admin } from '../../core/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="container">
      <div class="page-header flex-between">
        <h1>User Management</h1>
        <a routerLink="/auth/register" class="btn btn-primary btn-sm">+ New user</a>
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

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>
      <div class="table-wrap" *ngIf="!loading">
        <table>
          <thead>
            <tr><th>Username</th><th>Email</th><th>Membership</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>{{ u.username }}</td>
              <td class="text-muted text-sm">{{ u.email }}</td>
              <td>
                <span class="badge" 
                      [class.badge-gold]="u.membershipType==='ELITE'"
                      [class.badge-primary]="u.membershipType==='PREMIUM'"
                      [class.badge-gray]="u.membershipType==='FREE' || !u.membershipType">
                  {{ u.membershipType || 'FREE' }}
                </span>
              </td>
              <td>
                <span class="badge badge-green" *ngIf="u.active">Active</span>
                <span class="badge badge-red"   *ngIf="!u.active">Inactive</span>
              </td>
              <td style="display:flex;gap:.4rem;flex-wrap:wrap;">
                <div class="dropdown" *ngIf="currentAdmin?.role === 'SUPER_ADMIN' || currentAdmin?.role === 'USER_ADMIN'">
                  <button class="btn btn-outline btn-xs" (click)="toggleMembership(u)">Change Plan</button>
                </div>
                <button class="btn btn-danger btn-sm" (click)="toggleActive(u)" *ngIf="u.active">Deactivate</button>
                <button class="btn btn-outline btn-sm" (click)="toggleActive(u)" *ngIf="!u.active">Activate</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-muted text-sm" style="padding:.75rem 0;">{{ users.length }} users total</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-nav{display:flex;gap:.25rem;flex-wrap:wrap;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);}
    .admin-nav a{display:flex;align-items:center;gap:.35rem;color:var(--text-muted);font-size:.875rem;font-weight:500;padding:.4rem .75rem;border-radius:var(--radius);text-decoration:none;transition:all .18s;}
    .admin-nav a:hover,.admin-nav a.active{color:var(--text);background:var(--surface-2);}
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  currentAdmin: Admin | null = null;

  constructor(private userService: UserService, private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.currentAdmin = this.adminService.currentAdmin;
    if (!this.currentAdmin || !this.hasRole(['SUPER_ADMIN', 'USER_ADMIN'])) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    this.userService.getAll().subscribe({ next: u => { this.users = u; this.loading = false; }, error: () => { this.loading = false; } });
  }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }
  
  toggleActive(user: User) {
    const action = user.active ? 'Deactivate' : 'Activate';
    if (confirm(`${action} this user?`)) {
      this.userService.update(user.id, { active: !user.active }).subscribe({
        next: (updated) => {
          this.users = this.users.map(u => u.id === user.id ? updated : u);
        },
        error: (err) => {
          console.error(`Failed to ${action.toLowerCase()} user`, err);
          alert(`Failed to update user status.`);
        }
      });
    }
  }

  toggleMembership(user: User) {
    const plans: Array<'FREE' | 'PREMIUM' | 'ELITE'> = ['FREE', 'PREMIUM', 'ELITE'];
    const currentIndex = plans.indexOf(user.membershipType || 'FREE');
    const nextIndex = (currentIndex + 1) % plans.length;
    const nextPlan = plans[nextIndex];

    if (confirm(`Change ${user.username}'s membership from ${user.membershipType || 'FREE'} to ${nextPlan}?`)) {
      this.userService.update(user.id, { membershipType: nextPlan }).subscribe(updated => {
        this.users = this.users.map(u => u.id === user.id ? updated : u);
      });
    }
  }
}
