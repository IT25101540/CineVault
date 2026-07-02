import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top:3.5rem;padding-bottom:4rem;">
      <div class="form-card">
        <div style="margin-bottom:2rem;">
          <p class="eyebrow">Get started</p>
          <h2>Create your account</h2>
        </div>
        <div class="alert alert-error"   *ngIf="error">{{ error }}</div>
        <div class="alert alert-success" *ngIf="success">Account created! Redirecting…</div>

        <!-- Username -->
        <div class="form-group">
          <label class="form-label">Username</label>
          <input type="text" class="form-control" [(ngModel)]="username" placeholder="e.g. john_doe"
                 [style.border-color]="username && !isUsernameValid() ? 'var(--danger)' : ''"/>
          <div class="validation-hints" *ngIf="username">
            <span class="hint" [class.ok]="username.length >= 4">✓ At least 4 characters</span>
            <span class="hint" [class.ok]="username.length <= 20">✓ Max 20 characters</span>
            <span class="hint" [class.ok]="noSpaces(username)">✓ No spaces allowed</span>
          </div>
        </div>

        <!-- Email -->
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input type="email" class="form-control" [(ngModel)]="email" placeholder="you&#64;example.com"
                 [style.border-color]="email && !isEmailValid() ? 'var(--danger)' : ''"/>
          <div class="validation-hints" *ngIf="email">
            <span class="hint" [class.ok]="isEmailValid()">✓ Valid email format (e.g. user&#64;example.com)</span>
          </div>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" [(ngModel)]="password" placeholder="••••••••"
                 [style.border-color]="password && !isPasswordValid() ? 'var(--danger)' : ''"/>
          <div class="validation-hints" *ngIf="password">
            <span class="hint" [class.ok]="password.length >= 8">✓ At least 8 characters</span>
            <span class="hint" [class.ok]="hasUppercase(password)">✓ At least one uppercase letter (A-Z)</span>
            <span class="hint" [class.ok]="hasLowercase(password)">✓ At least one lowercase letter (a-z)</span>
            <span class="hint" [class.ok]="hasNumber(password)">✓ At least one number (0-9)</span>
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label class="form-label">Confirm Password</label>
          <input type="password" class="form-control" [(ngModel)]="confirmPassword" placeholder="••••••••"
                 [style.border-color]="confirmPassword && password !== confirmPassword ? 'var(--danger)' : ''"/>
          <div class="validation-hints" *ngIf="confirmPassword">
            <span class="hint" [class.ok]="password === confirmPassword">✓ Passwords match</span>
          </div>
        </div>


        <button class="btn btn-primary w-full" style="margin-top:.5rem;" (click)="register()" [disabled]="loading || !isFormValid()">
          {{ loading ? 'Creating…' : 'Create account' }}
        </button>
        <div class="google-divider">
          <span>or sign up with</span>
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
          Already have an account? <a routerLink="/auth/login">Sign in →</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem;}
    .validation-hints{display:flex;flex-direction:column;gap:.25rem;margin-top:.5rem;}
    .hint{font-size:.75rem;color:var(--text-muted);transition:color .2s;}
    .hint.ok{color:#4ade80;}
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
export class RegisterComponent {
  username = ''; email = ''; password = ''; confirmPassword = ''; membershipType = 'FREE';
  error = ''; success = false; loading = false;

  constructor(private userService: UserService, private router: Router) {}

  isUsernameValid(): boolean {
    return this.username.length >= 4 && this.username.length <= 20 && this.noSpaces(this.username);
  }
  isEmailValid(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
  isPasswordValid(): boolean {
    return this.password.length >= 8 && this.hasUppercase(this.password)
        && this.hasLowercase(this.password) && this.hasNumber(this.password);
  }
  isFormValid(): boolean {
    return this.isUsernameValid() && this.isEmailValid() && this.isPasswordValid() && this.password === this.confirmPassword;
  }

  noSpaces(val: string): boolean { return !/\s/.test(val); }
  hasUppercase(val: string): boolean { return /[A-Z]/.test(val); }
  hasLowercase(val: string): boolean { return /[a-z]/.test(val); }
  hasNumber(val: string): boolean { return /[0-9]/.test(val); }

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
  register() {
    if (!this.isFormValid()) { this.error = 'Please fix the errors above before continuing.'; return; }
    this.loading = true; this.error = '';
    this.userService.register(this.username, this.email, this.password, this.membershipType).subscribe({
      next: () => { this.success = true; setTimeout(() => this.router.navigate(['/auth/login']), 1200); },
      error: e => { this.error = e.error?.error || 'Registration failed. Username or email may already be taken.'; this.loading = false; }
    });
  }
}
