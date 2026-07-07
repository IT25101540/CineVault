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

        <!-- 🎁 Referral Card -->
        <div class="referral-card" *ngIf="currentUser">
          <div class="referral-inner">
            <span class="material-symbols-outlined referral-icon">card_giftcard</span>
            <div class="referral-details">
              <h3>Refer a Friend & Both Save!</h3>
              <p>Share CineVault with your friends. When they use your referral code during membership upgrade, both of you get special perks!</p>
            </div>
            <div class="referral-action-box">
              <span class="referral-label">Your Referral Code:</span>
              <div class="referral-code-wrapper">
                <span class="referral-code">{{ referralCode }}</span>
                <button class="btn btn-primary btn-sm btn-copy" (click)="copyReferralCode()">
                  <span class="material-symbols-outlined" style="font-size: 1rem;">{{ copied ? 'check_circle' : 'content_copy' }}</span>
                  {{ copied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
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
          <div class="checkout-layout" *ngIf="selectedPlan !== 'FREE'; else basicLayout">
            <!-- Left Side: Fields -->
            <div style="display:flex; flex-direction:column; gap:1.5rem;">
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
              </div>

              <!-- Card Details -->
              <div class="card-details-section">
                <h3 style="font-size:1.1rem; color:var(--text); font-weight:600; margin-bottom:1rem; letter-spacing:0.5px;">Card Information</h3>
                <div class="grid-card-form">
                  <div class="form-group col-span-2">
                    <label class="form-label">Card Number</label>
                    <input type="text" class="form-control" placeholder="4111 2222 3333 4444" 
                           [(ngModel)]="cardData.number" (input)="onCardNumberInput($event)" maxlength="19">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Expiry Date</label>
                    <input type="text" class="form-control" placeholder="MM/YY" 
                           [(ngModel)]="cardData.expiry" (input)="onExpiryInput($event)" maxlength="5">
                  </div>
                  <div class="form-group">
                    <label class="form-label">CVV</label>
                    <input type="password" class="form-control" placeholder="•••" 
                           [(ngModel)]="cardData.cvv" (focus)="cardFlipped = true" (blur)="cardFlipped = false" maxlength="3">
                  </div>
                  <div class="form-group col-span-2">
                    <label class="form-label">Cardholder Name</label>
                    <input type="text" class="form-control" placeholder="JOHN DOE" [(ngModel)]="cardData.name" (input)="cardData.name = cardData.name.toUpperCase()">
                  </div>
                </div>
              </div>

              <!-- Promo Code -->
              <div class="card-details-section">
                <h3 style="font-size:1.1rem; color:var(--text); font-weight:600; margin-bottom:0.5rem; letter-spacing:0.5px;">Promo Code</h3>
                <div class="promo-section">
                  <input type="text" class="form-control" placeholder="e.g. WELCOME20" [(ngModel)]="promoCode" style="text-transform: uppercase;">
                  <button class="btn btn-outline" style="padding:0 .8rem; min-height:41px;" (click)="applyPromo()">Apply</button>
                </div>
                <div class="promo-feedback promo-success" *ngIf="promoSuccess">{{ promoSuccess }}</div>
                <div class="promo-feedback promo-error" *ngIf="promoError">{{ promoError }}</div>
              </div>
            </div>

            <!-- Right Side: Virtual Card & Summary -->
            <div class="payment-preview">
              <div class="card-container-3d">
                <div class="card-wrapper-3d" [class.flipped]="cardFlipped">
                  <!-- Front -->
                  <div class="card-front">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                      <div class="card-chip-3d"></div>
                      <div class="card-brand">{{ getCardType(cardData.number) }}</div>
                    </div>
                    <div class="card-number-3d">{{ formatCardNumber(cardData.number) }}</div>
                    <div class="card-info-row">
                      <div>
                        <div class="card-info-label">Card Holder</div>
                        <div class="card-info-val">{{ cardData.name || 'YOUR NAME' }}</div>
                      </div>
                      <div>
                        <div class="card-info-label">Expires</div>
                        <div class="card-info-val">{{ cardData.expiry || 'MM/YY' }}</div>
                      </div>
                    </div>
                  </div>
                  <!-- Back -->
                  <div class="card-back">
                    <div class="card-magnetic-strip"></div>
                    <div class="card-signature-area">
                      <div style="font-size:0.75rem; color:#888; margin-right:10px; font-family:sans-serif; font-style:normal; letter-spacing:0;">CVV</div>
                      <div>{{ cardData.cvv || '•••' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="summary-card">
                <div class="summary-title">Order Summary</div>
                <div class="summary-row">
                  <span class="text-muted">CineVault {{ selectedPlan }} Plan</span>
                  <span>LKR {{ getOriginalPrice() | number:'1.2-2' }}</span>
                </div>
                <div class="summary-row" *ngIf="discountPercentage > 0" style="color:#e74c3c;">
                  <span>Promo Code Discount (\${{ appliedPromo }})</span>
                  <span>- LKR {{ getDiscountAmount() | number:'1.2-2' }}</span>
                </div>
                <div class="summary-row total">
                  <span>Total Due</span>
                  <span>LKR {{ getTotalPrice() | number:'1.2-2' }}</span>
                </div>
              </div>

              <button class="btn btn-primary w-full mt-2" (click)="submitForm()" [disabled]="loading">
                {{ loading ? 'Processing Activation...' : 'Pay & Activate Plan' }}
              </button>
            </div>
          </div>

          <!-- Basic / Free Plan layout -->
          <ng-template #basicLayout>
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
          </ng-template>

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
        
        <div class="flex gap-1 justify-center mt-4" style="flex-wrap:wrap;">
          <button class="btn btn-primary" routerLink="/movies">Start Watching Now</button>
          <button class="btn btn-outline" (click)="step = 1">View My Plan</button>
          <button class="btn btn-invoice" (click)="downloadInvoice()" *ngIf="selectedPlan !== 'FREE'">
            <span class="material-symbols-outlined" style="font-size:1.1rem;vertical-align:middle;">receipt_long</span>
            Download Invoice PDF
          </button>
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
    .form-section { max-width: 1050px; margin: 0 auto; }
    .checkout-card { max-width: none; width: 100%; padding: 3rem; background: rgba(234, 229, 208, 0.03); border: 1px solid rgba(234, 229, 208, 0.1); border-radius: 24px; }
    .grid-form { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
    .full-width { grid-column: span 2; }
    .back-btn { position: absolute; left: 0; top: 50%; transform: translateY(-50%); display: flex; align-items: center; gap: 0.5rem; background: none; border: none; color: var(--text-muted); cursor: pointer; transition: color 0.2s; }
    .back-btn:hover { color: var(--accent); }

    .login-prompt { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: var(--text-muted); }
    .login-prompt a { color: var(--accent); text-decoration: none; font-weight: 600; }

    .form-footer { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(234, 229, 208, 0.05); text-align: center; }
    .form-footer p { font-size: 0.875rem; color: var(--text-muted); margin-bottom: 1rem; }
    .direct-contact { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; background: #25D36622; color: #25D366; border-radius: 50px; font-weight: 600; font-size: 0.875rem; }

    /* Checkout Layout splitting */
    .checkout-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2rem; }
    
    /* 3D Virtual Card styles */
    .payment-preview { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
    
    .card-container-3d {
      width: 320px; height: 190px;
      perspective: 1000px;
      margin-bottom: 1rem;
    }
    
    .card-wrapper-3d {
      width: 100%; height: 100%;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .card-wrapper-3d.flipped {
      transform: rotateY(180deg);
    }
    
    .card-front, .card-back {
      position: absolute; width: 100%; height: 100%;
      backface-visibility: hidden;
      border-radius: 16px; padding: 1.5rem;
      display: flex; flex-direction: column; justify-content: space-between;
      box-shadow: 0 15px 35px rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.1);
    }
    
    .card-front {
      background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%);
      backdrop-filter: blur(20px);
      z-index: 2;
      transform: rotateY(0deg);
    }
    
    .card-back {
      background: linear-gradient(135deg, rgba(15,15,15,0.95) 0%, rgba(30,30,30,0.95) 100%);
      transform: rotateY(180deg);
      padding: 0;
      justify-content: flex-start;
      gap: 1.2rem;
    }
    
    .card-magnetic-strip {
      width: 100%; height: 40px;
      background: #111; margin-top: 1.25rem;
    }
    
    .card-signature-area {
      width: 80%; height: 35px;
      background: rgba(255,255,255,0.8);
      margin: 0 auto; border-radius: 4px;
      display: flex; align-items: center; justify-content: flex-end;
      padding-right: 10px; color: #111; font-weight: 600;
      font-style: italic; font-family: monospace; letter-spacing: 2px;
    }
    
    .card-chip-3d {
      width: 40px; height: 30px;
      background: linear-gradient(135deg, #f1c40f, #d35400);
      border-radius: 4px;
    }
    
    .card-number-3d {
      font-size: 1.25rem; letter-spacing: 3px;
      font-family: monospace; color: #eae5d0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      margin: 1.5rem 0 1rem 0;
    }
    
    .card-info-row {
      display: flex; justify-content: space-between; align-items: flex-end;
    }
    
    .card-info-label {
      font-size: 0.6rem; text-transform: uppercase;
      color: var(--text-dim); margin-bottom: 2px;
    }
    
    .card-info-val {
      font-size: 0.85rem; font-weight: 600;
      letter-spacing: 1px; color: #eae5d0;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      max-width: 160px;
    }
    
    .card-brand {
      font-weight: 800; font-style: italic;
      color: var(--accent); font-size: 1rem;
      letter-spacing: 1px;
    }
    
    /* Order Summary styles */
    .summary-card {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--border);
      border-radius: 16px; padding: 1.5rem;
      width: 100%; display: flex; flex-direction: column; gap: 1rem;
    }
    
    .summary-title {
      font-weight: 600; font-size: 1rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.5rem; margin-bottom: 0.25rem;
    }
    
    .summary-row {
      display: flex; justify-content: space-between; font-size: 0.9rem;
    }
    
    .summary-row.total {
      font-weight: 700; font-size: 1.1rem;
      border-top: 1px solid var(--border);
      padding-top: 0.75rem; margin-top: 0.25rem;
      color: var(--accent);
    }
    
    /* Card form grid */
    .card-details-section {
      border-top: 1px solid var(--border);
      padding-top: 1.5rem; margin-top: 1rem;
    }
    
    .grid-card-form {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
      margin-top: 1rem;
    }
    
    .col-span-2 { grid-column: span 2; }
    
    /* Promo code box */
    .promo-section {
      display: flex; gap: 0.5rem; margin-top: 0.5rem;
    }
    
    .promo-feedback {
      font-size: 0.78rem; font-weight: 500; margin-top: 0.25rem;
    }
    .promo-success { color: #2ecc71; }
    .promo-error { color: #e74c3c; }

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
    .btn-invoice { background: linear-gradient(135deg, #1e3a5f, #2563eb); color: #fff; border: none; display: inline-flex; align-items: center; gap: 0.5rem; }
    .btn-invoice:hover { filter: brightness(1.15); transform: scale(1.02); }
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

    /* Referral Card Styling */
    .referral-card {
      background: linear-gradient(135deg, rgba(249,115,22,0.06), rgba(124,58,237,0.08));
      border: 1px dashed rgba(249,115,22,0.3); border-radius: 20px;
      padding: 1.5rem; margin-top: 2rem; margin-bottom: 1.5rem;
    }
    .referral-inner {
      display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap;
    }
    .referral-icon { font-size: 2.2rem; color: var(--accent); }
    .referral-details { flex: 1; min-width: 250px; }
    .referral-details h3 { color: #eae5d0; font-size: 1.15rem; margin-bottom: 0.25rem; font-weight: 700; }
    .referral-details p { color: var(--text-muted); font-size: 0.88rem; margin: 0; line-height: 1.5; }
    .referral-action-box { display: flex; flex-direction: column; gap: 0.35rem; }
    .referral-label { font-size: 0.72rem; text-transform: uppercase; color: var(--text-muted); font-weight: 700; letter-spacing: 1px; }
    .referral-code-wrapper {
      display: flex; align-items: center; background: var(--surface-2);
      border: 1px solid var(--border); border-radius: 50px; padding: 0.25rem 0.25rem 0.25rem 1rem; gap: 1rem;
    }
    .referral-code { font-family: monospace; font-size: 0.95rem; font-weight: 700; color: var(--accent); letter-spacing: 0.5px; }
    .btn-copy { border-radius: 50px; display: inline-flex; align-items: center; gap: 0.25rem; padding: 0.4rem 1rem; }

    /* Mobile Optimizations */
    @media (max-width: 768px) {
      .membership-container { padding: 2.5rem 1rem; }
      h1 { font-size: 2.2rem; }
      .subtitle { font-size: 1rem; }
      .packages-grid { grid-template-columns: 1fr; gap: 1.5rem; padding: 0 0.5rem; }
      .package-card { padding: 1.8rem; border-radius: 20px; }
      .package-card.popular { transform: scale(1.01); margin: 0.5rem 0; }
      .checkout-card { padding: 1.5rem; border-radius: 20px; }
      .checkout-layout { grid-template-columns: 1fr; gap: 2.5rem; }
      .grid-form { grid-template-columns: 1fr; gap: 1.2rem; }
      .full-width { grid-column: span 1; }
      .back-btn { position: relative; left: 0; top: 0; transform: none; margin-bottom: 1.5rem; display: inline-flex; width: auto; }
      .vip-card { width: 100%; max-width: 320px; height: 180px; padding: 15px; margin: 0 auto; }
      .vip-chip { width: 40px; height: 30px; }
      .vip-level { font-size: 1.3rem; }
      .cancel-banner { padding: 1.2rem; text-align: center; }
      .cancel-banner-inner { justify-content: center; text-align: center; }
      .cancel-banner-inner button { width: 100%; margin-top: 0.5rem; }
    }
  `]
})
export class MembershipComponent {
  step = 1;
  selectedPlan: 'FREE' | 'PREMIUM' | 'ELITE' = 'FREE';
  loading = false;
  showCancelModal = false;

  // Referral states
  copied = false;
  get referralCode(): string {
    const user = this.currentUser;
    if (!user) return 'SIGN IN TO VIEW';
    return 'CV-' + user.username.toUpperCase().replace(/\s+/g, '') + '-' + user.id.substring(user.id.length - 4).toUpperCase();
  }

  copyReferralCode() {
    if (!this.currentUser) return;
    navigator.clipboard.writeText(this.referralCode);
    this.copied = true;
    setTimeout(() => this.copied = false, 2000);
  }

  formData = { name: '', phone: '', location: '', email: '', message: '' };

  // Card details state
  cardData = { number: '', expiry: '', cvv: '', name: '' };
  cardFlipped = false;

  // Promo code state
  promoCode = '';
  discountPercentage = 0;
  promoError = '';
  promoSuccess = '';
  appliedPromo = '';

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

  onCardNumberInput(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // numbers only
    if (input.length > 16) {
      input = input.substring(0, 16);
    }
    const parts = [];
    for (let i = 0; i < input.length; i += 4) {
      parts.push(input.substring(i, i + 4));
    }
    this.cardData.number = parts.join(' ');
  }

  onExpiryInput(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // numbers only
    if (input.length > 4) {
      input = input.substring(0, 4);
    }
    if (input.length > 2) {
      this.cardData.expiry = input.substring(0, 2) + '/' + input.substring(2);
    } else {
      this.cardData.expiry = input;
    }
  }

  formatCardNumber(val: string): string {
    return val || '•••• •••• •••• ••••';
  }

  getCardType(number: string): string {
    const cleanNum = number.replace(/\D/g, '');
    if (cleanNum.startsWith('4')) return 'VISA';
    if (cleanNum.startsWith('5')) return 'MASTERCARD';
    if (cleanNum.startsWith('3')) return 'AMEX';
    return 'CREDIT CARD';
  }

  applyPromo() {
    this.promoError = '';
    this.promoSuccess = '';
    const code = this.promoCode.trim().toUpperCase();
    if (!code) {
      this.promoError = 'Please enter a promo code.';
      return;
    }
    if (code === 'CINE50') {
      this.discountPercentage = 50;
      this.promoSuccess = 'Promo code CINE50 applied! 50% discount.';
      this.appliedPromo = 'CINE50';
    } else if (code === 'WELCOME20') {
      this.discountPercentage = 20;
      this.promoSuccess = 'Promo code WELCOME20 applied! 20% discount.';
      this.appliedPromo = 'WELCOME20';
    } else if (code.startsWith('CV-')) {
      this.discountPercentage = 30;
      this.promoSuccess = 'Referral code applied! 30% discount for both of you.';
      this.appliedPromo = code;
    } else {
      this.promoError = 'Invalid promo code.';
    }
  }

  getOriginalPrice(): number {
    if (this.selectedPlan === 'PREMIUM') return 2500;
    if (this.selectedPlan === 'ELITE') return 5800;
    return 0;
  }

  getDiscountAmount(): number {
    return (this.getOriginalPrice() * this.discountPercentage) / 100;
  }

  getTotalPrice(): number {
    return this.getOriginalPrice() - this.getDiscountAmount();
  }

  submitForm() {
    if (!this.formData.name || !this.formData.email) {
      alert('Please fill in the required fields.');
      return;
    }

    if (this.selectedPlan !== 'FREE') {
      const cardNum = this.cardData.number.replace(/\D/g, '');
      const cardExp = this.cardData.expiry.replace(/\D/g, '');
      const cardCvv = this.cardData.cvv.replace(/\D/g, '');
      if (cardNum.length < 16 || cardExp.length < 4 || cardCvv.length < 3 || !this.cardData.name) {
        alert('Please fill in valid credit/debit card details.');
        return;
      }
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
  loadHtml2Pdf(): Promise<any> {
    return new Promise((resolve) => {
      if ((window as any).html2pdf) {
        resolve((window as any).html2pdf);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => resolve((window as any).html2pdf);
      document.head.appendChild(script);
    });
  }

  downloadInvoice() {
    const invoiceNo = 'MEM-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const originalPrice = this.selectedPlan === 'PREMIUM' ? 2500 : 5800;
    const discountAmount = (originalPrice * this.discountPercentage) / 100;
    const finalPrice = originalPrice - discountAmount;
    const price = finalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const originalPriceFormatted = originalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const discountFormatted = discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const planLabel = this.selectedPlan === 'PREMIUM' ? 'CinePremium (Pro)' : 'CineElite (VIP)';
    const features = this.selectedPlan === 'PREMIUM'
      ? ['4K Ultra HD + HDR Streaming', 'Ad-Free Experience', '4 Simultaneous Devices', 'Full Movie &amp; Series Library', 'Offline Downloads']
      : ['Everything in CinePremium', 'Early Access to New Releases', 'Exclusive Director&#39;s Cuts', 'Priority Customer Support', 'Free Movie Rentals (included in plan)'];

    const featureRowsHtml = features.map(f => `
      <tr>
        <td style="padding:8px 14px; border-bottom:1px solid #f4f4f4; font-size:12px; color:#555; background:#fafafa;">
          <span style="color:#f97316;font-weight:800;margin-right:6px;">✓</span>${f}
        </td>
        <td style="padding:8px 14px; border-bottom:1px solid #f4f4f4; text-align:right; font-size:12px; color:#15803d; font-weight:600; background:#fafafa;">Included</td>
      </tr>`).join('');

    const promoRowHtml = this.appliedPromo ? `
      <tr>
        <td style="padding:10px 14px; border-bottom:1px solid #f4f4f4; font-size:12px; color:#dc2626; background:#fff9f9;">
          Promo Code: <strong>${this.appliedPromo}</strong> (${this.discountPercentage}% off)
        </td>
        <td style="padding:10px 14px; border-bottom:1px solid #f4f4f4; text-align:right; font-size:12px; color:#dc2626; font-weight:700; background:#fff9f9;">- LKR ${discountFormatted}</td>
      </tr>` : '';

    const html = `
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .iv { font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; color: #1a1a1a; width: 100%; }

  /* Header */
  .iv-header { background: #ffffff; padding: 24px 32px; display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; }
  .iv-logo-text { font-size: 26px; font-weight: 900; letter-spacing: -0.5px; color: #1a1a2e; }
  .iv-logo-text span { color: #e67e22; }
  .iv-logo-sub { font-size: 11px; color: #999; margin-top: 3px; letter-spacing: 0; font-weight: 400; }
  .iv-badge-wrap { text-align: right; }
  .iv-inv-label { font-size: 18px; font-weight: 700; color: #2563eb; letter-spacing: 0; margin-bottom: 4px; }
  .iv-inv-no { font-size: 12px; color: #555; letter-spacing: 0; }
  .iv-inv-date { font-size: 12px; color: #555; margin-top: 3px; letter-spacing: 0; }

  /* Body */
  .iv-body { padding: 24px 32px; }
  .iv-bill-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
  .iv-bill-section h4 { font-size: 10px; font-weight: 600; color: #999; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; }
  .iv-name { font-size: 15px; font-weight: 700; color: #1a1a2e; margin-bottom: 3px; }
  .iv-detail { font-size: 12px; color: #666; margin-top: 2px; }
  .iv-plan-pill { display: inline-block; background: linear-gradient(135deg, #1e3a5f, #2563eb); color: #fff; padding: 5px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 0; text-transform: uppercase; }
  .iv-plan-name { font-size: 12px; color: #666; margin-top: 6px; }
  .iv-active { display: inline-block; background: #dcfce7; color: #16a34a; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0; margin-top: 6px; }

  /* Table */
  .iv-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  .iv-table thead tr { background: #f8f9ff; }
  .iv-table thead th { padding: 10px 12px; font-size: 11px; font-weight: 600; color: #666; letter-spacing: 0; text-transform: uppercase; border-bottom: 2px solid #e0e0e0; text-align: left; }
  .iv-table thead th:last-child { text-align: right; }
  .iv-total-row td { padding: 14px 12px; background: #f0f7ff; font-weight: 700; font-size: 14px; border-top: 2px solid #2563eb; }
  .iv-total-row td:last-child { text-align: right; color: #2563eb; font-size: 18px; font-weight: 800; }

  /* Meta & Footer */
  .iv-meta { padding: 12px 32px; font-size: 12px; color: #666; }
  .iv-footer { padding: 20px 32px; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
  .iv-footer-note { font-size: 11px; color: #999; line-height: 1.7; }
  .iv-footer-brand { font-size: 12px; font-weight: 700; color: #2563eb; letter-spacing: 0; }
</style>
<div class="iv">
  <div class="iv-header">
    <div>
      <div class="iv-logo-text">Cine<span>Vault</span></div>
      <div class="iv-logo-sub">Premium Cinema Platform</div>
    </div>
    <div class="iv-badge-wrap">
      <div class="iv-inv-label">INVOICE</div>
      <div class="iv-inv-no"># ${invoiceNo}</div>
      <div class="iv-inv-date">${dateStr} at ${timeStr}</div>
    </div>
  </div>
  <div class="iv-body">
    <div class="iv-bill-row">
      <div class="iv-bill-section">
        <h4>Billed To</h4>
        <div class="iv-name">${this.formData.name || this.currentUser?.username || 'Member'}</div>
        <div class="iv-detail">${this.formData.email || this.currentUser?.email || ''}</div>
        ${this.formData.phone ? `<div class="iv-detail">${this.formData.phone}</div>` : ''}
        ${this.formData.location ? `<div class="iv-detail">${this.formData.location}</div>` : ''}
      </div>
      <div class="iv-bill-section" style="text-align:right;">
        <h4>Subscription Plan</h4>
        <div class="iv-plan-pill">${this.selectedPlan}</div>
        <div class="iv-plan-name">${planLabel}</div>
        <div class="iv-active">● ACTIVE</div>
      </div>
    </div>
    <table class="iv-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align:right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding:12px 14px; border-bottom:1px solid #ebebeb;">
            <strong style="font-size:14px;color:#1a1a1a;">${planLabel} – Monthly Subscription</strong>
            <div style="font-size:11px;color:#999;margin-top:3px;">Billing period: ${dateStr}</div>
          </td>
          <td style="padding:12px 14px; border-bottom:1px solid #ebebeb; text-align:right; font-size:14px; font-weight:700; color:#1a1a1a;">LKR ${originalPriceFormatted}</td>
        </tr>
        ${featureRowsHtml}
        ${promoRowHtml}
      </tbody>
      <tfoot>
        <tr class="iv-total-row">
          <td>Total Amount Paid</td>
          <td>LKR ${price}</td>
        </tr>
      </tfoot>
    </table>
  </div>
  <div class="iv-meta">
    Payment Method: Credit / Debit Card &nbsp;|&nbsp; Currency: LKR (Sri Lankan Rupee)
  </div>
  <div class="iv-footer">
    <div class="iv-footer-note">
      Thank you for subscribing to CineVault.<br>
      Support: support@cinevault.lk
    </div>
    <div class="iv-footer-brand">cinevault.lk</div>
  </div>
</div>`;

    this.loadHtml2Pdf().then((html2pdf) => {
      const wrapper = document.createElement('div');
      wrapper.style.position = 'absolute';
      wrapper.style.left = '0';
      wrapper.style.top = '0';
      wrapper.style.width = '100%';
      wrapper.style.height = '0';
      wrapper.style.overflow = 'visible';
      wrapper.style.zIndex = '-9999';
      wrapper.style.pointerEvents = 'none';

      const element = document.createElement('div');
      element.style.width = '700px';
      element.style.background = '#ffffff';
      element.style.color = '#111111';
      element.innerHTML = html;

      wrapper.appendChild(element);
      document.body.appendChild(wrapper);

      const opt = {
        margin:       0,
        filename:     `CineVault_Membership_Invoice_${invoiceNo}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      html2pdf().from(element).set(opt).save().then(() => {
        document.body.removeChild(wrapper);
      });
    });
  }
}


