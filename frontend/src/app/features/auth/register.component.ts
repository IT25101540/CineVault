import { Component, OnInit } from '@angular/core';
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

    <!-- Google Account Chooser Modal Overlay -->
    <!-- Google Account Chooser Modal Overlay -->
    <!-- Google Client ID Configuration Modal Overlay -->
    <div class="google-modal-overlay" *ngIf="showGoogleDetailsModal">
      <div class="google-modal-card">
        <button class="google-close-btn" (click)="showGoogleDetailsModal = false; loading = false;">✕</button>
        <div style="width: 100%;">
          <div class="google-header" style="text-align: left; align-items: flex-start; margin-bottom: 1.5rem;">
            <h3 class="google-title" style="margin-top: 0; margin-bottom: 0.25rem;">Complete Google Sign-In</h3>
            <p class="google-subtitle">Please enter a Username and Password to connect your Google account.</p>
          </div>
          <div class="alert alert-error" *ngIf="modalError" style="margin-bottom: 1rem;">{{ modalError }}</div>
          <div>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.7rem;">Email (Google)</label>
              <input type="text" class="form-control" [value]="googleEmail" disabled style="opacity: 0.65; background: rgba(255,255,255,0.05);"/>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.7rem;">Username</label>
              <input type="text" class="form-control" [(ngModel)]="googleUsernameInput" placeholder="Choose a username"/>
            </div>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.7rem;">Password</label>
              <input type="password" class="form-control" [(ngModel)]="googlePasswordInput" placeholder="••••••••" (keyup.enter)="submitGoogleDetails()"/>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <button class="btn btn-ghost btn-sm" (click)="showGoogleDetailsModal = false; loading = false;" style="padding-left: 0; padding-right: 0;">Cancel</button>
              <button class="btn btn-primary btn-sm" (click)="submitGoogleDetails()" [disabled]="!googleUsernameInput || !googlePasswordInput">Sign In</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="google-modal-overlay" *ngIf="showGoogleChooser">
      <div class="google-modal-card">
        <button class="google-close-btn" (click)="closeGoogleChooser()">✕</button>
        <div style="width: 100%;">
          <div class="google-header" style="text-align: left; align-items: flex-start; margin-bottom: 1.5rem;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.67H24v8.87h12.62c-.54 2.87-2.16 5.31-4.6 6.96v5.79h7.42C43.79 36.86 46.5 31.06 46.5 24z"/>
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.42-5.79c-2.06 1.38-4.7 2.2-8.47 2.2-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <h3 class="google-title" style="margin-top: 0.5rem; margin-bottom: 0.25rem;">Configure Google Login</h3>
            <p class="google-subtitle">Enter your Google OAuth Client ID to connect real Google accounts.</p>
          </div>
          <div>
            <div class="form-group">
              <label class="form-label" style="font-size: 0.7rem;">Google Client ID</label>
              <input type="text" class="form-control" [(ngModel)]="clientIdInput" placeholder="xxxx-xxxx.apps.googleusercontent.com" style="background: transparent; border-color: rgba(255,255,255,0.15);" (keyup.enter)="saveGoogleClientId()"/>
            </div>
            <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <button class="btn btn-ghost btn-sm" (click)="closeGoogleChooser()" style="padding-left: 0; padding-right: 0;">Cancel</button>
              <button class="btn btn-primary btn-sm" (click)="saveGoogleClientId()" [disabled]="!clientIdInput">Save & Continue</button>
            </div>
            <p class="text-muted" style="font-size: 0.7rem; margin-top: 1rem; line-height: 1.4;">
              * You can generate a Client ID in the Google Cloud Console. Make sure <code>http://localhost:4200</code> is added to your Authorized JavaScript Origins.
            </p>
          </div>
        </div>
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

    /* Google Chooser Modal */
    .google-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .google-modal-card {
      background: #0d0d1e;
      border: 1px solid var(--border);
      border-radius: 16px;
      width: 100%;
      max-width: 380px;
      padding: 2.25rem 2rem;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .google-close-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      transition: color 0.15s;
    }
    .google-close-btn:hover {
      color: var(--text);
    }
    .google-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      width: 100%;
    }
    .google-title {
      font-family: var(--font-sans);
      font-size: 1.35rem;
      font-weight: 500;
      color: var(--text);
      margin-top: 0.75rem;
      margin-bottom: 0.25rem;
      text-transform: none; /* Do not lowercase */
    }
    .google-subtitle {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .google-accounts-box {
      width: 100%;
      margin-top: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .google-account-row {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 0.75rem 1rem;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      cursor: pointer;
      text-align: left;
      transition: background 0.15s;
    }
    .google-account-row:last-child {
      border-bottom: none;
    }
    .google-account-row:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    .google-avatar-img-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .marshmello-avatar {
      background: #ffffff;
    }
    .marshmello-face {
      width: 100%;
      height: 100%;
    }
    .google-account-row-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 0.85rem;
      overflow: hidden;
    }
    .google-account-row-name {
      font-size: 0.85rem;
      font-weight: 500;
      color: #e3e3e3;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .google-account-row-email {
      font-size: 0.75rem;
      color: #9aa0a6;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .google-account-row-arrow {
      color: #9aa0a6;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
    }
    .google-account-row:hover .google-account-row-arrow {
      opacity: 1;
    }
    .google-actions-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin-top: 1.5rem;
      gap: 1rem;
    }
    .google-action-btn {
      flex: 1;
      border-radius: 100px;
      padding: 0.55rem 1rem;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      text-align: center;
      transition: background 0.15s, border-color 0.15s;
    }
    .google-btn-outline {
      background: transparent;
      border: 1px solid #8ab4f8;
      color: #8ab4f8;
    }
    .google-btn-outline:hover {
      background: rgba(138, 180, 248, 0.08);
    }
    .google-btn-cancel {
      background: #303134;
      border: 1px solid transparent;
      color: #e8eaed;
    }
    .google-btn-cancel:hover {
      background: #3c4043;
    }
    .google-footer {
      margin-top: 1.5rem;
      font-size: 0.72rem;
      color: var(--text-dim);
      line-height: 1.4;
      text-align: center;
    }
  `]
})
export class RegisterComponent implements OnInit {
  username = ''; email = ''; password = ''; confirmPassword = ''; membershipType = 'FREE';
  error = ''; success = false; loading = false;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.initializeGoogleOneTap();
  }

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

  // Google OAuth state
  showGoogleChooser = false;
  googleClientId = localStorage.getItem('googleClientId') || '';
  clientIdInput = '';

  // Google credentials modal state
  showGoogleDetailsModal = false;
  googleEmail = '';
  googleName = '';
  googleId = '';
  googleUsernameInput = '';
  googlePasswordInput = '';
  modalError = '';


  loginWithGoogle() {
    if (!this.googleClientId) {
      this.showGoogleChooser = true;
      return;
    }
    this.loading = true;
    try {
      const googleObj = (window as any).google;
      if (googleObj) {
        const tokenClient = googleObj.accounts.oauth2.initTokenClient({
          client_id: this.googleClientId,
          scope: 'email profile openid',
          callback: (tokenResponse: any) => {
            if (tokenResponse && tokenResponse.access_token) {
              fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`)
                .then(res => res.json())
                .then(profile => {
                  this.selectGoogleAccount(profile.name, profile.email, 'usr-google-' + profile.sub.substring(0, 8));
                })
                .catch(err => {
                  console.error('Error fetching user info:', err);
                  this.error = 'Failed to retrieve profile info from Google.';
                  this.loading = false;
                });
            } else {
              this.loading = false;
            }
          },
          error_callback: (err: any) => {
            console.error('Google OAuth error:', err);
            this.error = 'Google Sign-In failed.';
            this.loading = false;
          }
        });
        tokenClient.requestAccessToken({ prompt: 'select_account' });
      } else {
        this.error = 'Google Client Library not loaded. Please refresh the page.';
        this.loading = false;
      }
    } catch (err) {
      console.error('Error initiating Google Login:', err);
      this.error = 'Google Sign-In failed.';
      this.loading = false;
    }
  }

  closeGoogleChooser() {
    this.showGoogleChooser = false;
  }

  saveGoogleClientId() {
    const id = this.clientIdInput.trim();
    if (id) {
      this.googleClientId = id;
      localStorage.setItem('googleClientId', id);
      this.showGoogleChooser = false;
      this.initializeGoogleOneTap();
      this.loginWithGoogle();
    }
  }

  initializeGoogleOneTap() {
    if (!this.googleClientId) return;
    setTimeout(() => {
      try {
        const googleObj = (window as any).google;
        if (googleObj) {
          googleObj.accounts.id.initialize({
            client_id: this.googleClientId,
            callback: (response: any) => this.handleRealGoogleResponse(response),
            auto_select: false
          });
          googleObj.accounts.id.prompt();
        }
      } catch (err) {
        console.error('Error initializing Google One Tap:', err);
      }
    }, 500);
  }

  handleRealGoogleResponse(response: any) {
    const payload = this.decodeJWT(response.credential);
    if (payload) {
      this.selectGoogleAccount(payload.name, payload.email, 'usr-google-' + payload.sub.substring(0, 8));
    }
  }

  decodeJWT(token: string) {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('JWT decoding failed', e);
      return null;
    }
  }

  selectGoogleAccount(name: string, email: string, id: string) {
    this.googleName = name;
    this.googleEmail = email;
    this.googleId = id;
    this.googleUsernameInput = name.replace(/\s+/g, '').toLowerCase();
    this.googlePasswordInput = '';
    this.modalError = '';
    this.showGoogleDetailsModal = true;
    this.loading = false;
  }

  submitGoogleDetails() {
    if (!this.googleUsernameInput || !this.googlePasswordInput) {
      this.modalError = 'Please fill in all fields.';
      return;
    }
    this.loading = true;
    this.modalError = '';

    const username = this.googleUsernameInput.trim();
    const password = this.googlePasswordInput;

    // First try registering the user
    this.userService.register(username, this.googleEmail, password, 'FREE').subscribe({
      next: (registeredUser) => {
        // Registration success, log them in
        this.userService.login(username, password).subscribe({
          next: (loggedInUser) => {
            this.loading = false;
            this.showGoogleDetailsModal = false;
            this.router.navigate(['/movies']);
          },
          error: (err) => {
            console.error('Login after registration failed:', err);
            this.modalError = 'Login failed after registration.';
            this.loading = false;
          }
        });
      },
      error: (regErr) => {
        // If registration failed (e.g. username taken), try logging in to see if it's their existing account
        this.userService.login(username, password).subscribe({
          next: (loggedInUser) => {
            this.loading = false;
            this.showGoogleDetailsModal = false;
            this.router.navigate(['/movies']);
          },
          error: (loginErr) => {
            console.error('Login attempt failed:', loginErr);
            this.modalError = regErr.error?.error || 'Username is already taken or invalid password.';
            this.loading = false;
          }
        });
      }
    });
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
