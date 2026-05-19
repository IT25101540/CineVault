import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RentalService } from '../../core/services/rental.service';
import { UserService } from '../../core/services/user.service';
import { Rental } from '../../core/models/models';

@Component({
  selector: 'app-my-rentals',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="page-header"><h2>My Rentals</h2></div>
      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div class="table-wrap" *ngIf="!loading && rentals.length">
        <table>
          <thead>
            <tr><th>Movie</th><th>Rented</th><th>Due</th><th>Returned</th><th>Status</th><th>Fee</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of rentals">
              <td><a [routerLink]="['/movies', r.movieId]" class="text-accent">{{ r.movieTitle || r.movieId }}</a></td>
              <td class="text-xs text-muted">{{ r.rentalDate | date:'dd MMM' }}</td>
              <td class="text-xs text-muted">{{ r.dueDate | date:'dd MMM' }}</td>
              <td class="text-xs text-muted">{{ r.returnedDate ? (r.returnedDate | date:'dd MMM') : '—' }}</td>
              <td>
                <span class="badge badge-green"  *ngIf="r.status === 'ACTIVE'">Active</span>
                <span class="badge badge-gray"   *ngIf="r.status === 'RETURNED'">Returned</span>
                <span class="badge badge-red"    *ngIf="r.status === 'OVERDUE'">Overdue</span>
              </td>
              <td class="text-sm">{{ r.totalFee > 0 ? ('LKR ' + (r.totalFee | number:'1.2-2')) : '—' }}</td>
              <td>
                <a *ngIf="r.status === 'ACTIVE'" [routerLink]="['/rentals/return', r.id]" class="btn btn-outline btn-sm">Return</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="!loading && !rentals.length" class="text-muted" style="padding:3rem 0;">
        No rentals yet. <a routerLink="/movies">Browse movies →</a>
      </p>
    </div>
  `
})
export class MyRentalsComponent implements OnInit {
  rentals: Rental[] = [];
  loading = true;

  constructor(private rentalService: RentalService, private userService: UserService) {}

  ngOnInit() {
    const uid = this.userService.currentUser?.id || 'usr-001';
    this.rentalService.getByUser(uid).subscribe({
      next: r => { this.rentals = r; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
