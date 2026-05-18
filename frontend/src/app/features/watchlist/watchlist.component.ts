import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-watchlist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <div class="page-header">
        <p class="eyebrow">My Collection</p>
        <h1>My Watchlist</h1>
      </div>
      <div class="empty-state">
        <span class="material-symbols-outlined">bookmark</span>
        <p>Your watchlist is empty. Start adding movies you want to watch!</p>
      </div>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 0;
      color: var(--text-muted);
      text-align: center;
    }
    .empty-state .material-symbols-outlined {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      opacity: 0.2;
    }
  `]
})
export class WatchlistComponent {}
