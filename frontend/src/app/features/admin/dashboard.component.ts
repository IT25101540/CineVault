import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';
import { DashboardStats, Admin } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <p class="eyebrow">Overview</p>
        <h1>Admin Dashboard</h1>
      </div>

      <!-- Admin Nav -->
      <div class="admin-nav" *ngIf="currentAdmin">
        <a routerLink="/admin/dashboard" routerLinkActive="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Dashboard
        </a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'USER_ADMIN'])" routerLink="/admin/users" routerLinkActive="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          Users
        </a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'REVIEW_ADMIN'])" routerLink="/admin/reviews" routerLinkActive="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Reviews
        </a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'RENTAL_ADMIN'])" routerLink="/admin/rentals" routerLinkActive="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          Rentals
        </a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'ADMIN_ADMIN'])" routerLink="/admin/admins" routerLinkActive="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Admins
        </a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" routerLink="/movies/add" routerLinkActive="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
          Add Movie
        </a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'PERSON_ADMIN'])" routerLink="/people/add" routerLinkActive="active">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Add Person
        </a>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading && stats">
        <!-- KPI Cards -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <p class="kpi-label">Total Users</p>
            <p class="kpi-value">{{ stats.totalUsers }}</p>
          </div>
          <div class="kpi-card">
            <p class="kpi-label">Total Movies</p>
            <p class="kpi-value">{{ stats.totalMovies }}</p>
          </div>
          <div class="kpi-card">
            <p class="kpi-label">Active Rentals</p>
            <p class="kpi-value">{{ stats.activeRentals }}</p>
          </div>
          <div class="kpi-card">
            <p class="kpi-label">Hidden Reviews</p>
            <p class="kpi-value">{{ stats.flaggedReviews }}</p>
          </div>
        </div>

        <!-- Revenue Stats Widget (NEW Feature Component) -->
        <div class="dashboard-row" style="margin-bottom: 2rem; display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem;">
          <div class="widget-card">
            <h3 class="widget-title">Financial Revenue Dashboard</h3>
            <p class="text-xs text-muted" style="margin-bottom: 1rem;">Real-time income tracks from CineVault movie rental transactions</p>
            <div class="revenue-grid" *ngIf="revenue">
              <div class="rev-card">
                <span class="rev-label">Daily Income</span>
                <span class="rev-value">LKR {{ revenue.dailyRevenue | number:'1.2-2' }}</span>
              </div>
              <div class="rev-card">
                <span class="rev-label">Monthly Income</span>
                <span class="rev-value">LKR {{ revenue.monthlyRevenue | number:'1.2-2' }}</span>
              </div>
              <div class="rev-card highlight">
                <span class="rev-label">Total Earnings</span>
                <span class="rev-value">LKR {{ revenue.totalRevenue | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <div class="widget-card">
            <h3 class="widget-title">Promo Code Generator</h3>
            <p class="text-xs text-muted" style="margin-bottom: 1rem;">Create new discount codes for users</p>
            <form (submit)="createPromoCode($event)">
              <div class="form-group" style="margin-bottom: 0.75rem;">
                <label class="text-xs text-muted">Promo Code</label>
                <input type="text" [(ngModel)]="newPromoCode" name="code" class="form-control text-sm" placeholder="e.g. SAVE20" required />
              </div>
              <div class="form-group" style="margin-bottom: 1rem;">
                <label class="text-xs text-muted">Discount Percentage (%)</label>
                <input type="number" min="1" max="100" [(ngModel)]="newDiscount" name="discount" class="form-control text-sm" placeholder="e.g. 20" required />
              </div>
              <button type="submit" class="btn btn-primary btn-sm btn-block">Generate Code</button>
            </form>
            <div *ngIf="generatedPromo" class="promo-success-alert text-xs">
              Generated: <strong>{{ generatedPromo.code }}</strong> ({{ generatedPromo.discountPercentage }}% Off)
            </div>
          </div>
        </div>

        <!-- Quick action cards -->
        <h3 style="margin-bottom:1rem;color:var(--text-muted);font-weight:500;letter-spacing:.02em;font-size:.85rem;">Quick Actions</h3>
        <div class="quick-grid">
          <a *ngIf="hasRole(['SUPER_ADMIN', 'USER_ADMIN'])" routerLink="/admin/users" style="text-decoration:none;">
            <div class="quick-card">
              <div class="quick-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <p class="card-title">User Management</p>
              <p class="card-text text-xs">View, deactivate, manage all user accounts</p>
            </div>
          </a>
          <a *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" routerLink="/movies" style="text-decoration:none;">
            <div class="quick-card">
              <div class="quick-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
              </div>
              <p class="card-title">Movie Catalogue</p>
              <p class="card-text text-xs">Browse, add, edit and remove movies</p>
            </div>
          </a>
          <a *ngIf="hasRole(['SUPER_ADMIN', 'REVIEW_ADMIN'])" routerLink="/admin/reviews" style="text-decoration:none;">
            <div class="quick-card">
              <div class="quick-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </div>
              <p class="card-title">Review Moderation</p>
              <p class="card-text text-xs">Flag and hide inappropriate reviews</p>
            </div>
          </a>
          <a *ngIf="hasRole(['SUPER_ADMIN', 'RENTAL_ADMIN'])" routerLink="/admin/rentals" style="text-decoration:none;">
            <div class="quick-card">
              <div class="quick-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
              </div>
              <p class="card-title">Rental Dashboard</p>
              <p class="card-text text-xs">Monitor active and overdue rentals</p>
            </div>
          </a>
          <a *ngIf="hasRole(['SUPER_ADMIN', 'PERSON_ADMIN'])" routerLink="/people" style="text-decoration:none;">
            <div class="quick-card">
              <div class="quick-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <p class="card-title">Directors &amp; Cast</p>
              <p class="card-text text-xs">Manage people linked to movies</p>
            </div>
          </a>
          <a *ngIf="hasRole(['SUPER_ADMIN', 'ADMIN_ADMIN'])" routerLink="/admin/admins" style="text-decoration:none;">
            <div class="quick-card">
              <div class="quick-icon-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <p class="card-title">Admin Accounts</p>
              <p class="card-text text-xs">Add or deactivate admin users</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.4rem;}
    .admin-nav{display:flex;gap:.25rem;flex-wrap:wrap;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);}
    .admin-nav a{display:flex;align-items:center;gap:.4rem;color:var(--text-muted);font-size:.875rem;font-weight:500;padding:.4rem .75rem;border-radius:var(--radius);text-decoration:none;transition:all .18s;}
    .admin-nav a:hover,.admin-nav a.active{color:var(--text);background:var(--surface-2);}
    .admin-nav svg{flex-shrink:0;}
    .quick-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;}
    .quick-card{background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;transition:all .2s;cursor:pointer;}
    .quick-card:hover{border-color:var(--accent);transform:translateY(-2px);box-shadow:0 4px 20px rgba(0,0,0,.3);}
    .quick-icon-wrap{width:42px;height:42px;border-radius:var(--radius);background:var(--surface-2);display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:var(--accent);}
    
    .widget-card{background:var(--surface-1);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.5rem;}
    .widget-title{font-size:1.1rem;font-weight:600;color:var(--text);margin-bottom:0.25rem;}
    .revenue-grid{display:flex;flex-direction:column;gap:0.75rem;}
    .rev-card{display:flex;justify-content:space-between;align-items:center;padding:0.75rem 1rem;background:var(--surface-2);border-radius:var(--radius);border:1px solid var(--border);}
    .rev-card.highlight{background:linear-gradient(135deg, rgba(var(--accent-rgb), 0.15), rgba(var(--accent-rgb), 0.05));border-color:var(--accent);}
    .rev-label{font-size:0.875rem;color:var(--text-muted);font-weight:500;}
    .rev-value{font-size:1.1rem;font-weight:700;color:var(--text);}
    .rev-card.highlight .rev-value{color:var(--accent);}
    
    .form-group{display:flex;flex-direction:column;gap:.35rem;}
    .form-control{background:var(--surface-2);border:1px solid var(--border);color:var(--text);padding:.5rem .75rem;border-radius:var(--radius);font-size:.9rem;outline:none;transition:border-color 0.15s;}
    .form-control:focus{border-color:var(--accent);}
    .btn-block{width:100%;text-align:center;justify-content:center;}
    .promo-success-alert{margin-top:0.75rem;padding:0.5rem .75rem;background:rgba(46,204,113,0.15);border:1px solid #2ecc71;border-radius:var(--radius);color:#2ecc71;text-align:center;}
    
    @media(max-width:800px){
      .dashboard-row{grid-template-columns:1fr !important;}
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  currentAdmin: Admin | null = null;
  
  // New States
  revenue: any = null;
  newPromoCode = '';
  newDiscount: number | null = null;
  generatedPromo: any = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.currentAdmin = this.adminService.currentAdmin;
    this.adminService.getDashboard().subscribe({
      next: s => { 
        this.stats = s; 
        this.loading = false; 
      },
      error: () => { this.loading = false; }
    });
    
    // Fetch Revenue Stats
    this.adminService.getRevenueStats().subscribe({
      next: rev => { this.revenue = rev; },
      error: (err) => { console.error("Failed to load revenue", err); }
    });
  }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }

  createPromoCode(event: Event) {
    event.preventDefault();
    if (!this.newPromoCode || !this.newDiscount) return;
    this.adminService.generatePromoCode(this.newPromoCode, this.newDiscount).subscribe({
      next: (promo) => {
        this.generatedPromo = promo;
        this.newPromoCode = '';
        this.newDiscount = null;
      },
      error: (err) => {
        console.error("Failed to generate promo code", err);
        alert("Failed to generate promo code.");
      }
    });
  }
}
