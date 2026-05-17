// SE1020 – CineVault Angular – Movie Service
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private url = `${environment.apiUrl}/movies`;

  constructor(private http: HttpClient) {}

  getAll(search?: string, genre?: string): Observable<Movie[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (genre)  params = params.set('genre', genre);
    return this.http.get<Movie[]>(this.url, { params });
  }

  getById(id: string): Observable<Movie> {
    return this.http.get<Movie>(`${this.url}/${id}`);
  }

  getByGenre(genre: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.url}/genre/${genre}`);
  }

  create(movie: Partial<Movie>): Observable<Movie> {
    return this.http.post<Movie>(this.url, movie);
  }

  update(id: string, movie: Partial<Movie>): Observable<Movie> {
    return this.http.put<Movie>(`${this.url}/${id}`, movie);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
