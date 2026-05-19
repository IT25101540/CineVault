// SE1020 – CineVault Angular – Rental Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RentalService {
  private url = `${environment.apiUrl}/rentals`;
  constructor(private http: HttpClient) {}
  getAll(): Observable<Rental[]> { return this.http.get<Rental[]>(this.url); }
  getByUser(userId: string): Observable<Rental[]> { return this.http.get<Rental[]>(`${this.url}/user/${userId}`); }
  getById(id: string): Observable<Rental> { return this.http.get<Rental>(`${this.url}/${id}`); }
  rent(userId: string, movieId: string): Observable<Rental> {
    return this.http.post<Rental>(this.url, { userId, movieId });
  }
  returnMovie(id: string): Observable<Rental> { return this.http.put<Rental>(`${this.url}/${id}/return`, {}); }
  update(id: string, data: Partial<Rental>): Observable<Rental> { return this.http.put<Rental>(`${this.url}/${id}`, data); }
  delete(id: string): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
