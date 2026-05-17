// SE1020 – CineVault Angular – Person Service
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Person } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PersonService {
  private url = `${environment.apiUrl}/people`;
  constructor(private http: HttpClient) {}
  getAll(search?: string, type?: string): Observable<Person[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (type)   params = params.set('type', type);
    return this.http.get<Person[]>(this.url, { params });
  }
  getById(id: string): Observable<Person> { return this.http.get<Person>(`${this.url}/${id}`); }
  getFilmography(id: string): Observable<any> { return this.http.get<any>(`${this.url}/${id}/filmography`); }
  create(person: Partial<Person>): Observable<Person> { return this.http.post<Person>(this.url, person); }
  update(id: string, person: Partial<Person>): Observable<Person> { return this.http.put<Person>(`${this.url}/${id}`, person); }
  delete(id: string): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
}
