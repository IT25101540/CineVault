import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { RentalService } from '../../core/services/rental.service';
import { Rental } from '../../core/models/models';

@Component({
  selector: 'app-return-movie',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container" style="padding-top:3.5rem;padding-bottom:4rem;">
      <div class="form-card">
        <div style="margin-bottom:2rem;">
          <p class="eyebrow">Rental</p>
          <h2>Confirm return</h2>
        </div>

        <div class="info-box" *ngIf="rental">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.75rem;">
            <div>
              <p class="text-xs text-muted" style="text-transform:uppercase;letter-spacing:.08em;">Movie</p>
              <p class="text-sm">{{ rental.movieId }}</p>
            </div>
            <div>
              <p class="text-xs text-muted" style="text-transform:uppercase;letter-spacing:.08em;">Due date</p>
              <p class="text-sm">{{ rental.dueDate | date:'dd MMM yyyy' }}</p>
            </div>
          </div>
          <div class="alert alert-error" *ngIf="rental.daysOverdue > 0" style="margin-top:1rem;margin-bottom:0;">
            <span class="material-symbols-outlined" style="font-size:1.1rem;vertical-align:middle;margin-right:4px;">warning</span>
            {{ rental.daysOverdue }} day(s) overdue — late fee applies
          </div>
        </div>

        <div class="alert alert-error" *ngIf="error">{{ error }}</div>

        <div style="display:flex;gap:.75rem;">
          <button class="btn btn-primary" (click)="confirmReturn()" [disabled]="saving">
            {{ saving ? 'Processing…' : 'Confirm return' }}
          </button>
          <a routerLink="/rentals/my" class="btn btn-outline">Cancel</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow { font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem; }
    .info-box { background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;margin-bottom:1.5rem; }
  `]
})
export class ReturnMovieComponent implements OnInit {
  rental: Rental | null = null;
  saving = false;
  error = '';

  constructor(private route: ActivatedRoute, private router: Router, private rentalService: RentalService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.rentalService.getById(id).subscribe(r => this.rental = r);
  }

  confirmReturn() {
    this.saving = true; this.error = '';
    this.rentalService.returnMovie(this.rental!.id).subscribe({
      next: () => this.router.navigate(['/rentals/my']),
      error: e => { this.error = e.error?.error || 'Return failed.'; this.saving = false; }
    });
  }
}
