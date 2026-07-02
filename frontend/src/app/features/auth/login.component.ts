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
        <div class="google-divider">
          <span>or continue with</span>
        </div>
        <button class="btn btn-outline w-full google-btn" (click)="loginWithGoogle()" [disabled]="loading">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48" style="margin-right: 10px; vertical-align: middle;">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.67H24v8.87h12.62c-.54 2.87-2.16 5.31-4.6 6.96v5.79h7.42C43.79 36.86 46.5 31.06 46.5 24z"/>
            <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.42-5.79c-2.06 1.38-4.7 2.2-8.47 2.2-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Google
        </button>
        <hr class="divider"/>
        <p class="text-sm text-muted" style="text-align:center;">
          New here? <a routerLink="/auth/register">Create an account →</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem;}
    .google-divider {
      display: flex;
      align-items: center;
      text-align: center;
      margin: 1.25rem 0;
      color: var(--text-dim);
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .google-divider::before, .google-divider::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--border);
    }
    .google-divider:not(:empty)::before {
      margin-right: .75rem;
    }
    .google-divider:not(:empty)::after {
      margin-left: .75rem;
    }
    .google-btn {
      transition: all 0.22s ease-in-out;
    }
    .google-btn:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--text-muted);
      transform: translateY(-1px);
    }
  `]
})
export class LoginComponent {
  username = ''; password = ''; error = ''; loading = false;
  constructor(private userService: UserService, private adminService: AdminService, private router: Router) {}
  loginWithGoogle() {
    this.loading = true;
    this.error = '';
    setTimeout(() => {
      const mockGoogleUser = {
        id: 'usr-google-001',
        username: 'GoogleUser',
        email: 'google_user@gmail.com',
        membershipType: 'FREE',
        active: true
      };
      localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser));
      (this.userService as any).currentUserSubject.next(mockGoogleUser);
      this.loading = false;
      this.router.navigate(['/movies']);
    }, 1200);
  }
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
