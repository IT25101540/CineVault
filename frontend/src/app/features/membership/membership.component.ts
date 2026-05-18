import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-membership',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ],
  template: `
    <div class="membership-container">
      <!-- Step 1: Plan Selection -->
      <div *ngIf="step === 1" [@fadeIn]>
        <div class="header">
          <p class="eyebrow">Choose Your Experience</p>
          <h1>Membership <span class="text-accent">Packages</span></h1>
          <p class="subtitle">Select the perfect plan to unlock the full potential of CineVault</p>
        </div>

        <div class="packages-grid">
          <!-- Starter Plan -->
          <div class="package-card" [class.active-plan]="currentUser?.membershipType === 'FREE'">
            <div class="card-inner">
              <div class="plan-type">Basic</div>
              <h2 class="plan-name">CineStarter</h2>
              <div class="price">
                <span class="currency">LKR</span>
                <span class="amount">0</span>
                <span class="period">/mo</span>
              </div>
              <p class="description">Perfect for casual viewers who want to explore our library.</p>
              
              <ul class="features-list">
                <li><span class="material-symbols-outlined">check_circle</span> Standard Definition (480p)</li>
                <li><span class="material-symbols-outlined">check_circle</span> Access to 500+ Movies</li>
                <li><span class="material-symbols-outlined">check_circle</span> Ad-supported Experience</li>
                <li><span class="material-symbols-outlined">check_circle</span> Single Device Stream</li>
              </ul>

              <button class="btn btn-outline w-full mt-auto" [disabled]="currentUser?.membershipType === 'FREE'" (click)="selectPlan('FREE')">
                {{ currentUser?.membershipType === 'FREE' ? 'Current Plan' : 'Get Started' }}
              </button>
            </div>
          </div>

          <!-- Premium Plan -->
          <div class="package-card popular" [class.active-plan]="currentUser?.membershipType === 'PREMIUM'">
            <div class="popular-badge">Most Popular</div>
            <div class="card-inner">
              <div class="plan-type">Pro</div>
              <h2 class="plan-name">CinePremium</h2>
              <div class="price">
                <span class="currency">LKR</span>
                <span class="amount">2,500</span>
                <span class="period">/mo</span>
              </div>
              <p class="description">The ultimate cinematic experience with high-quality streaming.</p>
              
              <ul class="features-list">
                <li><span class="material-symbols-outlined">check_circle</span> 4K Ultra HD + HDR</li>
                <li><span class="material-symbols-outlined">check_circle</span> Entire Movie & Series Library</li>
                <li><span class="material-symbols-outlined">check_circle</span> Ad-Free Streaming</li>
                <li><span class="material-symbols-outlined">check_circle</span> 4 Simultaneous Devices</li>
                <li><span class="material-symbols-outlined">check_circle</span> Offline Downloads</li>
              </ul>

              <button class="btn btn-primary w-full mt-auto" [disabled]="currentUser?.membershipType === 'PREMIUM'" (click)="selectPlan('PREMIUM')">
                {{ currentUser?.membershipType === 'PREMIUM' ? 'Current Plan' : 'Go Premium' }}
              </button>
            </div>
          </div>

          <!-- Elite Plan -->
          <div class="package-card" [class.active-plan]="currentUser?.membershipType === 'ELITE'">
            <div class="card-inner">
              <div class="plan-type">VIP</div>
              <h2 class="plan-name">CineElite</h2>
              <div class="price">
                <span class="currency">LKR</span>
                <span class="amount">5,800</span>
                <span class="period">/mo</span>
              </div>
              <p class="description">Exclusive access and premium perks for true movie enthusiasts.</p>
              
              <ul class="features-list">
                <li><span class="material-symbols-outlined">check_circle</span> Everything in Premium</li>
                <li><span class="material-symbols-outlined">check_circle</span> Early Access to New Releases</li>
                <li><span class="material-symbols-outlined">check_circle</span> Exclusive Director's Cuts</li>
                <li><span class="material-symbols-outlined">check_circle</span> Priority Customer Support</li>
                <li><span class="material-symbols-outlined">check_circle</span> 2 Free Movie Rentals Monthly</li>
              </ul>

              <button class="btn btn-outline w-full mt-auto" [disabled]="currentUser?.membershipType === 'ELITE'" (click)="selectPlan('ELITE')">
                {{ currentUser?.membershipType === 'ELITE' ? 'Current Plan' : 'Join Elite' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Cancel Subscription Banner (shown when user has paid plan) -->
        <div class="cancel-banner" *ngIf="currentUser?.membershipType === 'PREMIUM' || currentUser?.membershipType === 'ELITE'">
          <div class="cancel-banner-inner">
            <div>
              <p class="cancel-title">Want to cancel your subscription?</p>
              <p class="cancel-sub">You'll be downgraded to the free CineStarter plan. Your data won't be affected.</p>
            </div>
            <button class="btn btn-danger btn-sm" (click)="showCancelModal = true">Cancel Subscription</button>
          </div>
        </div>

        <!-- Cancel Confirmation Modal -->
        <div class="modal-overlay" *ngIf="showCancelModal" (click)="showCancelModal = false">
          <div class="modal-box" (click)="$event.stopPropagation()">
            <span class="material-symbols-outlined modal-icon">warning</span>
            <h3>Cancel Membership?</h3>
            <p>You will lose access to all <strong>{{ currentUser?.membershipType }}</strong> features and be downgraded to the <strong>Free</strong> plan immediately.</p>
            <div class="modal-actions">
              <button class="btn btn-outline" (click)="showCancelModal = false">Keep My Plan</button>
              <button class="btn btn-danger" (click)="cancelMembership()" [disabled]="loading">
                {{ loading ? 'Cancelling...' : 'Yes, Cancel It' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Checkout Form -->
      <div *ngIf="step === 2" class="form-section" [@fadeIn]>
        <div class="header" style="margin-bottom: 2.5rem;">
          <button class="back-btn" (click)="step = 1">
            <span class="material-symbols-outlined">arrow_back</span> Back to Plans
          </button>
          <p class="eyebrow">{{ currentUser ? 'Review & Confirm' : 'Complete Registration' }}</p>
          <h1>Plan: <span class="text-accent">{{ selectedPlan }}</span></h1>
          <p class="subtitle">{{ currentUser ? 'Check your details below and confirm your subscription' : 'Enter your details below to activate your membership' }}</p>
        </div>

        <div class="form-card checkout-card">
          <div class="grid-form">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" placeholder="Your name" [(ngModel)]="formData.name">
            </div>
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="text" class="form-control" placeholder="+94 77 000 0000" [(ngModel)]="formData.phone">
            </div>
            <div class="form-group">
              <label class="form-label">Location / City</label>
              <input type="text" class="form-control" placeholder="Colombo, Sri Lanka" [(ngModel)]="formData.location">
            </div>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" placeholder="email@example.com" [(ngModel)]="formData.email" [disabled]="!!currentUser">
            </div>
            <div class="form-group full-width">
              <label class="form-label">Message / Special Requests (Optional)</label>
              <textarea class="form-control" rows="4" placeholder="Tell us if you have any specific preferences..." [(ngModel)]="formData.message"></textarea>
            </div>
          </div>

          <div class="login-prompt" *ngIf="!currentUser">
            <p>Already have an account? <a routerLink="/auth/login">Log in here</a> to skip form filling.</p>
          </div>

          <button class="btn btn-primary w-full mt-4" (click)="submitForm()" [disabled]="loading">
            {{ loading ? 'Processing Activation...' : 'Activate ' + selectedPlan + ' Plan' }}
          </button>

          <div class="form-footer">
            <p>Or reach us directly via:</p>
            <div class="direct-contact">
              <span class="material-symbols-outlined">chat</span>
              WhatsApp Support
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Success -->
      <div *ngIf="step === 3" class="success-section" [@fadeIn]>
        <div class="celebration-container">
          <div class="confetti-piece" *ngFor="let p of [1,2,3,4,5,6,7,8,9,10]"></div>
          <div class="vip-card-glow">
            <div class="vip-card">
              <div class="vip-chip"></div>
              <div class="vip-logo">CineVault</div>
              <div class="vip-level">{{ selectedPlan }}</div>
              <div class="vip-holder">{{ formData.name }}</div>
            </div>
          </div>
        </div>
        
        <h1 class="mt-4">Welcome to the <span class="text-accent">Elite Circle!</span></h1>
        <p class="subtitle">Your <strong>{{ selectedPlan }}</strong> membership is now active. You have unlocked premium features and exclusive content.</p>
        
        <div class="flex gap-1 justify-center mt-4">
          <button class="btn btn-primary" routerLink="/movies">Start Watching Now</button>
          <button class="btn btn-outline" (click)="step = 1">View My Plan</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .membership-container { padding: 4rem 2rem; max-width: 1200px; margin: 0 auto; min-height: 80vh; }
    .header { text-align: center; margin-bottom: 4rem; position: relative; }
    .eyebrow { font-size: 0.875rem; font-weight: 600; color: var(--accent); text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 1rem; }
    h1 { font-size: 3rem; margin-bottom: 1rem; color: #eae5d0; }
    .subtitle { color: var(--text-muted); font-size: 1.125rem; max-width: 600px; margin: 0 auto; }

    /* Plans Grid */
    .packages-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; align-items: stretch; }
    .package-card { background: rgba(234, 229, 208, 0.03); border: 1px solid rgba(234, 229, 208, 0.1); border-radius: 24px; padding: 2.5rem; display: flex; flex-direction: column; transition: all 0.3s; position: relative; overflow: hidden; }
    .package-card:hover { transform: translateY(-10px); border-color: var(--accent); background: rgba(234, 229, 208, 0.05); }
    .package-card.popular { border: 2px solid var(--accent); transform: scale(1.05); }
    .package-card.active-plan { border-color: #27ae60; background: rgba(39, 174, 96, 0.05); }
    .package-card.active-plan::after { content: 'ACTIVE'; position: absolute; top: 10px; left: 10px; background: #27ae60; color: white; font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; font-weight: 700; }
    
    .popular-badge { position: absolute; top: 0; right: 0; background: var(--accent); color: #000; font-size: 0.75rem; font-weight: 700; padding: 0.5rem 1.5rem; border-bottom-left-radius: 20px; }
    .plan-name { font-size: 1.75rem; margin-bottom: 1.5rem; color: #eae5d0; }
    .price { display: flex; align-items: baseline; gap: 0.25rem; margin-bottom: 1.5rem; }
    .amount { font-size: 3rem; font-weight: 700; color: #eae5d0; }
    .features-list { list-style: none; padding: 0; margin: 0 0 2.5rem 0; display: flex; flex-direction: column; gap: 1rem; }
    .features-list li { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9375rem; color: #eae5d0; }
    .features-list li .material-symbols-outlined { font-size: 1.25rem; color: var(--accent); }

    /* Form Section */
    .form-section { max-width: 800px; margin: 0 auto; }
    .checkout-card { padding: 3rem; background: rgba(234, 229, 208, 0.03); border: 1px solid rgba(234, 229, 208, 0.1); border-radius: 24px; }
    .grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .full-width { grid-column: span 2; }
    .back-btn { position: absolute; left: 0; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 0.5rem; background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
    .back-btn:hover { color: var(--accent); }

    .login-prompt { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: var(--text-muted); }
    .login-prompt a { color: var(--accent); text-decoration: none; font-weight: 600; }

    .form-footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(234, 229, 208, 0.05); text-align: center; }
    .form-footer p { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem; }
    .direct-contact { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: #25D36622; color: #25D366; border-radius: 50px; font-weight: 600; font-size: 0.875rem; }

    /* Success Section */
    .success-section { text-align: center; padding: 2rem 0; }
    .celebration-container { position: relative; height: 300px; display: flex; align-items: center; justify-content: center; perspective: 1000px; }
    
    .vip-card-glow {
      position: relative;
      animation: float 3s ease-in-out infinite;
    }
    .vip-card-glow::before {
      content: ''; position: absolute; top: -20px; left: -20px; right: -20px; bottom: -20px;
      background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
      opacity: 0.3; filter: blur(20px); animation: pulse 2s infinite;
    }

    .vip-card {
      width: 350px; height: 200px;
      background: linear-gradient(135deg, #1a1a1a 0%, #333 100%);
      border: 1px solid rgba(234, 229, 208, 0.3);
      border-radius: 15px; padding: 20px;
      display: flex; flex-direction: column; justify-content: space-between;
      text-align: left; position: relative; overflow: hidden;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .vip-card::after {
      content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
      background: linear-gradient(45deg, transparent, rgba(234, 229, 208, 0.1), transparent);
      transform: rotate(30deg); animation: shine 3s infinite;
    }
    .vip-chip { width: 45px; height: 35px; background: linear-gradient(135deg, #ffd700, #b8860b); border-radius: 5px; }
    .vip-logo { font-size: 1.2rem; font-weight: 800; color: #eae5d0; }
    .vip-level { font-size: 1.5rem; font-weight: 700; color: var(--accent); letter-spacing: 0.1em; }
    .vip-holder { font-size: 0.9rem; color: #eae5d0; opacity: 0.8; }

    @keyframes float { 0%, 100% { transform: translateY(0) rotateX(5deg); } 50% { transform: translateY(-20px) rotateX(-5deg); } }
    @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } }
    @keyframes shine { 0% { transform: translateX(-100%) rotate(30deg); } 100% { transform: translateX(100%) rotate(30deg); } }

    .btn { padding: 1rem 2rem; border-radius: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
    .btn-primary { background: var(--accent); color: #000; border: none; }
    .btn-primary:hover { filter: brightness(1.1); transform: scale(1.02); }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-outline { background: transparent; border: 1px solid rgba(234, 229, 208, 0.2); color: #eae5d0; }
    .btn-sm { padding: 0.5rem 1.2rem; font-size: 0.85rem; border-radius: 8px; }
    .btn-danger { background: #dc2626; color: #fff; border: none; }
    .btn-danger:hover { background: #b91c1c; }
    .btn-danger:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Cancel Banner */
    .cancel-banner {
      margin-top: 3rem;
      background: rgba(220, 38, 38, 0.08);
      border: 1px solid rgba(220, 38, 38, 0.25);
      border-radius: 16px;
      padding: 1.5rem 2rem;
    }
    .cancel-banner-inner {
      display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
    }
    .cancel-title { font-weight: 600; color: #eae5d0; margin-bottom: 0.3rem; }
    .cancel-sub { color: var(--text-muted); font-size: 0.875rem; margin: 0; }

    /* Modal */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.7);
      display: flex; align-items: center; justify-content: center;
      z-index: 9999; backdrop-filter: blur(4px);
    }
    .modal-box {
      background: #1a1a1a; border: 1px solid rgba(220,38,38,0.3);
      border-radius: 20px; padding: 2.5rem;
      max-width: 440px; width: 90%; text-align: center;
    }
    .modal-icon { font-size: 3rem; color: #f97316; margin-bottom: 1rem; display: block; }
    .modal-box h3 { font-size: 1.5rem; color: #eae5d0; margin-bottom: 0.75rem; }
    .modal-box p { color: var(--text-muted); margin-bottom: 2rem; line-height: 1.6; }
    .modal-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  `]
})
export class MembershipComponent {
  step = 1;
  selectedPlan: 'FREE' | 'PREMIUM' | 'ELITE' = 'FREE';
  loading = false;
  showCancelModal = false;
  formData = { name: '', phone: '', location: '', email: '', message: '' };

  constructor(private userService: UserService) {}

  get currentUser() { return this.userService.currentUser; }

  selectPlan(plan: 'FREE' | 'PREMIUM' | 'ELITE') {
    this.selectedPlan = plan;
    
    if (this.currentUser) {
      this.formData.name = this.currentUser.username;
      this.formData.email = this.currentUser.email;
    }

    this.step = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  submitForm() {
    if (!this.formData.name || !this.formData.email) {
      alert('Please fill in the required fields.');
      return;
    }

    this.loading = true;
    
    // Call backend to update membership
    if (this.currentUser) {
      this.userService.update(this.currentUser.id, { membershipType: this.selectedPlan }).subscribe({
        next: (updatedUser) => {
          // Update local storage and behavior subject
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          (this.userService as any).currentUserSubject.next(updatedUser);
          
          setTimeout(() => {
            this.loading = false;
            this.step = 3;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          alert('Failed to update membership. Please try again.');
        }
      });
    } else {
      // For non-logged in users (demo)
      setTimeout(() => {
        this.loading = false;
        this.step = 3;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1500);
    }
  }  // ← submitForm() ends here

  cancelMembership() {
    if (!this.currentUser) return;
    this.loading = true;
    this.userService.update(this.currentUser.id, { membershipType: 'FREE' }).subscribe({
      next: (updatedUser) => {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        (this.userService as any).currentUserSubject.next(updatedUser);
        this.loading = false;
        this.showCancelModal = false;
      },
      error: () => {
        this.loading = false;
        alert('Failed to cancel membership. Please try again.');
      }
    });
  }
}



