import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReviewService } from '../../core/services/review.service';
import { RentalService } from '../../core/services/rental.service';

interface BoardEntry { rank: number; name: string; score: number; badge: string; }

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container lb-wrap">
      <div class="lb-header">
        <p class="eyebrow">Community</p>
        <h1 style="display:flex;align-items:center;justify-content:center;gap:.5rem;">
          <span class="material-symbols-outlined" style="font-size:2.2rem;color:var(--accent);">trophy</span>
          Leaderboard
        </h1>
        <p class="text-muted text-sm">Top contributors in the CineVault community</p>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div class="lb-grid" *ngIf="!loading">

        <!-- ── TOP REVIEWERS ── -->
        <div class="lb-card">
          <div class="lb-card-header">
            <span class="material-symbols-outlined lb-icon" style="color:#facc15;">star</span>
            <h2>Top Reviewers</h2>
            <span class="lb-sub">Most reviews written</span>
          </div>
          <div class="lb-list">
            <div class="lb-row" *ngFor="let e of topReviewers"
                 [class.top1]="e.rank===1" [class.top2]="e.rank===2" [class.top3]="e.rank===3">
              <span class="rank-badge" [ngClass]="e.rank <= 3 ? 'rank-' + e.rank : 'rank-other'">
                <span class="material-symbols-outlined" *ngIf="e.rank <= 3">military_tech</span>
                <span *ngIf="e.rank > 3">#{{ e.rank }}</span>
              </span>
              <div class="lb-name">{{ e.name }}</div>
              <div class="lb-score">
                <span class="score-num">{{ e.score }}</span>
                <span class="score-label">reviews</span>
              </div>
            </div>
            <p *ngIf="!topReviewers.length" class="text-muted text-sm" style="padding:1rem 0;text-align:center;">No data yet.</p>
          </div>
        </div>

        <!-- ── TOP RENTERS ── -->
        <div class="lb-card">
          <div class="lb-card-header">
            <span class="material-symbols-outlined lb-icon" style="color:#a78bfa;">movie</span>
            <h2>Top Renters</h2>
            <span class="lb-sub">Most movies rented</span>
          </div>
          <div class="lb-list">
            <div class="lb-row" *ngFor="let e of topRenters"
                 [class.top1]="e.rank===1" [class.top2]="e.rank===2" [class.top3]="e.rank===3">
              <span class="rank-badge" [ngClass]="e.rank <= 3 ? 'rank-' + e.rank : 'rank-other'">
                <span class="material-symbols-outlined" *ngIf="e.rank <= 3">military_tech</span>
                <span *ngIf="e.rank > 3">#{{ e.rank }}</span>
              </span>
              <div class="lb-name">{{ e.name }}</div>
              <div class="lb-score">
                <span class="score-num">{{ e.score }}</span>
                <span class="score-label">rentals</span>
              </div>
            </div>
            <p *ngIf="!topRenters.length" class="text-muted text-sm" style="padding:1rem 0;text-align:center;">No data yet.</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .lb-wrap { padding-top:2rem;padding-bottom:4rem;max-width:900px; }
    .lb-header { text-align:center;margin-bottom:2.5rem; }
    .eyebrow { font-size:.72rem;text-transform:uppercase;letter-spacing:1.5px;color:var(--accent);font-weight:700;margin-bottom:.3rem; }

    .lb-grid { display:grid;grid-template-columns:1fr 1fr;gap:1.5rem; }
    @media(max-width:640px){ .lb-grid{grid-template-columns:1fr;} }

    .lb-card {
      background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);
      overflow:hidden;
    }
    .lb-card-header {
      padding:1.25rem 1.5rem;background:linear-gradient(135deg,rgba(249,115,22,.08),rgba(124,58,237,.06));
      border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.65rem;
    }
    .lb-icon { font-size:1.3rem; }
    .lb-card-header h2 { font-size:1rem;font-weight:700;margin:0;flex:1; }
    .lb-sub { font-size:.72rem;color:var(--text-muted); }

    .lb-list { padding:.5rem 0; }
    .lb-row {
      display:flex;align-items:center;gap:1rem;padding:.85rem 1.5rem;
      border-bottom:1px solid rgba(255,255,255,.04);transition:background .15s;
    }
    .lb-row:hover { background:rgba(255,255,255,.03); }
    .lb-row:last-child { border-bottom:none; }

    /* Highlights */
    .top1 { background:linear-gradient(90deg,rgba(250,204,21,.06),transparent); }
    .top2 { background:linear-gradient(90deg,rgba(203,213,225,.04),transparent); }
    .top3 { background:linear-gradient(90deg,rgba(217,119,6,.04),transparent); }

    /* Rank badges */
    .rank-badge {
      min-width:32px;display:inline-flex;align-items:center;justify-content:center;
    }
    .rank-badge .material-symbols-outlined { font-size:1.6rem; }
    .rank-1 { color: #f59e0b; } /* Gold */
    .rank-2 { color: #94a3b8; } /* Silver */
    .rank-3 { color: #b45309; } /* Bronze */
    .rank-other { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); }

    .lb-name { flex:1;font-size:.9rem;font-weight:600;color:var(--text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
    .lb-score { text-align:right; }
    .score-num { font-size:1.1rem;font-weight:800;color:var(--accent);display:block; }
    .score-label { font-size:.68rem;color:var(--text-muted); }
  `]
})
export class LeaderboardComponent implements OnInit {
  loading = true;
  topReviewers: BoardEntry[] = [];
  topRenters:   BoardEntry[] = [];

  constructor(
    private reviewService: ReviewService,
    private rentalService: RentalService
  ) {}

  ngOnInit() {
    let done = 0;
    const checkDone = () => { if (++done === 2) this.loading = false; };

    // Reviews leaderboard
    this.reviewService.getAll().subscribe({
      next: reviews => {
        const map: Record<string, number> = {};
        reviews.forEach(r => {
          const name = r.username || r.userId;
          map[name] = (map[name] || 0) + 1;
        });
        this.topReviewers = this.toBoard(map);
        checkDone();
      },
      error: () => checkDone()
    });

    // Rentals leaderboard
    this.rentalService.getAll().subscribe({
      next: (rentals: any[]) => {
        const map: Record<string, number> = {};
        rentals.forEach(r => {
          const name = r.username || r.userId;
          map[name] = (map[name] || 0) + 1;
        });
        this.topRenters = this.toBoard(map);
        checkDone();
      },
      error: () => checkDone()
    });
  }

  private toBoard(map: Record<string, number>): BoardEntry[] {
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, score], i) => ({
        rank:  i + 1,
        name,
        score,
        badge: '' // badge string is unused now
      }));
  }
}
