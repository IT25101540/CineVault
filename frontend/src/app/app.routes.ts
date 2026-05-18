import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) },

  // About / Team Pages
  { path: 'team', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent) },
  { path: 'membership', loadComponent: () => import('./features/membership/membership.component').then(m => m.MembershipComponent) },

  // Movies
  { path: 'movies',          canActivate: [authGuard], loadComponent: () => import('./features/movies/movie-list.component').then(m => m.MovieListComponent) },
  { path: 'movies/add',      canActivate: [authGuard], loadComponent: () => import('./features/movies/movie-form.component').then(m => m.MovieFormComponent) },
  { path: 'movies/:id',      canActivate: [authGuard], loadComponent: () => import('./features/movies/movie-detail.component').then(m => m.MovieDetailComponent) },
  { path: 'movies/:id/edit', canActivate: [authGuard], loadComponent: () => import('./features/movies/movie-form.component').then(m => m.MovieFormComponent) },

  // Reviews
  { path: 'reviews/movie/:movieId', loadComponent: () => import('./features/reviews/review-list.component').then(m => m.ReviewListComponent) },
  { path: 'reviews/add/:movieId',   loadComponent: () => import('./features/reviews/review-form.component').then(m => m.ReviewFormComponent) },
  { path: 'reviews/my',             loadComponent: () => import('./features/reviews/my-reviews.component').then(m => m.MyReviewsComponent) },

  // Rentals
  { path: 'rentals/my',        loadComponent: () => import('./features/rentals/my-rentals.component').then(m => m.MyRentalsComponent) },
  { path: 'rentals/rent/:movieId', loadComponent: () => import('./features/rentals/rent-movie.component').then(m => m.RentMovieComponent) },
  { path: 'rentals/return/:id',    loadComponent: () => import('./features/rentals/return-movie.component').then(m => m.ReturnMovieComponent) },

  // Watchlist
  { path: 'watchlist', loadComponent: () => import('./features/watchlist/watchlist.component').then(m => m.WatchlistComponent) },

  // People
  { path: 'people',        canActivate: [authGuard], loadComponent: () => import('./features/people/people-list.component').then(m => m.PeopleListComponent) },
  { path: 'people/add',    canActivate: [authGuard], loadComponent: () => import('./features/people/person-form.component').then(m => m.PersonFormComponent) },
  { path: 'people/:id',    canActivate: [authGuard], loadComponent: () => import('./features/people/person-detail.component').then(m => m.PersonDetailComponent) },
  { path: 'people/:id/edit', canActivate: [authGuard], loadComponent: () => import('./features/people/person-form.component').then(m => m.PersonFormComponent) },

  // Auth
  { path: 'auth/login',    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'auth/register', loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent) },
  { path: 'profile/:id',   loadComponent: () => import('./features/auth/profile.component').then(m => m.ProfileComponent) },

  // Admin
  { path: 'admin/login',     loadComponent: () => import('./features/admin/admin-login.component').then(m => m.AdminLoginComponent) },
  { path: 'admin/dashboard', loadComponent: () => import('./features/admin/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'admin/users',     loadComponent: () => import('./features/admin/admin-users.component').then(m => m.AdminUsersComponent) },
  { path: 'admin/reviews',   loadComponent: () => import('./features/admin/admin-reviews.component').then(m => m.AdminReviewsComponent) },
  { path: 'admin/rentals',   loadComponent: () => import('./features/admin/admin-rentals.component').then(m => m.AdminRentalsComponent) },
  { path: 'admin/admins',    loadComponent: () => import('./features/admin/admin-panel.component').then(m => m.AdminPanelComponent) },

  { path: '**', redirectTo: '' }
];
