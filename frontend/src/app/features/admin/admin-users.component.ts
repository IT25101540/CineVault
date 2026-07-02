import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { AdminService } from '../../core/services/admin.service';
import { User, Admin } from '../../core/models/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <div class="container">
      <div class="page-header flex-between">
        <h1>User Management</h1>
        <a routerLink="/auth/register" class="btn btn-primary btn-sm">+ New user</a>
      </div>

      <!-- Admin Nav -->
      <div class="admin-nav" *ngIf="currentAdmin">
        <a routerLink="/admin/dashboard" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Dashboard</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'USER_ADMIN'])" routerLink="/admin/users" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Users</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'REVIEW_ADMIN'])" routerLink="/admin/reviews" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Reviews</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'RENTAL_ADMIN'])" routerLink="/admin/rentals" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg> Rentals</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'ADMIN_ADMIN'])" routerLink="/admin/admins" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Admins</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'MOVIE_ADMIN'])" routerLink="/movies/add" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg> Add Movie</a>
        <a *ngIf="hasRole(['SUPER_ADMIN', 'PERSON_ADMIN'])" routerLink="/people/add" routerLinkActive="active"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg> Add Person</a>
      </div>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>
      <div class="table-wrap" *ngIf="!loading">
        <table>
          <thead>
            <tr><th>Username</th><th>Email</th><th>Membership</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let u of users">
              <td>{{ u.username }}</td>
              <td class="text-muted text-sm">{{ u.email }}</td>
              <td>
                <span class="badge" 
                      [class.badge-gold]="u.membershipType==='ELITE'"
                      [class.badge-primary]="u.membershipType==='PREMIUM'"
                      [class.badge-gray]="u.membershipType==='FREE' || !u.membershipType">
                  {{ u.membershipType || 'FREE' }}
                </span>
              </td>
              <td>
                <span class="badge badge-green" *ngIf="u.active">Active</span>
                <span class="badge badge-red"   *ngIf="!u.active">Inactive</span>
              </td>
              <td style="display:flex;gap:.4rem;align-items:center;white-space:nowrap;">
                <button class="btn btn-outline btn-sm" (click)="viewProfile(u)">View Profile</button>
                <button class="btn btn-ghost btn-sm" (click)="openEditModal(u)">Edit</button>
                <button class="btn btn-danger btn-sm" (click)="openSuspendModal(u)" *ngIf="u.active">Suspend</button>
                <button class="btn btn-primary btn-sm" (click)="toggleActive(u)" *ngIf="!u.active">Activate</button>
              </td>
            </tr>
          </tbody>
        </table>
        <p class="text-muted text-sm" style="padding:.75rem 0;">{{ users.length }} users total</p>
      </div>

      <!-- View Profile Modal -->
      <div class="modal-backdrop" *ngIf="selectedUserForView" (click)="selectedUserForView = null">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>User Profile</h2>
            <button class="btn-close" (click)="selectedUserForView = null">×</button>
          </div>
          <div class="modal-body">
            <div class="profile-avatar">{{ selectedUserForView.username.substring(0, 2).toUpperCase() }}</div>
            <div class="profile-details">
              <div class="detail-row"><span class="label">User ID:</span><span class="value">{{ selectedUserForView.id }}</span></div>
              <div class="detail-row"><span class="label">Username:</span><span class="value">{{ selectedUserForView.username }}</span></div>
              <div class="detail-row"><span class="label">Email Address:</span><span class="value">{{ selectedUserForView.email }}</span></div>
              <div class="detail-row"><span class="label">Membership Plan:</span><span class="value">
                <span class="badge" [class.badge-gold]="selectedUserForView.membershipType==='ELITE'" [class.badge-primary]="selectedUserForView.membershipType==='PREMIUM'" [class.badge-gray]="selectedUserForView.membershipType==='FREE' || !selectedUserForView.membershipType">
                  {{ selectedUserForView.membershipType || 'FREE' }}
                </span>
              </span></div>
              <div class="detail-row"><span class="label">Account Status:</span><span class="value">
                <span class="badge badge-green" *ngIf="selectedUserForView.active">Active</span>
                <span class="badge badge-red" *ngIf="!selectedUserForView.active">Inactive</span>
              </span></div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="selectedUserForView = null">Close</button>
          </div>
        </div>
      </div>

      <!-- Edit Details Modal -->
      <div class="modal-backdrop" *ngIf="selectedUserForEdit" (click)="closeEditModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Edit User Account</h2>
            <button class="btn-close" (click)="closeEditModal()">×</button>
          </div>
          <form (submit)="saveUserEdit($event)">
            <div class="modal-body">
              <div class="form-group">
                <label>Username</label>
                <input type="text" [(ngModel)]="editUsername" name="username" class="form-control" required />
              </div>
              <div class="form-group">
                <label>Email Address</label>
                <input type="email" [(ngModel)]="editEmail" name="email" class="form-control" required />
              </div>
              <div class="form-group">
                <label>New Password (leave blank to keep current)</label>
                <input type="password" [(ngModel)]="editPassword" name="password" class="form-control" placeholder="••••••••" />
              </div>
              <div class="form-group">
                <label>Membership Plan</label>
                <select [(ngModel)]="editMembershipType" name="membershipType" class="form-control">
                  <option value="FREE">FREE</option>
                  <option value="PREMIUM">PREMIUM</option>
                  <option value="ELITE">ELITE</option>
                </select>
              </div>
              <div class="form-group">
                <label>Account Status</label>
                <select [(ngModel)]="editActive" name="active" class="form-control">
                  <option [ngValue]="true">Active</option>
                  <option [ngValue]="false">Inactive</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" (click)="closeEditModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
      <!-- Suspend User Modal -->
      <div class="modal-backdrop" *ngIf="selectedUserForSuspend" (click)="selectedUserForSuspend = null">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Suspend User</h2>
            <button class="btn-close" (click)="selectedUserForSuspend = null">×</button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to suspend <strong>{{ selectedUserForSuspend.username }}</strong>?</p>
            <div class="form-group">
              <label>Reason for suspension</label>
              <textarea [(ngModel)]="suspendReason" class="form-control" rows="3" placeholder="e.g. Violation of terms"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" (click)="selectedUserForSuspend = null">Cancel</button>
            <button class="btn btn-danger" (click)="suspendUser()">Suspend</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-nav{display:flex;gap:.25rem;flex-wrap:nowrap;overflow-x:auto;-webkit-overflow-scrolling:touch;margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border);scrollbar-width:none;}
    .admin-nav::-webkit-scrollbar{display:none;}
    .admin-nav a{display:flex;align-items:center;gap:.35rem;color:var(--text-muted);font-size:.875rem;font-weight:500;padding:.4rem .75rem;border-radius:var(--radius);text-decoration:none;transition:all .18s;white-space:nowrap;}
    .admin-nav a:hover,.admin-nav a.active{color:var(--text);background:var(--surface-2);}

    /* Modal styles with beautiful Glassmorphism */
    .modal-backdrop{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:1000;}
    .modal-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);width:100%;max-width:480px;box-shadow:0 24px 64px rgba(0,0,0,0.6);animation:fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);overflow:hidden;}
    .modal-header{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);}
    .modal-header h2{font-size:1.2rem;font-weight:600;margin:0;}
    .btn-close{background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;padding:0;line-height:1;}
    .btn-close:hover{color:var(--text);}
    .modal-body{padding:1.5rem;display:flex;flex-direction:column;gap:1.1rem;}
    .modal-footer{display:flex;justify-content:flex-end;gap:.5rem;padding:1.1rem 1.5rem;background:var(--surface-2);border-top:1px solid var(--border);}
    .detail-row{display:flex;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid var(--border);}
    .detail-row:last-child{border-bottom:none;}
    .detail-row .label{color:var(--text-muted);font-size:.875rem;}
    .detail-row .value{font-weight:500;font-size:.875rem;}
    .profile-avatar{width:64px;height:64px;background:var(--accent);color:#fff;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:700;margin:0 auto .75rem auto;box-shadow:0 4px 12px rgba(0,0,0,0.3);}
    .form-group{display:flex;flex-direction:column;gap:.35rem;}
    .form-group label{font-size:.825rem;color:var(--text-muted);font-weight:500;}
    .form-control{background:var(--surface-2);border:1px solid var(--border);color:var(--text);padding:.6rem .75rem;border-radius:var(--radius);font-size:.9rem;outline:none;transition:border-color 0.15s;}
    .form-control:focus{border-color:var(--accent);}
    @keyframes fadeIn { from{opacity:0;transform:scale(0.96);} to{opacity:1;transform:scale(1);} }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  currentAdmin: Admin | null = null;

  // Modal controls
  selectedUserForView: User | null = null;
  selectedUserForEdit: User | null = null;
  selectedUserForSuspend: User | null = null;
  suspendReason: string = '';

  // Form binds
  editUsername = '';
  editEmail = '';
  editPassword = '';
  editMembershipType = '';
  editActive = true;

  constructor(private userService: UserService, private adminService: AdminService, private router: Router) {}

  ngOnInit() {
    this.currentAdmin = this.adminService.currentAdmin;
    if (!this.currentAdmin || !this.hasRole(['SUPER_ADMIN', 'USER_ADMIN'])) {
      this.router.navigate(['/admin/dashboard']);
      return;
    }

    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe({
      next: u => { this.users = u; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  hasRole(roles: string[]): boolean {
    return this.currentAdmin ? roles.includes(this.currentAdmin.role) : false;
  }
  
  viewProfile(user: User) {
    this.selectedUserForView = user;
  }

  openEditModal(user: User) {
    this.selectedUserForEdit = user;
    this.editUsername = user.username;
    this.editEmail = user.email;
    this.editPassword = '';
    this.editMembershipType = user.membershipType || 'FREE';
    this.editActive = user.active;
  }

  closeEditModal() {
    this.selectedUserForEdit = null;
  }

  saveUserEdit(event: Event) {
    event.preventDefault();
    if (!this.selectedUserForEdit) return;

    const updatedData: any = {
      username: this.editUsername,
      email: this.editEmail,
      membershipType: this.editMembershipType,
      active: this.editActive
    };

    if (this.editPassword && this.editPassword.trim()) {
      updatedData.password = this.editPassword;
    }

    this.userService.update(this.selectedUserForEdit.id, updatedData).subscribe({
      next: (updatedUser) => {
        this.users = this.users.map(u => u.id === updatedUser.id ? updatedUser : u);
        this.closeEditModal();
      },
      error: (err) => {
        console.error("Failed to update user details", err);
        alert("Failed to update user details.");
      }
    });
  }

  openSuspendModal(user: User) {
    this.selectedUserForSuspend = user;
    this.suspendReason = '';
  }

  suspendUser() {
    if (!this.selectedUserForSuspend) return;
    const user = this.selectedUserForSuspend;
    this.userService.suspend(user.id, this.suspendReason || 'Violation of terms').subscribe({
      next: () => {
        const updated = { ...user, active: false };
        this.users = this.users.map(u => u.id === user.id ? updated : u);
        if (this.selectedUserForView && this.selectedUserForView.id === user.id) {
          this.selectedUserForView = updated;
        }
        this.selectedUserForSuspend = null;
      },
      error: (err) => {
        console.error(`Failed to suspend user`, err);
        alert(`Failed to suspend user.`);
      }
    });
  }

  toggleActive(user: User) {
    const action = 'Activate';
    if (confirm(`${action} this user?`)) {
      this.userService.update(user.id, { active: true }).subscribe({
        next: (updated) => {
          this.users = this.users.map(u => u.id === user.id ? updated : u);
          if (this.selectedUserForView && this.selectedUserForView.id === user.id) {
            this.selectedUserForView = updated;
          }
        },
        error: (err) => {
          console.error(`Failed to ${action.toLowerCase()} user`, err);
          alert(`Failed to update user status.`);
        }
      });
    }
  }
}
