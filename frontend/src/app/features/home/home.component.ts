import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../core/services/movie.service';
import { ReviewService } from '../../core/services/review.service';
import { Movie, Review } from '../../core/models/models';

export interface GenreRow {
  title: string;
  movies: Movie[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="netflix-home">
      <!-- Netflix-style Hero for Featured Movie -->
      <section class="featured-hero" *ngIf="featuredMovie" [style.backgroundImage]="'url(' + featuredMovie.posterUrl + ')'">
        <div class="hero-vignette"></div>
        <div class="hero-content" [class.fading]="heroFading">
          <div class="hero-eyebrow">
            <span class="material-symbols-outlined" style="font-size: 1rem;">star</span> CineVault Original
          </div>
          <h1>{{ featuredMovie.title }}</h1>
          <div class="hero-meta">
            <span class="badge badge-gold">{{ featuredMovie.averageRating | number:'1.1-1' }} <span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">star</span></span>
            <span>{{ featuredMovie.releaseYear }}</span>
            <span>{{ featuredMovie.genre }}</span>
          </div>
          <p class="hero-synopsis">{{ featuredMovie.synopsis }}</p>
          <div class="hero-actions">
            <a [routerLink]="['/rentals/rent', featuredMovie.id]" class="btn btn-primary btn-lg" style="background: white; color: black; border-color: white; display: inline-flex; align-items: center; gap: 0.5rem;">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_arrow</span> Rent Now
            </a>
            <a [routerLink]="['/movies', featuredMovie.id]" class="btn btn-outline btn-lg" style="background: rgba(109, 109, 110, 0.7); color: white; border: none; display: inline-flex; align-items: center; gap: 0.5rem;">
              <span class="material-symbols-outlined">info</span> More Info
            </a>
          </div>
        </div>
      </section>

      <!-- Fallback Hero -->
      <section class="hero container" *ngIf="!featuredMovie && !loading">
        <h1>Cinema, <em class="text-gradient">rediscovered.</em></h1>
        <p>Browse thousands of titles, rent your favourites, and share your take with a community of film lovers.</p>
        <div class="hero-actions">
          <a routerLink="/movies" class="btn btn-primary btn-lg">Browse Movies</a>
        </div>
      </section>

      <div class="spinner-wrap" *ngIf="loading"><div class="spinner"></div></div>



      <div class="sliders-container" *ngIf="!loading && movies.length">
        
        <!-- Trending Slider -->
        <div class="movie-slider-section">
          <div class="slider-header">
            <h2 class="slider-title">Trending Now</h2>
            <a routerLink="/movies" class="slider-see-all">See All <span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">arrow_forward</span></a>
          </div>
          <div class="slider-wrapper">
            <button class="slider-btn left" (click)="scroll(trendingSlider, -1)"><span class="material-symbols-outlined">chevron_left</span></button>
            <div class="slider-row" #trendingSlider>
              <div class="slider-card" *ngFor="let movie of trendingMovies">
                <a [routerLink]="['/movies', movie.id]">
                  <img *ngIf="movie.posterUrl" [src]="movie.posterUrl" [alt]="movie.title" (error)="onImgError($event)"/>
                  <div *ngIf="!movie.posterUrl" class="card-img-placeholder">
                    <span class="material-symbols-outlined" style="font-size: 2rem; margin-bottom: 0.5rem;">movie</span><br/>{{movie.title}}
                  </div>
                </a>
              </div>
            </div>
            <button class="slider-btn right" (click)="scroll(trendingSlider, 1)"><span class="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>

        <!-- Dynamic Genre Sliders -->
        <div class="movie-slider-section" *ngFor="let row of genreRows; let i = index">
          <div class="slider-header">
            <h2 class="slider-title">{{ row.title }}</h2>
            <a routerLink="/movies" class="slider-see-all">See All <span class="material-symbols-outlined" style="font-size: 1rem; vertical-align: middle;">arrow_forward</span></a>
          </div>
          <div class="slider-wrapper">
            <button class="slider-btn left" (click)="scroll(genreSlider, -1)"><span class="material-symbols-outlined">chevron_left</span></button>
            <div class="slider-row" #genreSlider>
              <div class="slider-card" *ngFor="let movie of row.movies">
                <a [routerLink]="['/movies', movie.id]">
                  <img *ngIf="movie.posterUrl" [src]="movie.posterUrl" [alt]="movie.title" (error)="onImgError($event)"/>
                  <div *ngIf="!movie.posterUrl" class="card-img-placeholder">
                    <span class="material-symbols-outlined" style="font-size: 2rem; margin-bottom: 0.5rem;">movie</span><br/>{{movie.title}}
                  </div>
                </a>
              </div>
            </div>
            <button class="slider-btn right" (click)="scroll(genreSlider, 1)"><span class="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>

      </div>
      
      <!-- Testimonials Section -->
      <section class="testimonials-section container" *ngIf="!loading">
        <div class="section-header">
          <div class="section-eyebrow">
            <span class="material-symbols-outlined" style="font-size: 1rem;">format_quote</span> Testimonials
          </div>
          <h2 class="section-title">What People Say About Us</h2>
        </div>
        
        <div class="testimonial-grid" *ngIf="recentReviews.length">
          <div class="card testimonial-card" *ngFor="let review of recentReviews">
            <span class="material-symbols-outlined quote-icon">format_quote</span>
            <p class="testimonial-text">"{{ review.commentText }}"</p>
            <div class="stars">
              <span class="material-symbols-outlined" *ngFor="let _ of starsArray(review.starRating)">star</span>
            </div>
            <div class="reviewer-info">
              <span class="material-symbols-outlined avatar-icon">account_circle</span>
              <div>
                <h4>{{ review.username || review.userId }}</h4>
                <p class="role">
                  Reviewed <strong>{{ review.movieTitle || 'a movie' }}</strong>
                  <br/>
                  CineVault User 
                  <span *ngIf="review.verified" style="margin-left: 0.2rem; color: var(--success); font-size: 0.75rem;">
                    <span class="material-symbols-outlined" style="font-size:inherit; vertical-align:text-bottom;">check_circle</span> Verified
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div *ngIf="!recentReviews.length" class="text-center text-muted" style="margin-bottom: 2rem;">
          <p>No reviews yet. Be the first to share your thoughts!</p>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .netflix-home { background: var(--bg); min-height: 100vh; padding-bottom: 5rem; }

    /* ── Hero ── */
    .featured-hero {
      position: relative; height: 85vh; min-height: 520px;
      background-size: cover; background-position: center 20%;
      display: flex; align-items: flex-end;
      padding: 0 4rem 5rem; margin-bottom: 3rem;
      transition: background-image 1.2s ease-in-out;
    }
    .hero-vignette {
      position: absolute; inset: 0;
      background:
        linear-gradient(to right,  rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.2) 65%, transparent 100%),
        linear-gradient(to top,    rgba(8,8,8,1.0) 0%, rgba(8,8,8,0.0) 35%),
        linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, transparent 30%);
    }
    .hero-content {
      position: relative; z-index: 2; max-width: 620px;
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .hero-content.fading { opacity: 0; transform: translateY(10px); }
    .hero-eyebrow {
      display: inline-flex; align-items: center; gap: 0.5rem;
      padding: 0.4rem 1rem; border-radius: 999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.8rem; font-weight: 500;
      color: var(--text-muted); margin-bottom: 1.5rem;
    }
    .hero-content h1 {
      font-size: clamp(2.5rem, 5.5vw, 4.5rem); line-height: 1.05;
      margin-bottom: 1rem; color: var(--text);
      text-shadow: 0 2px 30px rgba(0,0,0,0.5);
    }
    .hero-meta {
      display: flex; gap: 1rem; align-items: center;
      margin-bottom: 1.25rem; font-size: 0.9rem; font-weight: 500;
      color: rgba(234,229,208,0.8);
    }
    .hero-synopsis {
      font-size: 1rem; line-height: 1.6; margin-bottom: 2rem;
      color: rgba(234,229,208,0.75); max-width: 500px;
    }
    .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
    .hero-actions .btn { font-weight: 700; border-radius: 10px; padding: 0.75rem 2rem; }

    /* Fallback hero */
    .hero { padding: 6rem 0 4rem; text-align: center; }



    /* ── Sliders ── */
    .sliders-container { padding: 0 2rem; }
    .movie-slider-section { margin-bottom: 3.5rem; }
    .slider-header { display: flex; align-items: center; justify-content: space-between; padding: 0 2rem 0.75rem; }
    .slider-title {
      font-size: clamp(1rem, 1.5vw, 1.3rem); font-weight: 700;
      color: var(--text); letter-spacing: -0.01em;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .slider-title::before {
      content: ''; display: inline-block; width: 3px; height: 1.1em;
      background: var(--accent);
      border-radius: 2px;
    }
    .slider-see-all {
      font-size: 0.78rem; color: var(--text-muted); font-weight: 500;
      cursor: pointer; transition: color 0.2s; text-decoration: none;
    }
    .slider-see-all:hover { color: var(--accent); }

    .slider-wrapper { position: relative; }
    .slider-row {
      display: flex; overflow-x: auto; gap: 0.6rem;
      padding: 0.5rem 2rem 1rem; scrollbar-width: none; scroll-behavior: smooth;
    }
    .slider-row::-webkit-scrollbar { display: none; }

    .slider-btn {
      position: absolute; top: 0; bottom: 0; z-index: 10; width: 50px;
      background: linear-gradient(to right, rgba(8,8,8,0.95), transparent);
      border: none; color: var(--text); cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s;
    }
    .slider-btn.right { right: 0; background: linear-gradient(to left, rgba(8,8,8,0.95), transparent); }
    .slider-wrapper:hover .slider-btn { opacity: 1; }
    .slider-btn:hover { color: var(--accent); }
    .slider-btn .material-symbols-outlined { font-size: 2rem; }

    .slider-card {
      flex: 0 0 calc(100% / 6 - 0.6rem);
      border-radius: 12px; overflow: hidden; cursor: pointer;
      aspect-ratio: 2/3; position: relative; overflow: hidden;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
      border: 1px solid rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(8px);
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 10px rgba(0,0,0,0.3);
      transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s ease, border-color 0.4s ease;
    }
    .slider-card:hover {
      transform: scale(1.04) translateY(-4px); z-index: 2; border-color: rgba(249,115,22,0.2);
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 20px 40px rgba(0,0,0,0.6), var(--glow-orange);
    }
    .slider-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1); }
    .slider-card:hover img { transform: scale(1.1); }
    .card-img-placeholder {
      width: 100%; height: 100%; background: var(--surface-2);
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; text-align: center;
      font-size: 0.8rem; padding: 1rem; color: var(--text-muted);
      gap: 0.5rem;
    }

    /* ── Testimonials ── */
    .testimonials-section { margin-top: 5rem; padding-bottom: 2rem; }
    .section-header { text-align: left; margin-bottom: 3rem; }
    .section-title { font-family: var(--font-display); font-size: clamp(2.5rem, 5vw, 4rem); font-weight: 500; color: var(--text); font-weight: 500; letter-spacing: -0.04em; line-height: 1.05; text-transform: lowercase; }

    .testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px,1fr)); gap: 1.5rem; }
    .testimonial-card {
      padding: 2rem; display: flex; flex-direction: column; height: 100%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-lg);
      transition: all 0.3s; position: relative; overflow: hidden;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 20px rgba(0,0,0,0.3);
    }
    .testimonial-card:hover { transform: translateY(-4px); border-color: rgba(249,115,22,0.2); box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.15), 0 10px 40px rgba(0,0,0,0.5), var(--glow-orange); }
    .quote-icon { font-size: 3rem; color: rgba(255,255,255,0.05); margin-bottom: 1rem; }
    .testimonial-text { flex-grow: 1; font-family: var(--font-display); font-style: italic; font-size: 1.15rem; line-height: 1.65; color: var(--text-muted); margin-bottom: 1.5rem; font-weight: 400; text-transform: lowercase; }
    .stars { color: var(--accent); margin-bottom: 1.5rem; display: flex; gap: 0.2rem; }
    .stars .material-symbols-outlined { font-size: 1.1rem; font-variation-settings: 'FILL' 1; }
    .reviewer-info { display: flex; align-items: center; gap: 1rem; border-top: 1px solid var(--border); padding-top: 1.5rem; }
    .avatar-icon { font-size: 2.5rem; color: var(--text-muted); }
    .reviewer-info h4 { font-family: var(--font-display); font-size: 1.1rem; font-weight: 500; letter-spacing: -0.02em; color: var(--text); text-transform: lowercase; }
    .role { font-size: 0.78rem; color: var(--text-muted); margin: 0; }

    @media (max-width: 1024px) { .slider-card { flex: 0 0 calc(100% / 4 - 0.6rem); } }
    @media (max-width: 768px) {
      .featured-hero { padding: 0 1.25rem 3rem; height: 70vh; min-height: 420px; }
      .hero-content { max-width: 100%; }
      .hero-synopsis { display: none; }
      .hero-actions .btn { padding: 0.65rem 1.4rem; font-size: 0.9rem; }
      .slider-card { flex: 0 0 calc(100% / 3 - 0.6rem); }
      .sliders-container { padding: 0 0.75rem; }
      .slider-header { padding: 0 0.75rem 0.75rem; }
      .slider-row { padding: 0.5rem 0.75rem 1rem; }
      /* Show slider buttons on touch devices */
      .slider-btn { opacity: 0.7; width: 36px; }
      .testimonial-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .featured-hero { height: 60vh; min-height: 360px; padding: 0 1rem 2.5rem; }
      .hero-eyebrow { display: none; }
      .hero-content h1 { font-size: clamp(1.8rem, 7vw, 2.5rem); }
      .slider-card { flex: 0 0 calc(100% / 2 - 0.6rem); }
      .section-title { font-size: clamp(1.75rem, 7vw, 2.5rem); }
      .testimonial-text { font-size: 1rem; }
      .testimonials-section { margin-top: 2.5rem; }
    }

  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  movies: Movie[] = [];
  recentReviews: Review[] = [];
  featuredMovie: Movie | null = null;
  trendingMovies: Movie[] = [];
  genreRows: GenreRow[] = [];
  
  loading = true;
  heroInterval: any;
  currentHeroIndex = 0;
  heroFading = false;

  constructor(private movieService: MovieService, private reviewService: ReviewService) {}
  
  ngOnInit() {
    this.reviewService.getAll().subscribe({
      next: r => {
        // Filter out hidden reviews, sort by date (descending), and take top 3
        this.recentReviews = r
          .filter(review => !review.hidden && review.commentText && review.commentText.trim().length > 0)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);
      }
    });

    this.movieService.getAll().subscribe({
      next: m => { 
        this.movies = m; 
        
        if (m.length > 0) {
          // Sort by rating for trending
          this.trendingMovies = [...m].sort((a,b) => b.averageRating - a.averageRating);
          
          // Set initial featured movie
          this.featuredMovie = this.trendingMovies[0];
          
          // Start automatic slideshow for top 5 movies
          const maxHeroMovies = Math.min(5, this.trendingMovies.length);
          if (maxHeroMovies > 1) {
            this.heroInterval = setInterval(() => {
              this.heroFading = true; // Start fade out
              setTimeout(() => {
                this.currentHeroIndex = (this.currentHeroIndex + 1) % maxHeroMovies;
                this.featuredMovie = this.trendingMovies[this.currentHeroIndex];
                this.heroFading = false; // Fade back in
              }, 400); // Wait 400ms for text to fade out before switching content
            }, 20000); // Change every 20 seconds
          }
          
          // Dynamically group by genres
          const genresMap = new Map<string, Movie[]>();
          m.forEach(movie => {
            if (!movie.genre) return;
            const g = movie.genre.trim();
            if (!genresMap.has(g)) genresMap.set(g, []);
            genresMap.get(g)!.push(movie);
          });
          
          // Convert map to array of GenreRows
          this.genreRows = Array.from(genresMap.entries())
            .map(([genre, movies]) => ({
               title: genre + ' Movies',
               movies: movies
            }))
            .sort((a,b) => b.movies.length - a.movies.length); // Most populated genres first
        }
        
        this.loading = false; 
      },
      error: () => { this.loading = false; }
    });
  }

  ngOnDestroy() {
    if (this.heroInterval) {
      clearInterval(this.heroInterval);
    }
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).style.display = 'none';
  }

  scroll(element: HTMLElement, direction: number) {
    // Scroll by roughly 80% of the visible width
    const scrollAmount = element.clientWidth * 0.8 * direction;
    element.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  starsArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
}
