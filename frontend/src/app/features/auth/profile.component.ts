import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top:3rem;padding-bottom:4rem;">
      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>
      <div *ngIf="!loading && user">
        <div class="page-header flex-between">
          <div>
            <p class="eyebrow">Account</p>
            <h1>{{ user.username }}</h1>
          </div>
          <button class="btn btn-outline" (click)="editing = !editing">
            {{ editing ? 'Cancel' : 'Edit profile' }}
          </button>
        </div>

        <!-- View mode -->
        <div *ngIf="!editing" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;max-width:600px;">
          <div class="kpi-card">
            <p class="kpi-label">Email</p>
            <p style="font-size:.95rem;color:var(--text);">{{ user.email }}</p>
          </div>
          <div class="kpi-card">
            <p class="kpi-label">Membership</p>
            <span class="badge badge-gold"  *ngIf="user.membershipType === 'PREMIUM'">Premium</span>
            <span class="badge badge-gray"  *ngIf="user.membershipType !== 'PREMIUM'">Free</span>
          </div>
          <div class="kpi-card">
            <p class="kpi-label">Status</p>
            <span class="badge badge-green" *ngIf="user.active">Active</span>
            <span class="badge badge-red"   *ngIf="!user.active">Inactive</span>
          </div>
        </div>

        <!-- Edit mode -->
        <div *ngIf="editing" style="max-width:400px;">
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" class="form-control" [(ngModel)]="editEmail"/>
          </div>
          <div class="form-group">
            <label class="form-label">New password <span class="text-muted">(leave blank to keep)</span></label>
            <input type="password" class="form-control" [(ngModel)]="editPassword" placeholder="••••••••"/>
          </div>
          <div class="form-group">
            <label class="form-label">Membership</label>
            <select class="form-control" [(ngModel)]="editMembership">
              <option value="FREE">Free</option>
              <option value="PREMIUM">Premium</option>
            </select>
          </div>
          <div class="alert alert-success" *ngIf="saveSuccess">Profile updated!</div>
          <div style="display:flex;gap:.75rem;">
            <button class="btn btn-primary" (click)="saveProfile()">Save changes</button>
            <button class="btn btn-outline" (click)="editing = false">Cancel</button>
          </div>
        </div>

        <div style="margin-top:2rem;display:flex;gap:.75rem;">
          <a routerLink="/reviews/my" class="btn btn-outline btn-sm">My reviews</a>
          <a routerLink="/rentals/my" class="btn btn-outline btn-sm">My rentals</a>
          <button class="btn btn-ghost btn-sm" (click)="logout()">Sign out</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .eyebrow{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.4rem;}
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  loading = true;
  editing = false;
  editEmail = '';
  editPassword = '';
  editMembership = 'FREE';
  saveSuccess = false;

  constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getById(id).subscribe({
      next: u => {
        this.user = u;
        this.editEmail = u.email;
        this.editMembership = u.membershipType;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  saveProfile() {
    this.userService.update(this.user!.id, {
      email: this.editEmail,
      password: this.editPassword || undefined,
      membershipType: this.editMembership as any
    }).subscribe(u => {
      this.user = u;
      this.saveSuccess = true;
      this.editing = false;
      setTimeout(() => this.saveSuccess = false, 2500);
    });
  }

  logout() { this.userService.logout(); this.router.navigate(['/']); }
}
