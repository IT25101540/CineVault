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
    <div class="container" style="padding-top:2.5rem;padding-bottom:4rem;">
      <div class="page-header" style="margin-bottom:2rem;">
        <p class="eyebrow" style="font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.5rem;">Activity</p>
        <h2>My rentals</h2>
      </div>
      
      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>

      <div class="table-wrap" *ngIf="!loading && rentals.length">
        <table>
          <thead>
            <tr><th>Movie</th><th>Rented</th><th>Due</th><th>Returned</th><th>Status</th><th>Fee</th><th>Action</th></tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of rentals">
              <td><a [routerLink]="['/movies', r.movieId]" class="text-accent" style="font-weight: 500;">{{ r.movieTitle || r.movieId }}</a></td>
              <td class="text-xs text-muted">{{ r.rentalDate | date:'dd MMM yyyy' }}</td>
              <td class="text-xs text-muted">{{ r.dueDate | date:'dd MMM yyyy' }}</td>
              <td class="text-xs text-muted">{{ r.returnedDate ? (r.returnedDate | date:'dd MMM yyyy') : '—' }}</td>
              <td>
                <span class="badge badge-green"  *ngIf="r.status === 'ACTIVE'">Active</span>
                <span class="badge badge-gray"   *ngIf="r.status === 'RETURNED'">Returned</span>
                <span class="badge badge-red"    *ngIf="r.status === 'OVERDUE'">Overdue</span>
              </td>
              <td class="text-sm font-semibold">{{ r.totalFee > 0 ? ('LKR ' + (r.totalFee | number:'1.2-2')) : '—' }}</td>
              <td>
                <div style="display:flex;gap:.5rem;align-items:center;">
                  <a *ngIf="r.status === 'ACTIVE'" [routerLink]="['/rentals/return', r.id]" class="btn btn-outline btn-sm">Return</a>
                  <button (click)="openInvoice(r)" class="btn btn-outline btn-sm" style="border-color:var(--accent);color:var(--accent);">Invoice</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="!loading && !rentals.length" class="text-muted" style="padding:3rem 0;text-align:center;">
        No rentals yet. <a routerLink="/movies" class="text-accent" style="text-decoration:none;font-weight:600;">Browse movies →</a>
      </p>

      <!-- Detailed Premium Invoice Modal -->
      <div class="modal-overlay" *ngIf="selectedRental" (click)="closeInvoice()">
        <div class="modal-box invoice-box" (click)="$event.stopPropagation()">
          <div id="invoice-print-area">
            <div class="invoice-header">
              <div class="brand">
                <span class="brand-vault">CINE</span><span class="brand-title">VAULT</span>
              </div>
              <div class="invoice-tag">
                <h3>INVOICE</h3>
                <p class="invoice-num">#{{ selectedRental.id.substring(0, 8).toUpperCase() }}</p>
              </div>
            </div>

            <div class="divider-dashed"></div>

            <div class="invoice-meta-grid">
              <div>
                <span class="meta-lbl">BILLED TO</span>
                <p class="meta-val font-semibold">{{ selectedRental.username || 'Valued Customer' }}</p>
                <p class="meta-email text-muted text-xs">{{ selectedRental.userEmail || 'customer@cinevault.com' }}</p>
              </div>
              <div style="text-align: right;">
                <span class="meta-lbl">INVOICE DATE</span>
                <p class="meta-val">{{ selectedRental.rentalDate | date:'dd MMM yyyy' }}</p>
                <span class="meta-lbl" style="margin-top: .5rem; display: block;">DUE DATE</span>
                <p class="meta-val">{{ selectedRental.dueDate | date:'dd MMM yyyy' }}</p>
              </div>
            </div>

            <div class="invoice-table-wrap">
              <table class="invoice-bill-table">
                <thead>
                  <tr>
                    <th>Item / Description</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <p class="font-semibold">{{ selectedRental.movieTitle || 'Movie Rental' }}</p>
                      <p class="text-xs text-muted">7-day CineVault stream license</p>
                    </td>
                    <td style="text-align: right;" class="font-semibold">LKR 500.00</td>
                  </tr>
                  <!-- Discount Row (if total fee is less than 500 due to promo code) -->
                  <tr *ngIf="selectedRental.totalFee < 500.0 && selectedRental.totalFee >= 0">
                    <td>
                      <p class="font-semibold text-green">Promo Discount</p>
                      <p class="text-xs text-muted" *ngIf="selectedRental.promoCode">Applied Code: {{ selectedRental.promoCode }}</p>
                    </td>
                    <td style="text-align: right; color:#2ecc71;" class="font-semibold">
                      -LKR {{ (500.0 - selectedRental.totalFee) | number:'1.2-2' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="divider-dashed"></div>

            <div class="invoice-summary">
              <div class="summary-line">
                <span class="text-muted">Payment Method:</span>
                <span class="font-semibold">{{ selectedRental.paymentMethod || 'Credit Card' }}</span>
              </div>
              <div class="summary-line total-line">
                <span class="total-lbl">Total Paid:</span>
                <span class="total-val">LKR {{ selectedRental.totalFee | number:'1.2-2' }}</span>
              </div>
            </div>

            <div class="invoice-footer">
              <p class="thank-you">Thank you for your rental!</p>
              <p class="support-text">For questions, contact support&#64;cinevault.com</p>
            </div>
          </div>

          <div style="display:flex;gap:.5rem;margin-top:1.5rem;width:100%;">
            <button class="btn btn-outline w-full" (click)="downloadPDF()">Download PDF</button>
            <button class="btn btn-primary w-full" (click)="closeInvoice()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }
    .invoice-box {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      width: 90%;
      max-width: 480px;
      padding: 2.5rem 2rem;
      box-shadow: 0 32px 80px rgba(0,0,0,0.6);
      animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand {
      font-size: 1.5rem;
      font-weight: 800;
      letter-spacing: 0.05em;
    }
    .brand-vault {
      color: #eae5d0;
    }
    .brand-title {
      color: var(--accent);
    }
    .invoice-tag h3 {
      font-size: 1rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--accent);
      margin: 0;
    }
    .invoice-num {
      font-size: 0.8rem;
      font-family: monospace;
      color: var(--text-muted);
      margin: 0.2rem 0 0 0;
    }
    .divider-dashed {
      border-top: 1px dashed var(--border);
      margin: 1.5rem 0;
    }
    .invoice-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .meta-lbl {
      display: block;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin-bottom: 0.3rem;
    }
    .meta-val {
      color: var(--text);
      margin: 0;
    }
    .meta-email {
      margin: 0.1rem 0 0 0;
    }
    .invoice-table-wrap {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    .invoice-bill-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .invoice-bill-table th {
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border);
    }
    .invoice-bill-table td {
      padding: 0.75rem 0 0 0;
      vertical-align: top;
    }
    .invoice-bill-table td p {
      margin: 0;
    }
    .text-green {
      color: #2ecc71;
    }
    .invoice-summary {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
    .summary-line {
      display: flex;
      justify-content: space-between;
    }
    .total-line {
      border-top: 1px solid var(--border);
      padding-top: 0.75rem;
      margin-top: 0.25rem;
    }
    .total-lbl {
      font-weight: 700;
      color: var(--text);
    }
    .total-val {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent);
    }
    .invoice-footer {
      text-align: center;
      font-size: 0.825rem;
    }
    .thank-you {
      font-weight: 600;
      color: var(--text);
      margin: 0 0 0.25rem 0;
    }
    .support-text {
      color: var(--text-muted);
      margin: 0;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class MyRentalsComponent implements OnInit {
  rentals: Rental[] = [];
  loading = true;
  selectedRental: Rental | null = null;

  constructor(private rentalService: RentalService, private userService: UserService) {}

  ngOnInit() {
    const uid = this.userService.currentUser?.id || 'usr-001';
    this.rentalService.getByUser(uid).subscribe({
      next: r => { this.rentals = r; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openInvoice(rental: Rental) {
    this.selectedRental = rental;
  }

  closeInvoice() {
    this.selectedRental = null;
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

  downloadPDF() {
    const rental = this.selectedRental;
    if (!rental) return;
    const printContent = document.getElementById("invoice-print-area");
    if (!printContent) return;

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
      element.style.padding = '40px';
      element.style.background = '#ffffff';
      element.style.color = '#111111';
      element.style.fontFamily = "'Outfit', 'Inter', sans-serif";
      
      element.innerHTML = `
        <style>
          .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
          .brand { font-size: 24px; font-weight: 800; letter-spacing: 0.05em; }
          .brand-vault { color: #111; }
          .brand-title { color: #e29b12; }
          .invoice-tag h3 { font-size: 18px; font-weight: 700; color: #e29b12; margin: 0; }
          .invoice-num { font-size: 12px; font-family: monospace; color: #666; margin: 3px 0 0 0; }
          .divider-dashed { border-top: 1px dashed #ccc; margin: 20px 0; }
          .invoice-meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px; margin-bottom: 20px; }
          .meta-lbl { display: block; font-size: 10px; font-weight: 600; color: #666; margin-bottom: 3px; letter-spacing: 0.08em; }
          .meta-val { margin: 0; font-weight: 600; }
          .meta-email { margin: 0; color: #666; font-size: 12px; }
          .invoice-table-wrap { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 15px; margin-bottom: 20px; }
          .invoice-bill-table { width: 100%; border-collapse: collapse; font-size: 14px; }
          .invoice-bill-table th { text-align: left; font-size: 11px; font-weight: 600; color: #666; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
          .invoice-bill-table td { padding: 10px 0 0 0; vertical-align: top; }
          .invoice-bill-table td p { margin: 0; }
          .font-semibold { font-weight: 600; }
          .text-xs { font-size: 12px; }
          .text-muted { color: #666; }
          .text-green { color: #27ae60; }
          .invoice-summary { display: flex; flex-direction: column; gap: 8px; font-size: 14px; margin-bottom: 20px; }
          .summary-line { display: flex; justify-content: space-between; }
          .total-line { border-top: 1px solid #ddd; padding-top: 10px; margin-top: 5px; }
          .total-lbl { font-weight: 700; }
          .total-val { font-size: 18px; font-weight: 700; color: #e29b12; }
          .invoice-footer { text-align: center; font-size: 13px; margin-top: 40px; }
          .thank-you { font-weight: 600; margin: 0 0 5px 0; }
          .support-text { color: #666; margin: 0; }
        </style>
        <div>
          ${printContent.innerHTML}
        </div>
      `;

      wrapper.appendChild(element);
      document.body.appendChild(wrapper);

      const opt = {
        margin:       10,
        filename:     `CineVault_Invoice_${rental.id.substring(0, 8).toUpperCase()}.pdf`,
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

