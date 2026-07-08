import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReviewSummary {
  summary: string;
  sentiment: 'POSITIVE' | 'MIXED' | 'NEGATIVE';
  sentimentScore: number; // 0–100
  highlights: string[];
}

@Injectable({ providedIn: 'root' })
export class AiService {

  // Calls our Spring Boot backend
  private readonly API_URL = `${environment.apiUrl}/ai/summarize`;

  constructor(private http: HttpClient) {}

  /**
   * Send reviews to the backend proxy → AI Gateway → get structured summary.
   */
  summarizeReviews(reviews: { text: string; rating: number }[]): Observable<ReviewSummary> {
    return this.http.post<ReviewSummary>(this.API_URL, { reviews });
  }
}
