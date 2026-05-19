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

  register() {
    if (!this.isFormValid()) { this.error = 'Please fix the errors above before continuing.'; return; }
    this.loading = true; this.error = '';
    this.userService.register(this.username, this.email, this.password, this.membershipType).subscribe({
      next: () => { this.success = true; setTimeout(() => this.router.navigate(['/auth/login']), 1200); },
      error: e => { this.error = e.error?.error || 'Registration failed. Username or email may already be taken.'; this.loading = false; }
    });
  }
}
