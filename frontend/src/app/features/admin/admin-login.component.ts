import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top:3.5rem;padding-bottom:4rem;">
      <div class="form-card">
        <div style="margin-bottom:2rem;">
          <p class="eyebrow">Admin portal</p>
          <h2>Administrator login</h2>
        </div>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" [(ngModel)]="username" placeholder="Admin username" (keyup.enter)="login()"/>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="login()"/>
        </div>
        <button class="btn btn-primary w-full" (click)="login()" [disabled]="loading">
          {{ loading ? 'Signing in…' : 'Sign in as admin' }}
        </button>
        <hr class="divider"/>
        <p class="text-xs text-muted" style="text-align:center;">
          <a routerLink="/auth/login">← User login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`.eyebrow{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem;}`]
})
export class AdminLoginComponent {
  username = ''; password = ''; error = ''; loading = false;
  constructor(private adminService: AdminService, private router: Router) {}
  login() {
    if (!this.username || !this.password) { this.error = 'Please fill in all fields.'; return; }
    this.loading = true; this.error = '';
    this.adminService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: e => { this.error = e.error?.error || 'Invalid credentials.'; this.loading = false; }
    });
  }
}
