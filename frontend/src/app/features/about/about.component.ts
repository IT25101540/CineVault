import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-page">
      <!-- Header Section -->
      <div class="container about-header">
        <span class="sub-heading">SE1020 - OBJECT ORIENTED PROGRAMMING</span>
        <h1>About <span class="text-accent">CineVault & Team</span></h1>
        <p class="about-desc">
          CineVault is a full-stack movie review and rental platform built as a group project for the SE1020 module. It allows users to browse movies, rent them, leave reviews and ratings, and manage their personal profiles - all through a clean, responsive web interface.
        </p>
      </div>

      <!-- Tech Stack Section -->
      <div class="container section-block">
        <h4 class="section-title">Tech Stack</h4>
        <div class="tech-grid">
          <div class="tech-card">
            <span class="tech-label">FRAMEWORK</span>
            <strong class="tech-value">Spring Boot 3</strong>
          </div>
          <div class="tech-card border-accent">
            <span class="tech-label">DATABASE</span>
            <strong class="tech-value text-accent">MongoDB</strong>
          </div>
          <div class="tech-card">
            <span class="tech-label">FRONTEND</span>
            <strong class="tech-value">Angular 17 + CSS</strong>
          </div>
          <div class="tech-card">
            <span class="tech-label">LANGUAGE</span>
            <strong class="tech-value">Java 21 LTS</strong>
          </div>
          <div class="tech-card">
            <span class="tech-label">BUILD TOOL</span>
            <strong class="tech-value">Maven 3.9</strong>
          </div>
          <div class="tech-card border-accent">
            <span class="tech-label">RUNS ON</span>
            <strong class="tech-value text-accent">localhost:4200</strong>
          </div>
          <div class="tech-card">
            <span class="tech-label">CI/CD</span>
            <strong class="tech-value">GitHub Actions</strong>
          </div>
          <div class="tech-card">
            <span class="tech-label">SERVER</span>
            <strong class="tech-value">Embedded Tomcat 10</strong>
          </div>
        </div>
      </div>

      <!-- What CineVault Offers Section -->
      <div class="container section-block">
        <h4 class="section-title">What CineVault Offers</h4>
        <div class="features-list">
          <!-- Feature 1 -->
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div class="feature-text">
              <strong>User Accounts</strong> - Register, log in, manage your profile and membership type with secure session-based authentication.
            </div>
          </div>
          
          <!-- Feature 2 -->
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
            </div>
            <div class="feature-text">
              <strong>Movie Catalogue</strong> - Browse and search the full movie library by title, genre, or director. View trailers, synopses, and cast details.
            </div>
          </div>

          <!-- Feature 3 -->
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <div class="feature-text">
              <strong>Reviews & Ratings</strong> - Post star ratings (1-5) and written reviews. Verified renter reviews are specially highlighted.
            </div>
          </div>

          <!-- Feature 4 -->
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <div class="feature-text">
              <strong>Rental System</strong> - Rent physical discs or stream digitally. Due dates are tracked automatically and late fees are calculated.
            </div>
          </div>

          <!-- Feature 5 -->
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div class="feature-text">
              <strong>Admin Panel</strong> - Administrators can manage users, moderate reviews, oversee rentals, and monitor system-wide statistics from a central dashboard.
            </div>
          </div>

          <!-- Feature 6 -->
          <div class="feature-item">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <div class="feature-text">
              <strong>Director & Cast Profiles</strong> - Explore filmographies, browse movies by director, and view detailed cast member bios.
            </div>
          </div>
        </div>
      </div>

      <!-- Our Team Section -->
      <div class="container section-block">
        <h4 class="section-title">Our Team</h4>
        <div class="team-grid">
          
          <!-- Lead -->
          <div class="team-member-card lead-card">
            <div class="member-avatar bg-accent">GH</div>
            <div class="member-details">
              <div class="member-header">
                <span class="member-name">Gunathilaka H.D.T.T.</span>
                <span class="badge badge-accent">Project Lead</span>
              </div>
              <div class="member-meta">IT25101540 - Level 5</div>
              <div class="member-meta">gunathilaka1540&#64;cinevault.com</div>
              <div class="member-role text-accent">Admin Management</div>
            </div>
          </div>

          <!-- Others -->
          <div class="team-member-card">
            <div class="member-avatar bg-white">DW</div>
            <div class="member-details">
              <div class="member-name">Dhimantha W.L.T.</div>
              <div class="member-role text-accent mt-1">User Management Specialist</div>
              <div class="member-meta">dhimantha2885&#64;cinevault.com</div>
              <div class="member-meta">IT25102885</div>
            </div>
          </div>

          <div class="team-member-card">
            <div class="member-avatar bg-white">ND</div>
            <div class="member-details">
              <div class="member-name">Navishika D.M.N.N.</div>
              <div class="member-role text-accent mt-1">Content Strategy & Movies</div>
              <div class="member-meta">navishika3586&#64;cinevault.com</div>
              <div class="member-meta">IT25103586</div>
            </div>
          </div>

          <div class="team-member-card">
            <div class="member-avatar bg-white">HH</div>
            <div class="member-details">
              <div class="member-name">Herath H.M.H.S.</div>
              <div class="member-role text-accent mt-1">Rental Operations</div>
              <div class="member-meta">herath3608&#64;cinevault.com</div>
              <div class="member-meta">IT25103608</div>
            </div>
          </div>

          <div class="team-member-card">
            <div class="member-avatar bg-white">TK</div>
            <div class="member-details">
              <div class="member-name">Thanuluxshan K.</div>
              <div class="member-role text-accent mt-1">Review & Rating Management</div>
              <div class="member-meta">thanuluxshan1901&#64;cinevault.com</div>
              <div class="member-meta">IT25101901</div>
            </div>
          </div>

          <div class="team-member-card">
            <div class="member-avatar bg-white">LK</div>
            <div class="member-details">
              <div class="member-name">Luckshidhan K.</div>
              <div class="member-role text-accent mt-1">Media Relations & Cast</div>
              <div class="member-meta">luckshidhan0813&#64;cinevault.com</div>
              <div class="member-meta">IT25100813</div>
            </div>
          </div>

        </div>
      </div>

      <!-- Info Box -->
      <div class="container section-block" style="padding-bottom: 5rem;">
        <div class="info-box">
          <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <div class="info-text">
            CineVault runs locally at <strong>http://localhost:4200</strong>. Start the app with <strong>mvn spring-boot:run</strong> from the project root. Data is persisted in a <strong>MongoDB</strong> database - make sure your MongoDB instance is running before starting the application.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
      padding: 3rem 1rem;
    }
    .about-header {
      margin-bottom: 3rem;
      max-width: 1000px;
    }
    .sub-heading {
      font-family: var(--font-sans);
      color: var(--text-muted);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      font-weight: 600;
    }
    .about-header h1 {
      font-size: 2.8rem;
      font-weight: 700;
      margin: 0.5rem 0 1rem;
      color: var(--text);
    }
    .text-accent {
      color: var(--accent);
    }
    .about-desc {
      color: var(--text-muted);
      font-size: 1.05rem;
      line-height: 1.6;
      max-width: 800px;
    }

    .section-block {
      margin-bottom: 4rem;
      max-width: 1000px;
    }
    .section-title {
      font-family: var(--font-sans);
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.15em;
      margin-bottom: 1.5rem;
      font-weight: 600;
    }

    /* Tech Stack Grid */
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
    @media (max-width: 768px) {
      .tech-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .tech-card {
      background: rgba(234,229,208,0.03);
      border: 1px solid rgba(234,229,208,0.08);
      border-radius: 8px;
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    .tech-card.border-accent {
      border-color: var(--accent);
    }
    .tech-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      font-weight: 600;
    }
    .tech-value {
      font-size: 0.95rem;
      color: var(--text);
    }

    /* Features List */
    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }
    .feature-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(249, 115, 22, 0.15); /* light accent */
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 2px;
    }
    .feature-icon svg {
      width: 16px;
      height: 16px;
    }
    .feature-text {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .feature-text strong {
      color: var(--text);
    }

    /* Team Grid */
    .team-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    @media (max-width: 900px) {
      .team-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .team-grid { grid-template-columns: 1fr; }
    }
    .team-member-card {
      background: rgba(234,229,208,0.03);
      border: 1px solid rgba(234,229,208,0.08);
      border-radius: 8px;
      padding: 1.2rem;
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }
    .lead-card {
      grid-column: 1 / -1; /* spans full width */
      border-color: var(--accent);
    }
    .member-avatar {
      flex-shrink: 0;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.2rem;
    }
    .bg-accent {
      background: var(--accent);
      color: #eae5d0;
    }
    .bg-white {
      background: #e2e8f0;
      color: #0f172a;
    }
    .member-details {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }
    .member-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .member-name {
      font-weight: 700;
      color: var(--text);
      font-size: 1rem;
    }
    .badge {
      font-size: 0.6rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .badge-accent {
      background: var(--accent);
      color: #eae5d0;
    }
    .badge-white {
      background: #eae5d0;
      color: #000;
    }
    .badge-dark {
      background: rgba(234,229,208,0.1);
      color: #eae5d0;
      display: inline-block;
      width: fit-content;
      margin: 0.2rem 0;
    }
    .member-meta {
      color: var(--text-muted);
      font-size: 0.8rem;
    }
    .member-role {
      font-size: 0.85rem;
      font-weight: 600;
    }
    .mt-1 { margin-top: 0.25rem; }

    /* Info Box */
    .info-box {
      background: rgba(234,229,208,0.05);
      border-radius: 8px;
      padding: 1rem 1.2rem;
      display: flex;
      gap: 0.8rem;
      align-items: flex-start;
    }
    .info-icon {
      color: var(--text-muted);
      flex-shrink: 0;
      margin-top: 2px;
    }
    .info-text {
      color: var(--text-muted);
      font-size: 0.85rem;
      line-height: 1.5;
    }
    .info-text strong {
      color: var(--text);
    }
  `]
})
export class AboutComponent {}
