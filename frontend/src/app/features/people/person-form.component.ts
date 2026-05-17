import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PersonService } from '../../core/services/person.service';
import { Person } from '../../core/models/models';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="container" style="padding-top:3rem;padding-bottom:4rem;">
      <div style="max-width:520px;">
        <div class="page-header">
          <p class="eyebrow">Admin</p>
          <h2>{{ isEdit ? 'Edit person' : 'Add director / cast member' }}</h2>
        </div>
        <div class="alert alert-error" *ngIf="error">{{ error }}</div>
        <div class="form-group">
          <label class="form-label">Full name</label>
          <input type="text" class="form-control" [(ngModel)]="form.fullName" required/>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
          <div class="form-group">
            <label class="form-label">Nationality</label>
            <input type="text" class="form-control" [(ngModel)]="form.nationality" placeholder="e.g. American"/>
          </div>
          <div class="form-group">
            <label class="form-label">Birth year</label>
            <input type="number" class="form-control" [(ngModel)]="form.birthYear" placeholder="1970"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Credit type</label>
          <select class="form-control" [(ngModel)]="form.creditType">
            <option value="DIRECTOR">Director</option>
            <option value="ACTOR">Actor / Cast</option>
            <option value="BOTH">Both</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Biography</label>
          <textarea class="form-control" [(ngModel)]="form.biography" placeholder="Brief bio…"></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">Photo URL</label>
          <input type="url" class="form-control" [(ngModel)]="form.photoUrl" placeholder="https://…"/>
        </div>
        <div style="display:flex;gap:.75rem;margin-top:.5rem;">
          <button class="btn btn-primary" (click)="submit()" [disabled]="saving">
            {{ saving ? 'Saving…' : (isEdit ? 'Save changes' : 'Add person') }}
          </button>
          <a routerLink="/people" class="btn btn-outline">Cancel</a>
        </div>
      </div>
    </div>
  `,
  styles: [`.eyebrow{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.1em;color:var(--accent);margin-bottom:.4rem;}`]
})
export class PersonFormComponent implements OnInit {
  form: Partial<Person> = { creditType: 'DIRECTOR' };
  isEdit = false;
  saving = false;
  error = '';
  private personId = '';

  constructor(private route: ActivatedRoute, private router: Router, private personService: PersonService) {}

  ngOnInit() {
    this.personId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.personId;
    if (this.isEdit) {
      this.personService.getById(this.personId).subscribe(p => { this.form = { ...p }; });
    }
  }

  submit() {
    if (!this.form.fullName) { this.error = 'Full name is required.'; return; }
    this.saving = true; this.error = '';
    const op = this.isEdit
      ? this.personService.update(this.personId, this.form)
      : this.personService.create(this.form);
    op.subscribe({
      next: p => this.router.navigate(['/people', p.id]),
      error: e => { this.error = e.error?.error || 'An error occurred.'; this.saving = false; }
    });
  }
}
