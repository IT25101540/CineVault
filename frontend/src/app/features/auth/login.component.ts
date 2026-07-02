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

    <!-- Google Account Chooser Modal Overlay -->
    <div class="google-modal-overlay" *ngIf="showGoogleChooser">
      <div class="google-modal-card">
        <button class="google-close-btn" (click)="closeGoogleChooser()">✕</button>

        <!-- 1. Real Google Login configuration/prompt -->
        <ng-container *ngIf="showRealGooglePrompt">
          <!-- Configuration / paste Client ID prompt -->
          <div *ngIf="!googleClientId" style="width: 100%;">
            <div class="google-header" style="text-align: left; align-items: flex-start;">
              <h3 class="google-title" style="margin-bottom: 0.25rem;">Configure Google Login</h3>
              <p class="google-subtitle">Enter your Google OAuth Client ID to connect real Google accounts.</p>
            </div>
            <div style="margin-top: 1.5rem; width: 100%;">
              <div class="form-group">
                <label class="form-label" style="font-size: 0.7rem;">Google Client ID</label>
                <input type="text" class="form-control" [(ngModel)]="clientIdInput" placeholder="xxxx-xxxx.apps.googleusercontent.com" style="background: transparent; border-color: rgba(255,255,255,0.15);" (keyup.enter)="saveGoogleClientId()"/>
              </div>
              <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <button class="btn btn-ghost btn-sm" (click)="showRealGooglePrompt = false" style="padding-left: 0; padding-right: 0;">Back</button>
                <button class="btn btn-primary btn-sm" (click)="saveGoogleClientId()" [disabled]="!clientIdInput">Save & Continue</button>
              </div>
              <p class="text-muted" style="font-size: 0.7rem; margin-top: 1rem; line-height: 1.4;">
                * You can get a Client ID from the Google Cloud Console. Make sure <code>http://localhost:4200</code> is in your Authorized JavaScript Origins.
              </p>
            </div>
          </div>

          <!-- Official Google sign in button container -->
          <div *ngIf="googleClientId" style="width: 100%; display: flex; flex-direction: column; align-items: center;">
            <div class="google-header" style="margin-bottom: 1.5rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.67H24v8.87h12.62c-.54 2.87-2.16 5.31-4.6 6.96v5.79h7.42C43.79 36.86 46.5 31.06 46.5 24z"/>
                <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.42-5.79c-2.06 1.38-4.7 2.2-8.47 2.2-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <h3 class="google-title">Sign in with Google</h3>
              <p class="google-subtitle">Real Google Sign-In is configured. Use the button below to continue.</p>
            </div>
            
            <!-- Real Google Button Placeholder -->
            <div id="real-google-btn-container" style="margin: 1rem 0; min-height: 40px; width: 100%; display: flex; justify-content: center;"></div>

            <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <button class="btn btn-ghost btn-sm" (click)="showRealGooglePrompt = false" style="padding-left: 0; padding-right: 0;">Back</button>
              <button class="btn btn-ghost btn-sm" (click)="clearGoogleClientId()" style="color: var(--danger); padding-left: 0; padding-right: 0;">Reset Client ID</button>
            </div>
          </div>
        </ng-container>

        <!-- 2. Account Chooser View -->
        <ng-container *ngIf="!showCustomGoogleForm && !showRealGooglePrompt">
          <div class="google-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.67H24v8.87h12.62c-.54 2.87-2.16 5.31-4.6 6.96v5.79h7.42C43.79 36.86 46.5 31.06 46.5 24z"/>
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.42-5.79c-2.06 1.38-4.7 2.2-8.47 2.2-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <h3 class="google-title">Choose an account</h3>
            <p class="google-subtitle">to continue to <span style="color: var(--accent); font-weight: 600;">CineVault</span></p>
          </div>

          <div class="google-accounts-list">
            <!-- Real Google Authentication Button in List -->
            <button class="google-account-item" (click)="startRealGoogleLogin()" style="border-bottom: 2px solid var(--border); background: rgba(66, 133, 244, 0.05);">
              <div class="google-avatar-circle" style="background-color: #4285F4; display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#fff" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#fff" d="M46.5 24c0-1.61-.15-3.16-.42-4.67H24v8.87h12.62c-.54 2.87-2.16 5.31-4.6 6.96v5.79h7.42C43.79 36.86 46.5 31.06 46.5 24z"/>
                  <path fill="#fff" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
                  <path fill="#fff" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.42-5.79c-2.06 1.38-4.7 2.2-8.47 2.2-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </div>
              <div class="google-account-info">
                <span class="google-account-name" style="color: #4285F4; font-weight: bold;">Sign in with Real Google Account</span>
                <span class="google-account-email" style="color: var(--text-muted);">Use actual Gmail credentials</span>
              </div>
            </button>

            <button class="google-account-item" (click)="selectGoogleAccount('Thevindu Edits', 'thevindu.edits@gmail.com', 'usr-google-thevindu')">
              <div class="google-avatar-circle" style="background-color: #2563eb;">T</div>
              <div class="google-account-info">
                <span class="google-account-name">Thevindu Edits</span>
                <span class="google-account-email">thevindu.edits&#64;gmail.com</span>
              </div>
            </button>

            <button class="google-account-item" (click)="selectGoogleAccount('IT25101540', 'it25101540@my.sliit.lk', 'usr-google-1540')">
              <div class="google-avatar-circle" style="background-color: #ea580c;">I</div>
              <div class="google-account-info">
                <span class="google-account-name">IT25101540</span>
                <span class="google-account-email">it25101540&#64;my.sliit.lk</span>
              </div>
            </button>

            <button class="google-account-item" (click)="selectGoogleAccount('Guest User', 'guest.cinevault@gmail.com', 'usr-google-guest')">
              <div class="google-avatar-circle" style="background-color: #10b981;">G</div>
              <div class="google-account-info">
                <span class="google-account-name">Guest User</span>
                <span class="google-account-email">guest.cinevault&#64;gmail.com</span>
              </div>
            </button>

            <button class="google-account-item" (click)="showCustomGoogleForm = true">
              <div class="google-avatar-circle" style="background-color: transparent; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <div class="google-account-info">
                <span class="google-account-name" style="color: var(--text-muted);">Use another account</span>
              </div>
            </button>
          </div>
        </ng-container>

        <!-- Custom Account Sign-In View -->
        <ng-container *ngIf="showCustomGoogleForm">
          <div class="google-header" style="text-align: left; align-items: flex-start; width: 100%;">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 48 48" style="margin-bottom: 0.5rem;">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.5 24c0-1.61-.15-3.16-.42-4.67H24v8.87h12.62c-.54 2.87-2.16 5.31-4.6 6.96v5.79h7.42C43.79 36.86 46.5 31.06 46.5 24z"/>
              <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.98-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.42-5.79c-2.06 1.38-4.7 2.2-8.47 2.2-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <h3 class="google-title" style="margin-bottom: 0.25rem;">Sign in</h3>
            <p class="google-subtitle">Use your Google Account</p>
          </div>

          <div style="margin-top: 1.5rem; width: 100%;">
            <div class="form-group">
              <label class="form-label" style="font-size: 0.7rem;">Your Name</label>
              <input type="text" class="form-control" [(ngModel)]="customGoogleName" placeholder="John Doe" style="background: transparent; border-color: rgba(255,255,255,0.15);" (keyup.enter)="submitCustomGoogleAccount()"/>
            </div>
            <div class="form-group" style="margin-top: 0.75rem;">
              <label class="form-label" style="font-size: 0.7rem;">Email or phone</label>
              <input type="email" class="form-control" [(ngModel)]="customGoogleEmail" placeholder="email@gmail.com" style="background: transparent; border-color: rgba(255,255,255,0.15);" (keyup.enter)="submitCustomGoogleAccount()"/>
            </div>

            <div style="margin-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; width: 100%;">
              <button class="btn btn-ghost btn-sm" (click)="showCustomGoogleForm = false" style="padding-left: 0; padding-right: 0;">Back</button>
              <button class="btn btn-primary btn-sm" (click)="submitCustomGoogleAccount()" [disabled]="!customGoogleEmail || !customGoogleName">Next</button>
            </div>
          </div>
        </ng-container>

        <div class="google-footer">
          To continue, Google will share your name, email address, and profile picture with CineVault.
        </div>
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
    .google-accounts-list {
      width: 100%;
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .google-account-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      width: 100%;
      padding: 0.85rem 0.5rem;
      background: transparent;
      border: none;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      text-align: left;
      transition: background 0.15s;
    }
    .google-account-item:last-child {
      border-bottom: none;
    }
    .google-account-item:hover {
      background: var(--surface-2);
    }
    .google-avatar-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #fff;
      font-size: 0.9rem;
    }
    .google-account-info {
      display: flex;
      flex-direction: column;
    }
    .google-account-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text);
    }
    .google-account-email {
      font-size: 0.75rem;
      color: var(--text-muted);
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
export class LoginComponent {
  username = ''; password = ''; error = ''; loading = false;

  // Google account chooser state
  showGoogleChooser = false;
  showCustomGoogleForm = false;
  customGoogleEmail = '';
  customGoogleName = '';

  // Real Google Sign-In state
  showRealGooglePrompt = false;
  googleClientId = localStorage.getItem('googleClientId') || '';
  clientIdInput = '';

  constructor(private userService: UserService, private adminService: AdminService, private router: Router) {}

  loginWithGoogle() {
    this.showGoogleChooser = true;
    this.showCustomGoogleForm = false;
    this.showRealGooglePrompt = false;
    this.customGoogleEmail = '';
    this.customGoogleName = '';
  }

  closeGoogleChooser() {
    this.showGoogleChooser = false;
    this.showCustomGoogleForm = false;
    this.showRealGooglePrompt = false;
  }

  selectGoogleAccount(name: string, email: string, id: string) {
    this.loading = true;
    this.error = '';
    this.showGoogleChooser = false;
    this.showRealGooglePrompt = false;
    setTimeout(() => {
      const mockGoogleUser = {
        id: id,
        username: name.replace(/\s+/g, ''),
        email: email,
        membershipType: 'FREE',
        active: true
      };
      localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser));
      (this.userService as any).currentUserSubject.next(mockGoogleUser);
      this.loading = false;
      this.router.navigate(['/movies']);
    }, 1200);
  }

  submitCustomGoogleAccount() {
    if (this.customGoogleEmail && this.customGoogleName) {
      const id = 'usr-google-' + Math.random().toString(36).substring(2, 6);
      this.selectGoogleAccount(this.customGoogleName, this.customGoogleEmail, id);
    }
  }

  startRealGoogleLogin() {
    this.showRealGooglePrompt = true;
    this.showCustomGoogleForm = false;
    if (this.googleClientId) {
      this.initRealGoogleSignIn();
    } else {
      this.clientIdInput = '';
    }
  }

  saveGoogleClientId() {
    const id = this.clientIdInput.trim();
    if (id) {
      this.googleClientId = id;
      localStorage.setItem('googleClientId', id);
      this.initRealGoogleSignIn();
    }
  }

  clearGoogleClientId() {
    this.googleClientId = '';
    localStorage.removeItem('googleClientId');
    const container = document.getElementById('real-google-btn-container');
    if (container) container.innerHTML = '';
  }

  initRealGoogleSignIn() {
    setTimeout(() => {
      try {
        const googleObj = (window as any).google;
        if (googleObj) {
          googleObj.accounts.id.initialize({
            client_id: this.googleClientId,
            callback: (response: any) => this.handleRealGoogleResponse(response)
          });
          googleObj.accounts.id.renderButton(
            document.getElementById('real-google-btn-container'),
            { theme: 'filled_blue', size: 'large', width: 280 }
          );
        } else {
          console.error('Google client library not loaded yet');
        }
      } catch (err) {
        console.error('Error initializing Google Sign-In:', err);
      }
    }, 100);
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
