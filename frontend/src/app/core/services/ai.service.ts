import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ReviewSummary {
  summary: string;
  sentiment: 'POSITIVE' | 'MIXED' | 'NEGATIVE';
  sentimentScore: number; // 0–100
  highlights: string[];
}

@Injectable({ providedIn: 'root' })
export class AiService {

  // Calls our Spring Boot backend — no CORS issues
  private readonly API_URL = 'http://localhost:7000/api/ai/summarize';

  constructor(private http: HttpClient) {}

  /**
   * Send reviews to the backend proxy → AI Gateway → get structured summary.
   */
  summarizeReviews(reviews: { text: string; rating: number }[]): Observable<ReviewSummary> {
    return this.http.post<ReviewSummary>(this.API_URL, { reviews });
  }
}
