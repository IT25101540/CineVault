// SE1020 – CineVault Angular – Admin Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Admin, DashboardStats } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private url = `${environment.apiUrl}/admin`;
  private currentAdminSubject = new BehaviorSubject<Admin | null>(
    JSON.parse(localStorage.getItem('currentAdmin') || 'null')
  );
  currentAdmin$ = this.currentAdminSubject.asObservable();
  get currentAdmin(): Admin | null { return this.currentAdminSubject.value; }

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<Admin> {
    return this.http.post<Admin>(`${this.url}/login`, { username, password }).pipe(
      tap(admin => {
        localStorage.setItem('currentAdmin', JSON.stringify(admin));
        this.currentAdminSubject.next(admin);
      })
    );
  }
  logout(): void { localStorage.removeItem('currentAdmin'); this.currentAdminSubject.next(null); }
  getDashboard(): Observable<DashboardStats> { return this.http.get<DashboardStats>(`${this.url}/dashboard`); }
  getRevenueStats(): Observable<any> { return this.http.get<any>(`${this.url}/revenue`); }
  generatePromoCode(code: string, discountPercentage: number): Observable<any> {
    return this.http.post<any>(`${this.url}/promocodes`, { code, discountPercentage });
  }
  getAll(): Observable<Admin[]> { return this.http.get<Admin[]>(this.url); }
  getById(id: string): Observable<Admin> { return this.http.get<Admin>(`${this.url}/${id}`); }
  register(data: any): Observable<Admin> { return this.http.post<Admin>(`${this.url}/register`, data); }
  update(id: string, data: any): Observable<Admin> { return this.http.put<Admin>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
  deletePermanent(id: string): Observable<any> { return this.http.delete(`${this.url}/${id}/permanent`); }
  activate(id: string): Observable<any> { return this.http.post(`${this.url}/${id}/activate`, {}); }
}
