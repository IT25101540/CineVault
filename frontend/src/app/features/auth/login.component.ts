import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AdminService } from '../../core/services/admin.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top:3.5rem;padding-bottom:4rem;">
      <div class="form-card">
        <div style="margin-bottom:2rem;">
          <p class="eyebrow">Welcome back</p>
          <h2>Sign in</h2>
        </div>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" [(ngModel)]="username" placeholder="Your username" (keyup.enter)="login()"/>
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" [(ngModel)]="password" placeholder="••••••••" (keyup.enter)="login()"/>
        </div>
        <button class="btn btn-primary w-full" style="margin-top:.5rem;" (click)="login()" [disabled]="loading">
          {{ loading ? 'Signing in…' : 'Sign in' }}
        </button>
        <hr class="divider"/>
        <p class="text-sm text-muted" style="text-align:center;">
          New here? <a routerLink="/auth/register">Create an account →</a>
        </p>
      </div>
    </div>
  `,
  styles: [`.eyebrow{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem;}`]
})
export class LoginComponent {
  username = ''; password = ''; error = ''; loading = false;
  constructor(private userService: UserService, private adminService: AdminService, private router: Router) {}
  login() {
    if (!this.username || !this.password) { this.error = 'Please fill in all fields.'; return; }
    this.loading = true; this.error = '';
    
    // First try user login
    this.userService.login(this.username, this.password).subscribe({
      next: u => this.router.navigate(['/movies']),
      error: e => {
        // Extract clean error message from backend JSON response
        const msg: string = e?.error?.error || e?.error || e?.message || '';

        // If backend is down (0 Unknown Error), skip admin attempt
        if (e.status === 0) {
          this.error = 'Cannot connect to server. Please ensure the backend is running.';
          this.loading = false;
          return;
        }

        // If account is locked, stop here
        if (msg.toLowerCase().includes('lock') || msg.toLowerCase().includes('inactive')) {
          this.error = msg;
          this.loading = false;
          return;
        }

        // Otherwise try admin login
        this.adminService.login(this.username, this.password).subscribe({
          next: a => {
            if (a.active) {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.adminService.logout();
              this.error = 'Your admin account is deactivated.';
              this.loading = false;
            }
          },
          error: () => {
            this.error = 'Invalid username or password.';
            this.loading = false;
          }
        });
      }
    });
  }
}
