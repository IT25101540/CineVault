// SE1020 – CineVault Angular – Review Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ReviewsResponse } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private url = `${environment.apiUrl}/reviews`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<Review[]> { return this.http.get<Review[]>(this.url); }
  getByMovie(movieId: string): Observable<ReviewsResponse> {
    return this.http.get<ReviewsResponse>(`${this.url}/movie/${movieId}`);
  }
  getByUser(userId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.url}/user/${userId}`);
  }
  submit(movieId: string, userId: string, starRating: number, commentText: string): Observable<Review> {
    return this.http.post<Review>(this.url, { movieId, userId, starRating, commentText });
  }
  update(id: string, starRating: number, commentText: string): Observable<Review> {
    return this.http.put<Review>(`${this.url}/${id}`, { starRating, commentText });
  }
  delete(id: string): Observable<any> { return this.http.delete(`${this.url}/${id}`); }
  hide(id: string): Observable<any> { return this.http.post(`${this.url}/${id}/hide`, {}); }
  unhide(id: string): Observable<any> { return this.http.post(`${this.url}/${id}/unhide`, {}); }
}
