// SE1020 – CineVault Angular – User Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/users`;
  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null { return this.currentUserSubject.value; }

  register(username: string, email: string, password: string, membershipType: string): Observable<User> {
    return this.http.post<User>(`${this.url}/register`, { username, email, password, membershipType });
  }

  login(username: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.url}/login`, { username, password }).pipe(
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getAll(): Observable<User[]> { return this.http.get<User[]>(this.url); }
  getById(id: string): Observable<User> { return this.http.get<User>(`${this.url}/${id}`); }
  update(id: string, data: Partial<User> & { password?: string }): Observable<User> {
    return this.http.put<User>(`${this.url}/${id}`, data);
  }
  delete(id: string): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
