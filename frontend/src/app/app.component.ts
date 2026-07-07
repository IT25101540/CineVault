import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from './core/services/user.service';
import { AdminService } from './core/services/admin.service';
import { RentalService } from './core/services/rental.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <!-- Fullscreen Loading Overlay -->
    <div class="loading-overlay" *ngIf="isLoading" [class.fade-out]="isFadingOut">
      <div class="loading-content">
        <svg class="loading-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect>
          <path d="M8 2v20 M16 2v20" opacity="0.3"></path>
          <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none"></polygon>
        </svg>
        <h2 class="loading-title">cinevault</h2>
        <div class="loading-progress-container">
          <div class="loading-progress-bar"></div>
        </div>
      </div>
    </div>

    <div class="admin-topbar" *ngIf="currentAdmin">
      <div class="admin-topbar-inner">
        <span class="badge badge-gold" style="font-size: 0.65rem;">Admin Mode</span>
        <div class="admin-top-links">
          <a routerLink="/admin/dashboard">Dashboard</a>
          <a routerLink="/admin/users">Users</a>
          <a routerLink="/admin/reviews">Reviews</a>
          <a routerLink="/admin/rentals">Rentals</a>
          <a (click)="logoutAdmin()" style="cursor:pointer; color: var(--danger);">Sign out</a>
        </div>
      </div>
    </div>
    <nav class="navbar" [class.admin-navbar]="currentAdmin">
      <!-- Left: Logo -->
      <a class="navbar-brand" routerLink="/" (click)="closeMenu()">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect>
          <path d="M8 2v20 M16 2v20" opacity="0.3"></path>
          <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none"></polygon>
        </svg>
        <div class="brand-text-wrap">
          <span class="brand-text">CineVault</span>
        </div>
      </a>

      <!-- Center: Pill Navigation (Desktop) -->
      <ul class="nav-links nav-pill">
        <li><a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active">Home</a></li>
        <li><a routerLink="/movies" routerLinkActive="active">Movies</a></li>
        <li><a routerLink="/people" routerLinkActive="active">People</a></li>
        <li><a routerLink="/membership" routerLinkActive="active">Membership</a></li>
        <li><a routerLink="/leaderboard" routerLinkActive="active">Leaderboard</a></li>
        <li><a routerLink="/about" routerLinkActive="active">About</a></li>
      </ul>

      <!-- Right: Actions (Desktop) -->
      <ul class="nav-actions">
        <li *ngIf="!currentUser && !currentAdmin">
          <a routerLink="/auth/login" class="btn btn-primary btn-sm" style="border-radius: 50px; padding: 0.4rem 1.2rem;">Sign In</a>
        </li>
        <li *ngIf="currentUser">
          <a [routerLink]="['/profile', currentUser.id]" class="user-link">
            <span class="material-symbols-outlined" style="font-size: 1.1rem; margin-right: 4px;">account_circle</span>
            {{ currentUser.username }}
            <span class="membership-badge" *ngIf="currentUser.membershipType && currentUser.membershipType !== 'FREE'">
              {{ currentUser.membershipType }}
            </span>
          </a>
        </li>
        <li *ngIf="currentUser">
          <a routerLink="/dashboard" class="user-link" style="background:rgba(249,115,22,.1);border-radius:999px;padding:.3rem .8rem;">
            <span class="material-symbols-outlined" style="font-size:1rem;margin-right:3px;">dashboard</span>
            Dashboard
          </a>
        </li>

        <!-- 🔔 Notification Bell -->
        <li *ngIf="currentUser" style="position:relative;">
          <button class="notif-bell" (click)="toggleNotif()">
            <span class="material-symbols-outlined">notifications</span>
            <span class="notif-badge" *ngIf="unreadCount > 0">{{ unreadCount }}</span>
          </button>
          <!-- Dropdown -->
          <div class="notif-dropdown" *ngIf="notifOpen">
            <div class="notif-header">
              <span>Notifications</span>
              <button class="notif-clear" (click)="clearNotifs()">Clear all</button>
            </div>
            <div class="notif-item" *ngFor="let n of notifications" [ngClass]="'notif-' + n.type">
              <span class="material-symbols-outlined notif-icon">{{ n.icon }}</span>
              <div>
                <p class="notif-title">{{ n.title }}</p>
                <p class="notif-msg">{{ n.message }}</p>
              </div>
            </div>
            <div class="notif-empty" *ngIf="!notifications.length">
              <span class="material-symbols-outlined">check_circle</span>
              <p>All caught up!</p>
            </div>
          </div>
        </li>

        <li *ngIf="currentUser">
          <a (click)="logout()" style="cursor:pointer;" class="text-muted text-sm">Sign out</a>
        </li>
        <li *ngIf="currentAdmin">
          <a routerLink="/admin/dashboard" class="btn btn-primary btn-sm" style="border-radius: 50px;">Dashboard</a>
        </li>
      </ul>

      <!-- Hamburger Button (Mobile only) -->
      <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen" aria-label="Toggle menu">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <!-- Mobile Drawer Overlay -->
    <div class="mobile-overlay" [class.active]="menuOpen" (click)="closeMenu()"></div>

    <!-- Mobile Drawer -->
    <div class="mobile-drawer" [class.open]="menuOpen">
      <ul class="mobile-nav-links">
        <li><a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active" (click)="closeMenu()">Home</a></li>
        <li><a routerLink="/movies" routerLinkActive="active" (click)="closeMenu()">Movies</a></li>
        <li><a routerLink="/people" routerLinkActive="active" (click)="closeMenu()">People</a></li>
        <li><a routerLink="/membership" routerLinkActive="active" (click)="closeMenu()">Membership</a></li>
        <li><a routerLink="/leaderboard" routerLinkActive="active" (click)="closeMenu()">Leaderboard</a></li>
        <li><a routerLink="/about" routerLinkActive="active" (click)="closeMenu()">About</a></li>
        <li *ngIf="currentUser"><a routerLink="/dashboard" routerLinkActive="active" (click)="closeMenu()">My Dashboard</a></li>
      </ul>
      <div class="mobile-nav-actions">
        <ng-container *ngIf="!currentUser && !currentAdmin">
          <a routerLink="/auth/login" class="btn btn-primary w-full" style="justify-content:center;" (click)="closeMenu()">Sign In</a>
        </ng-container>
        <ng-container *ngIf="currentUser">
          <a [routerLink]="['/profile', currentUser.id]" class="user-link" style="width:100%; justify-content:center;" (click)="closeMenu()">{{ currentUser.username }}</a>
          <a (click)="logout(); closeMenu()" class="btn btn-outline w-full" style="justify-content:center; cursor:pointer;">Sign Out</a>
        </ng-container>
        <ng-container *ngIf="currentAdmin">
          <a routerLink="/admin/dashboard" class="btn btn-primary w-full" style="justify-content:center;" (click)="closeMenu()">Dashboard</a>
          <a (click)="logoutAdmin(); closeMenu()" class="btn btn-outline w-full" style="justify-content:center; cursor:pointer; color:var(--danger);">Sign out Admin</a>
        </ng-container>
      </div>
    </div>

    <main>
      <router-outlet/>
    </main>

    <footer class="app-footer">
      <div class="container footer-content">
        <div class="footer-brand">
          <a routerLink="/" class="footer-logo">
            <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="4" ry="4"></rect>
              <path d="M8 2v20 M16 2v20" opacity="0.3"></path>
              <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none"></polygon>
            </svg>
            <div class="brand-text-wrap">
              <span class="brand-text">CineVault</span>
            </div>
          </a>
          <p class="footer-tagline">Your ultimate platform for discovering, reviewing, and renting movies. Experience cinema like never before.</p>
          <div class="social-links">
            <a href="https://github.com/IT25101540/CineVault" target="_blank" rel="noopener noreferrer" class="social-icon" title="GitHub Repository">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a href="https://cloud.mongodb.com/v2/6a0206e0d40687ea2f06937d#/overview" target="_blank" rel="noopener noreferrer" class="social-icon" title="MongoDB Database">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
            </a>
          </div>
        </div>
        
        <div class="footer-col">
          <h4>Project Details</h4>
          <span class="footer-list-item">SE1020 &ndash; OOP</span>
          <span class="footer-list-item">Angular 17</span>
          <span class="footer-list-item">Spring Boot 3</span>
          <span class="footer-list-item">MongoDB</span>
          <span class="footer-list-item">Java 21 &amp; Maven 3.9</span>
        </div>

        <div class="footer-col">
          <h4>Information</h4>
          <a routerLink="/about" class="footer-list-item">About CineVault & Team</a>
          <a href="mailto:contact@cinevault.local" class="footer-list-item">Contact Us</a>
        </div>
        
        <div class="footer-col">
          <h4>Quick Links</h4>
          <a routerLink="/movies" class="footer-list-item">Movies Catalogue</a>
          <a routerLink="/people" class="footer-list-item">Directors &amp; Cast</a>
          <a routerLink="/membership" class="footer-list-item">Membership Plans</a>
          <a href="https://github.com/IT25101540/CineVault" target="_blank" rel="noopener noreferrer" class="footer-list-item">GitHub Repository</a>
          <a href="https://cloud.mongodb.com/v2/6a0206e0d40687ea2f06937d#/overview" target="_blank" rel="noopener noreferrer" class="footer-list-item">MongoDB Database</a>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container flex-between">
          <div class="copyright-stack">
            <p class="copyright-text">&copy; 2026 Group WD251 &middot; SLIIT &middot; SE1020 Object Oriented Programming</p>
            <p class="copyright-sub">Built with Angular &middot; Spring Boot 3 &middot; MongoDB &middot; GitHub Actions CI/CD</p>
          </div>
          <p class="designer-text">Final Design &amp; Updated by <strong>Gunathilaka H.D.T.T.</strong></p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .navbar {
      position: sticky; top: 0; z-index: 1000;
      background: rgba(10,10,10,0.85); backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(234, 229, 208, 0.05);
      padding: 0 2rem; height: 75px;
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center;
    }
    .admin-navbar { border-bottom: 1px solid var(--accent); }
    .admin-topbar {
      background: #000; border-bottom: 1px solid var(--accent);
      padding: 0.4rem 2rem; font-size: 0.8rem;
    }
    .admin-topbar-inner { display: flex; align-items: center; justify-content: space-between; }
    .admin-top-links { display: flex; gap: 1rem; align-items: center; }
    .admin-top-links a { color: var(--text-muted); text-decoration: none; transition: color var(--transition); }
    .admin-top-links a:hover { color: var(--text); }
    .navbar-brand {
      display: flex; align-items: center; gap: 0.5rem;
      text-decoration: none; justify-self: start;
    }
    .brand-icon {
      width: 28px; height: 28px; color: var(--accent);
      filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.4));
    }
    .brand-text-wrap { display: flex; align-items: baseline; }
    .brand-text {
      font-family: var(--font-display); font-size: 1.55rem; font-weight: 600;
      letter-spacing: -0.04em;
      background: linear-gradient(135deg, #eae5d0 0%, #a1a1aa 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
      text-transform: lowercase;
    }
    .nav-pill {
      display: flex; align-items: center; gap: 0.2rem; list-style: none;
      background: rgba(234, 229, 208, 0.03);
      border: 1px solid rgba(234, 229, 208, 0.05);
      border-radius: 50px; padding: 0.4rem 0.8rem;
      margin: 0; justify-self: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .nav-pill > li > a {
      color: var(--text-muted); font-family: var(--font-sans); font-size: 0.875rem; font-weight: 450;
      padding: 0.5rem 1.2rem; border-radius: 50px;
      transition: color var(--transition); text-decoration: none; letter-spacing: 0.01em;
      position: relative; display: block;
    }
    .nav-pill > li > a::after {
      content: ''; position: absolute; left: 50%; bottom: 4px; width: 0; height: 2px;
      background: var(--accent); transition: all 0.3s ease;
      transform: translateX(-50%); border-radius: 2px;
    }
    .nav-pill > li > a:hover, .nav-pill > li > a.active { color: var(--text); }
    .nav-pill > li > a:hover::after, .nav-pill > li > a.active::after { width: calc(100% - 2.4rem); }
    .nav-actions {
      display: flex; align-items: center; list-style: none; margin: 0; padding: 0;
      justify-self: end; gap: 0.5rem;
    }
    .user-link {
      color: var(--text); font-weight: 600; text-decoration: none; font-size: 0.875rem;
      background: var(--surface-2); padding: 0.4rem 1rem; border-radius: 50px;
      display: flex; align-items: center; border: 1px solid rgba(234, 229, 208, 0.05);
      transition: all 0.3s ease;
    }
    .user-link:hover { background: rgba(234, 229, 208, 0.08); border-color: var(--accent); }
    .membership-badge {
      font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
      background: linear-gradient(135deg, #ffd700, #b8860b);
      color: #000; padding: 2px 8px; border-radius: 4px; margin-left: 8px;
      letter-spacing: 0.05em; box-shadow: 0 2px 8px rgba(184, 134, 11, 0.3);
    }
    /* Hamburger - hidden on desktop */
    .hamburger {
      display: none; flex-direction: column; justify-content: space-between;
      width: 28px; height: 20px; background: transparent; border: none;
      cursor: pointer; padding: 0; z-index: 1100;
      justify-self: end;
    }
    .hamburger span {
      display: block; width: 100%; height: 2px;
      background: var(--text); border-radius: 2px;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      transform-origin: center;
    }
    .hamburger.open span:nth-child(1) { transform: translateY(9px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
    .hamburger.open span:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }
    /* Mobile Drawer */
    .mobile-overlay {
      display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6);
      backdrop-filter: blur(4px); z-index: 1050; opacity: 0;
      transition: opacity 0.3s ease;
    }
    .mobile-overlay.active { opacity: 1; }
    .mobile-drawer {
      display: none; position: fixed; top: 0; right: -100%; width: min(320px, 85vw);
      height: 100dvh; background: rgba(10,10,10,0.98);
      backdrop-filter: blur(24px); border-left: 1px solid rgba(234,229,208,0.08);
      z-index: 1100; padding: 5rem 1.5rem 2rem; flex-direction: column; gap: 0;
      transition: right 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      overflow-y: auto;
    }
    .mobile-drawer.open { right: 0; }
    .mobile-nav-links { list-style: none; margin: 0; padding: 0; margin-bottom: 2rem; }
    .mobile-nav-links li { border-bottom: 1px solid rgba(234,229,208,0.05); }
    .mobile-nav-links li a {
      display: block; padding: 1rem 0; color: var(--text-muted);
      font-family: var(--font-display); font-size: 1.5rem; font-weight: 500;
      text-decoration: none; text-transform: lowercase; letter-spacing: -0.02em;
      transition: color 0.2s, transform 0.2s;
    }
    .mobile-nav-links li a:hover, .mobile-nav-links li a.active { color: var(--text); transform: translateX(6px); }
    .mobile-nav-actions { display: flex; flex-direction: column; gap: 0.75rem; }
    @media(max-width: 860px) {
      .navbar { padding: 0 1.25rem; grid-template-columns: 1fr auto; }
      .nav-pill, .nav-actions { display: none; }
      .hamburger { display: flex; }
      .mobile-overlay { display: block; pointer-events: none; }
      .mobile-overlay.active { pointer-events: all; }
      .mobile-drawer { display: flex; }
      .admin-topbar { padding: 0.4rem 1.25rem; font-size: 0.75rem; }
      .admin-top-links { gap: 0.6rem; flex-wrap: wrap; }
    }

    .app-footer {
      position: relative; background: var(--surface); color: var(--text);
      font-family: var(--font-sans); margin-top: 5rem;
      border-top: 1px solid rgba(234, 229, 208, 0.05); overflow: hidden;
    }
    .app-footer::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      opacity: 0.5;
    }
    .footer-content {
      display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 4rem;
      padding: 4rem 1.5rem; max-width: 1200px; margin: 0 auto;
    }
    .footer-brand { max-width: 320px; }
    .footer-logo {
      display: flex; align-items: center; gap: 0.6rem;
      text-decoration: none; margin-bottom: 1.2rem;
      transition: transform 0.3s ease;
    }
    .footer-logo:hover { transform: translateY(-2px); }
    .footer-tagline {
      color: var(--text-muted); font-size: 0.9rem; line-height: 1.7; margin-bottom: 1.5rem; text-align: left;
    }
    .social-links { display: flex; gap: 1rem; }
    .social-icon {
      display: flex; align-items: center; justify-content: center;
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--surface-2); color: var(--text-muted);
      transition: all 0.3s ease;
    }
    .social-icon:hover {
      background: var(--accent); color: #eae5d0;
      transform: translateY(-3px); box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
    }
    
    .footer-col { text-align: left; }
    .footer-col h4 {
      font-family: var(--font-display);
      color: #eae5d0; font-size: 1.25rem; font-weight: 500;
      margin-bottom: 1.5rem; letter-spacing: -0.02em; text-align: left;
    }
    .footer-list-item {
      display: block; color: var(--text-muted); text-decoration: none;
      font-size: 0.9rem; margin-bottom: 0.8rem; transition: color 0.2s ease;
      text-align: left; position: relative; width: fit-content;
    }
    a.footer-list-item::after {
      content: ''; position: absolute; left: 0; bottom: -2px; width: 0; height: 1px;
      background: var(--accent); transition: width 0.3s ease;
    }
    a.footer-list-item:hover { color: var(--accent); transform: translateX(4px); }
    a.footer-list-item:hover::after { width: 100%; }

    .footer-bottom {
      border-top: 1px solid rgba(234, 229, 208, 0.05);
      padding: 1.5rem 0; background: rgba(0, 0, 0, 0.2);
    }
    .footer-bottom .flex-between { flex-wrap: wrap; gap: 1rem; align-items: center; }
    .copyright-stack { display: flex; flex-direction: column; gap: 0.3rem; }
    .copyright-text { color: var(--text-muted); font-size: 0.85rem; margin: 0; font-weight: 500; }
    .copyright-sub { color: var(--text-muted); font-size: 0.75rem; margin: 0; opacity: 0.7; }
    
    .designer-text {
      color: var(--text-muted); font-size: 0.85rem; margin: 0;
      background: var(--surface-2); padding: 0.4rem 0.8rem; border-radius: 20px;
    }
    .designer-text strong { color: var(--accent); font-weight: 600; }
    
    @media(max-width: 992px) {
      .footer-content { grid-template-columns: 1fr 1fr; }
    }
    @media(max-width: 768px) {
      .footer-content { grid-template-columns: 1fr; gap: 2.5rem; }
      .footer-bottom .flex-between { flex-direction: column; text-align: center; justify-content: center; align-items: center; gap: 1rem; }
      .copyright-stack { align-items: center; text-align: center; }
    }

    /* ── Notification Bell ── */
    .notif-bell {
      position:relative;background:none;border:none;cursor:pointer;
      color:var(--text-muted);padding:.4rem;border-radius:50%;
      transition:all .2s;display:flex;align-items:center;
    }
    .notif-bell:hover { color:var(--text);background:var(--surface-2); }
    .notif-bell .material-symbols-outlined { font-size:1.3rem; }
    .notif-badge {
      position:absolute;top:2px;right:2px;
      background:var(--accent);color:#000;font-size:.6rem;font-weight:800;
      border-radius:999px;min-width:16px;height:16px;line-height:16px;
      text-align:center;padding:0 3px;
      animation:pulse 2s infinite;
    }
    @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
    .notif-dropdown {
      position:absolute;right:0;top:calc(100% + 8px);width:300px;
      background:var(--surface);border:1px solid var(--border);
      border-radius:var(--radius-lg);box-shadow:0 8px 32px rgba(0,0,0,.5);
      z-index:1000;overflow:hidden;
      animation:dropIn .2s ease;
    }
    @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
    .notif-header {
      display:flex;justify-content:space-between;align-items:center;
      padding:.75rem 1rem;border-bottom:1px solid var(--border);
      font-size:.85rem;font-weight:700;color:var(--text);
    }
    .notif-clear { background:none;border:none;font-size:.75rem;color:var(--accent);cursor:pointer; }
    .notif-item {
      display:flex;gap:.75rem;align-items:flex-start;
      padding:.85rem 1rem;border-bottom:1px solid rgba(255,255,255,.04);
      transition:background .15s;
    }
    .notif-item:hover { background:rgba(255,255,255,.03); }
    .notif-icon { font-size:1.1rem;margin-top:1px;flex-shrink:0; }
    .notif-warning .notif-icon { color:#f87171; }
    .notif-info    .notif-icon { color:#60a5fa; }
    .notif-success .notif-icon { color:#4ade80; }
    .notif-title { font-size:.82rem;font-weight:600;color:var(--text);margin:0; }
    .notif-msg   { font-size:.75rem;color:var(--text-muted);margin:.15rem 0 0; }
    .notif-empty {
      padding:1.5rem;text-align:center;
      color:var(--text-muted);font-size:.85rem;
    }
    .notif-empty .material-symbols-outlined { font-size:2rem;color:#4ade80;display:block;margin-bottom:.5rem; }
  `]
})
export class AppComponent implements OnInit {
  menuOpen   = false;
  isLoading  = false;
  isFadingOut = false;

  // Notifications
  notifOpen   = false;
  notifications: { type: string; icon: string; title: string; message: string }[] = [];
  get unreadCount() { return this.notifications.length; }

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private rentalService: RentalService,
    private router: Router
  ) { }


  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
        this.isFadingOut = false;
        this.notifOpen = false;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.isFadingOut = true;
        setTimeout(() => {
          this.isLoading = false;
          this.isFadingOut = false;
        }, 500);
      }
      if (event instanceof NavigationEnd) {
        this.loadNotifications();
      }
    });
  }

  loadNotifications() {
    const user = this.userService.currentUser;
    if (!user) { this.notifications = []; return; }

    this.rentalService.getByUser(user.id).subscribe({
      next: rentals => {
        const notifs: any[] = [];
        const today = new Date();

        // 1. Check for overdue or due-soon rentals
        rentals.forEach(r => {
          if (r.status === 'OVERDUE') {
            notifs.push({
              type: 'warning',
              icon: 'warning',
              title: 'Overdue Rental!',
              message: `"${r.movieTitle || 'A movie'}" is overdue. Please return it.`
            });
          } else if (r.status === 'ACTIVE') {
            const due = new Date(r.dueDate);
            const diff = Math.ceil((due.getTime() - today.getTime()) / 86400000);
            if (diff <= 2 && diff >= 0) {
              notifs.push({
                type: 'info',
                icon: 'schedule',
                title: 'Due Soon',
                message: `"${r.movieTitle || 'A movie'}" is due in ${diff} day(s).`
              });
            }
          }
        });

        // 2. Add upgrade tip for FREE membership users
        if (user.membershipType === 'FREE') {
          notifs.push({
            type: 'info',
            icon: 'upgrade',
            title: 'Upgrade Available',
            message: 'Go Premium for unlimited rentals with no extra fees!'
          });
        }

        this.notifications = notifs;
      },
      error: () => {
        // Fallback with just membership info if backend fails
        const notifs = [];
        if (user.membershipType === 'FREE') {
          notifs.push({
            type: 'info',
            icon: 'upgrade',
            title: 'Upgrade Available',
            message: 'Go Premium for unlimited rentals with no extra fees!'
          });
        }
        this.notifications = notifs;
      }
    });
  }



  toggleNotif() { this.notifOpen = !this.notifOpen; }
  clearNotifs() {
    this.notifications = [];
    const user = this.userService.currentUser;
    if (user) localStorage.removeItem('cv_notif_' + user.id);
    this.notifOpen = false;
  }

  get currentUser()  { return this.userService.currentUser; }
  get currentAdmin() { return this.adminService.currentAdmin; }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu()  { this.menuOpen = false; }

  @HostListener('document:keydown.escape')
  onEscape() { this.closeMenu(); this.notifOpen = false; }

  @HostListener('document:click', ['$event'])
  onDocClick(e: Event) {
    const target = e.target as HTMLElement;
    if (!target.closest('.notif-bell') && !target.closest('.notif-dropdown')) {
      this.notifOpen = false;
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['/']);
    this.closeMenu();
  }

  logoutAdmin() {
    this.adminService.logout();
    this.userService.logout();
    this.router.navigate(['/']);
    this.closeMenu();
  }
}
