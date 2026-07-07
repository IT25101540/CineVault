import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../core/services/review.service';
import { AiService, ReviewSummary } from '../../core/services/ai.service';
import { Review } from '../../core/models/models';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header flex-between">
        <div>
          <h2>Reviews</h2>
          <p class="text-sm text-muted">
            Average rating:
            <strong class="text-accent">{{ avgRating | number:'1.1-1' }} / 5</strong>
            &nbsp;({{ reviews.length }} reviews)
          </p>
        </div>
        <div style="display:flex;gap:.75rem;align-items:center;">
          <button class="btn-ai" (click)="generateSummary()"
                  [disabled]="aiLoading || reviews.length === 0">
            <span class="material-symbols-outlined" style="font-size:1rem;vertical-align:middle;">
              {{ aiLoading ? 'sync' : 'auto_awesome' }}
            </span>
            {{ aiLoading ? 'Analysing...' : 'AI Summary' }}
          </button>
          <a [routerLink]="['/reviews/add', movieId]" class="btn btn-primary btn-sm">+ Write a review</a>
        </div>
      </div>

      <!-- ── AI SUMMARY CARD ── -->
      <div class="ai-card" *ngIf="summary">
        <div class="ai-card-header">
          <span class="material-symbols-outlined ai-icon">auto_awesome</span>
          <span class="ai-label">AI Review Summary</span>
          <span class="sentiment-badge" [ngClass]="sentimentClass(summary.sentiment)">
            {{ summary.sentiment }}
          </span>
          <span class="sentiment-score">{{ summary.sentimentScore }}% Positive</span>
          <button class="ai-close" (click)="summary = null">✕</button>
        </div>

        <!-- Sentiment bar -->
        <div class="sentiment-bar-wrap">
          <div class="sentiment-bar" [style.width.%]="summary.sentimentScore"
               [ngClass]="sentimentClass(summary.sentiment)"></div>
        </div>

        <!-- Summary text -->
        <p class="ai-summary-text">{{ summary.summary }}</p>

        <!-- Highlights -->
        <div class="ai-highlights">
          <div class="highlight-item" *ngFor="let h of summary.highlights">
            <span class="material-symbols-outlined" style="font-size:.9rem;color:var(--accent);">arrow_forward</span>
            {{ h }}
          </div>
        </div>
      </div>

      <!-- AI Error -->
      <div class="ai-error" *ngIf="aiError">
        <span class="material-symbols-outlined">error</span>
        {{ aiError }}
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div *ngIf="!loading">
        <div class="review-card" *ngFor="let r of reviews">
          <div class="review-header">
            <div class="flex-center gap-1">
              <span class="stars-display">{{ starsFor(r.starRating) }}</span>
              <span class="badge badge-verified" *ngIf="r.verified">
                <span class="material-symbols-outlined"
                      style="font-size:inherit; vertical-align:text-bottom; margin-right: 2px;">check_circle</span>
                Verified
              </span>
            </div>
            <span class="text-xs text-muted">{{ r.createdAt | date:'dd MMM yyyy' }}</span>
          </div>
          <p style="font-size:.9rem;color:var(--text);">{{ r.commentText }}</p>
          <p class="text-xs text-muted mt-1">by
            <a [routerLink]="['/profile', r.userId]"
               class="text-accent" style="text-decoration:none;font-weight:500;">
              {{ r.username || r.userId }}
            </a>
          </p>
        </div>

        <p *ngIf="!reviews.length" class="text-muted" style="padding:3rem 0;">
          No reviews yet.
          <a [routerLink]="['/reviews/add', movieId]">Be the first to write one →</a>
        </p>
      </div>

      <a [routerLink]="['/movies', movieId]" class="btn btn-outline btn-sm mt-4">← Back to movie</a>
    </div>
  `,
  styles: [`
    /* ── Existing ── */
    .review-card { background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:.75rem; }
    .review-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:.75rem; }
    .stars-display { color:var(--accent);font-size:1rem;letter-spacing:1px; }

    /* ── AI Button ── */
    .btn-ai {
      display:inline-flex;align-items:center;gap:.4rem;
      padding:.45rem 1rem;font-size:.82rem;font-weight:600;
      border-radius:999px;cursor:pointer;transition:all .2s;
      background:linear-gradient(135deg,#7c3aed,#f97316);
      color:#fff;border:none;
    }
    .btn-ai:hover:not(:disabled) { opacity:.85;transform:translateY(-1px);box-shadow:0 4px 15px rgba(249,115,22,.35); }
    .btn-ai:disabled { opacity:.5;cursor:not-allowed; }
    .btn-ai .material-symbols-outlined { animation: none; }
    .btn-ai:disabled .material-symbols-outlined { animation:spin 1s linear infinite; }
    @keyframes spin { to { transform:rotate(360deg); } }

    /* ── AI Card ── */
    .ai-card {
      background:linear-gradient(135deg,rgba(124,58,237,.08),rgba(249,115,22,.06));
      border:1px solid rgba(124,58,237,.3);
      border-radius:var(--radius-lg);padding:1.25rem;margin-bottom:1.25rem;
      animation:fadeIn .4s ease;
    }
    @keyframes fadeIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
    .ai-card-header {
      display:flex;align-items:center;gap:.6rem;margin-bottom:.85rem;flex-wrap:wrap;
    }
    .ai-icon { font-size:1.1rem;color:#a78bfa; }
    .ai-label { font-weight:700;font-size:.9rem;color:#a78bfa;flex:1; }
    .ai-close {
      background:none;border:none;color:var(--text-muted);cursor:pointer;
      font-size:1rem;margin-left:auto;padding:.2rem .4rem;border-radius:4px;
    }
    .ai-close:hover { color:var(--text); }

    /* Sentiment badge */
    .sentiment-badge {
      font-size:.7rem;font-weight:700;letter-spacing:.8px;
      padding:.2rem .6rem;border-radius:999px;text-transform:uppercase;
    }
    .sentiment-badge.POSITIVE { background:rgba(34,197,94,.15);color:#4ade80; }
    .sentiment-badge.MIXED    { background:rgba(234,179, 8,.15);color:#facc15; }
    .sentiment-badge.NEGATIVE { background:rgba(239, 68,68,.15);color:#f87171; }
    .sentiment-score { font-size:.78rem;color:var(--text-muted); }

    /* Sentiment bar */
    .sentiment-bar-wrap {
      background:rgba(255,255,255,.07);border-radius:999px;height:5px;
      margin-bottom:1rem;overflow:hidden;
    }
    .sentiment-bar {
      height:100%;border-radius:999px;transition:width .8s ease;
    }
    .sentiment-bar.POSITIVE { background:linear-gradient(90deg,#4ade80,#22c55e); }
    .sentiment-bar.MIXED    { background:linear-gradient(90deg,#facc15,#eab308); }
    .sentiment-bar.NEGATIVE { background:linear-gradient(90deg,#f87171,#ef4444); }

    /* Summary text */
    .ai-summary-text { font-size:.88rem;color:var(--text);line-height:1.65;margin-bottom:.9rem; }

    /* Highlights */
    .ai-highlights { display:flex;flex-direction:column;gap:.45rem; }
    .highlight-item {
      display:flex;align-items:flex-start;gap:.4rem;
      font-size:.82rem;color:var(--text-muted);
    }

    /* Error */
    .ai-error {
      display:flex;align-items:center;gap:.5rem;
      background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.3);
      border-radius:var(--radius);padding:.75rem 1rem;margin-bottom:1rem;
      font-size:.85rem;color:#f87171;
    }
  `]
})
export class ReviewListComponent implements OnInit {
  reviews: Review[] = [];
  avgRating = 0;
  loading   = true;
  movieId   = '';

  // AI state
  summary:   ReviewSummary | null = null;
  aiLoading  = false;
  aiError:   string | null = null;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private aiService: AiService
  ) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('movieId')!;
    this.reviewService.getByMovie(this.movieId).subscribe({
      next: res => {
        this.reviews = res.reviews;
        this.avgRating = res.averageRating;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  generateSummary() {
    if (!this.reviews.length) return;
    this.aiLoading = true;
    this.aiError   = null;
    this.summary   = null;

    const input = this.reviews.map(r => ({
      text:   r.commentText,
      rating: r.starRating
    }));

    this.aiService.summarizeReviews(input).subscribe({
      next: result => {
        this.summary   = result;
        this.aiLoading = false;
      },
      error: () => {
        this.aiError   = 'AI summary failed. Please try again.';
        this.aiLoading = false;
      }
    });
  }

  sentimentClass(s: string) {
    return { POSITIVE: s === 'POSITIVE', MIXED: s === 'MIXED', NEGATIVE: s === 'NEGATIVE' };
  }

  starsFor(n: number): string {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }
}
