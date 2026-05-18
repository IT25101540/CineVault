import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container page-header" style="border-bottom:none; text-align:center;">
      <h1 style="color:var(--accent);">SE1020 Project Team</h1>
      <p>CineVault Architecture & Component Assignments</p>
    </div>

    <div class="container" style="max-width: 1000px; padding-bottom: 4rem;">
      <div class="assignments-grid">
        <!-- Member 1: Dhimantha -->
        <div class="assignment-card">
          <div class="card-header">
            <div class="avatar" style="background: var(--accent);">DW</div>
            <div class="member-info">
              <h4>Dhimantha W.L.T.</h4>
              <span class="it-number">IT25102885</span>
            </div>
          </div>
          <h5 class="component-name">User Management</h5>
          <p class="component-desc">Register, login, profile update & account deletion for movie platform users.</p>
          <div class="crud-tags">
            <span class="tag-create">Create</span>
            <span class="tag-read">Read</span>
            <span class="tag-update">Update</span>
            <span class="tag-delete">Delete</span>
          </div>
          <div class="oop-tags">
            <span>Encapsulation</span>
            <span>Inheritance</span>
            <span>Polymorphism</span>
          </div>
          <div class="footer-meta">users.txt · 3+ UIs</div>
        </div>

        <!-- Member 2: Navishika -->
        <div class="assignment-card">
          <div class="card-header">
            <div class="avatar" style="background: var(--success);">NN</div>
            <div class="member-info">
              <h4>Navishika D.M.N.N.</h4>
              <span class="it-number">IT25103586</span>
            </div>
          </div>
          <h5 class="component-name">Movie Catalog</h5>
          <p class="component-desc">Add, search, edit, and remove movies with title, genre, director & rating.</p>
          <div class="crud-tags">
            <span class="tag-create">Create</span>
            <span class="tag-read">Read</span>
            <span class="tag-update">Update</span>
            <span class="tag-delete">Delete</span>
          </div>
          <div class="oop-tags">
            <span>Encapsulation</span>
            <span>Inheritance</span>
            <span>Polymorphism</span>
          </div>
          <div class="footer-meta">movies.txt · 3+ UIs</div>
        </div>

        <!-- Member 3: Gunathilaka -->
        <div class="assignment-card">
          <div class="card-header">
            <div class="avatar" style="background: var(--warning);">GT</div>
            <div class="member-info">
              <h4>Gunathilaka H.D.T.T.</h4>
              <span class="it-number">IT25101540</span>
            </div>
          </div>
          <h5 class="component-name">Admin Dashboard <span style="color:#4caf50;font-size:1.1rem">☑</span></h5>
          <p class="component-desc">Manage admin accounts, view activity logs & platform-wide controls.</p>
          <div class="crud-tags">
            <span class="tag-create">Create</span>
            <span class="tag-read">Read</span>
            <span class="tag-update">Update</span>
            <span class="tag-delete">Delete</span>
          </div>
          <div class="oop-tags">
            <span>Encapsulation</span>
            <span>Inheritance</span>
            <span>Abstraction</span>
          </div>
          <div class="footer-meta">admins.txt · 3+ UIs</div>
        </div>

        <!-- Member 4: Herath -->
        <div class="assignment-card">
          <div class="card-header">
            <div class="avatar" style="background: var(--danger);">HS</div>
            <div class="member-info">
              <h4>Herath H.M.H.S.</h4>
              <span class="it-number">IT25103608</span>
            </div>
          </div>
          <h5 class="component-name">Rental Management</h5>
          <p class="component-desc">Handle movie rentals, returns, due dates & late fees tracking.</p>
          <div class="crud-tags">
            <span class="tag-create">Create</span>
            <span class="tag-read">Read</span>
            <span class="tag-update">Update</span>
            <span class="tag-delete">Delete</span>
          </div>
          <div class="oop-tags">
            <span>Encapsulation</span>
            <span>Abstraction</span>
            <span>Polymorphism</span>
          </div>
          <div class="footer-meta">rentals.txt · 3+ UIs</div>
        </div>

        <!-- Member 5: Thanuluxshan -->
        <div class="assignment-card">
          <div class="card-header">
            <div class="avatar" style="background: #3498db;">TK</div>
            <div class="member-info">
              <h4>Thanuluxshan K.</h4>
              <span class="it-number">IT25101901</span>
            </div>
          </div>
          <h5 class="component-name">Review & Rating</h5>
          <p class="component-desc">Submit, display, edit & moderate user reviews and star ratings for movies.</p>
          <div class="crud-tags">
            <span class="tag-create">Create</span>
            <span class="tag-read">Read</span>
            <span class="tag-update">Update</span>
            <span class="tag-delete">Delete</span>
          </div>
          <div class="oop-tags">
            <span>Encapsulation</span>
            <span>Inheritance</span>
            <span>Polymorphism</span>
          </div>
          <div class="footer-meta">reviews.txt · 3+ UIs</div>
        </div>

        <!-- Member 6: Luckshidhan -->
        <div class="assignment-card">
          <div class="card-header">
            <div class="avatar" style="background: #9b59b6;">LK</div>
            <div class="member-info">
              <h4>Luckshidhan K.</h4>
              <span class="it-number">IT25100813</span>
            </div>
          </div>
          <h5 class="component-name">Watchlist & Favourites</h5>
          <p class="component-desc">Let users save, view, reorder & remove movies from their personal watchlist.</p>
          <div class="crud-tags">
            <span class="tag-create">Create</span>
            <span class="tag-read">Read</span>
            <span class="tag-update">Update</span>
            <span class="tag-delete">Delete</span>
          </div>
          <div class="oop-tags">
            <span>Encapsulation</span>
            <span>Abstraction</span>
            <span>Polymorphism</span>
          </div>
          <div class="footer-meta">watchlist.txt · 3+ UIs</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assignments-grid {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-bottom: 3rem;
    }
    @media(max-width: 1024px) { .assignments-grid { grid-template-columns: repeat(2, 1fr); } }
    @media(max-width: 768px) { .assignments-grid { grid-template-columns: 1fr; } }
    
    .assignment-card {
      background: var(--surface); border-radius: var(--radius-lg); padding: 1.25rem 1rem;
      border: 1px solid var(--border); transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
      text-align: center;
    }
    .assignment-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--accent); }
    
    .card-header { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; margin-bottom: 1rem; }
    .avatar { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.9rem; color: #0a0a0a; margin-bottom: 0.2rem; }
    .member-info h4 { margin: 0; font-size: 0.95rem; font-weight: 600; color: var(--text); }
    .it-number { font-size: 0.75rem; color: var(--text-muted); }
    
    .component-name { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 0.4rem; font-family: var(--font-serif); }
    .component-desc { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 1rem; min-height: 35px; }
    
    .crud-tags { display: flex; justify-content: center; gap: 0.4rem; margin-bottom: 0.8rem; flex-wrap: wrap; }
    .crud-tags span { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
    
    .tag-create { background: rgba(39,174,96,0.12); color: var(--success); border: 1px solid rgba(39,174,96,0.3); }
    .tag-read   { background: rgba(52,152,219,0.12); color: #3498db; border: 1px solid rgba(52,152,219,0.3); }
    .tag-update { background: rgba(243,156,18,0.12); color: #f39c12; border: 1px solid rgba(243,156,18,0.3); }
    .tag-delete { background: rgba(192,57,43,0.12); color: var(--danger); border: 1px solid rgba(192,57,43,0.3); }
    
    .oop-tags { display: flex; justify-content: center; gap: 0.4rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
    .oop-tags span { padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; border: 1px solid var(--border); background: var(--surface-2); color: var(--text-muted); }
    
    .footer-meta { font-size: 0.75rem; color: var(--text-dim); font-weight: 500; }
  `]
})
export class TeamComponent {}
