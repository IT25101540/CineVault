// SE1020 – CineVault Angular – Core Models
// Mirrors the Java DTOs from the Spring Boot REST API

export interface User {
  id: string;
  username: string;
  email: string;
  membershipType: 'FREE' | 'PREMIUM' | 'ELITE';
  active: boolean;
}

export interface Movie {
  id: string;
  title: string;
  genre: string;
  releaseYear: number;
  synopsis: string;
  posterUrl: string;
  trailerUrl?: string;
  averageRating: number;
  directorId: string;
  actorIds?: string[];
  available: boolean;
  type?: string;
}

export interface Review {
  id: string;
  movieId: string;
  movieTitle?: string;
  userId: string;
  username: string;
  userEmail?: string;
  starRating: number;
  commentText: string;
  createdAt: string;
  verified: boolean;
  hidden: boolean;
}

export interface ReviewsResponse {
  reviews: Review[];
  averageRating: number;
  count: number;
}

export interface Rental {
  id: string;
  userId: string;
  username?: string;
  userEmail?: string;
  movieId: string;
  movieTitle?: string;
  rentalDate: string;
  dueDate: string;
  returnedDate: string | null;
  status: 'ACTIVE' | 'RETURNED' | 'OVERDUE';
  totalFee: number;
  daysOverdue: number;
  paymentMethod?: string;
  promoCode?: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'MODERATOR' | 'USER_ADMIN' | 'MOVIE_ADMIN' | 'RENTAL_ADMIN' | 'REVIEW_ADMIN' | 'ADMIN_ADMIN' | 'PERSON_ADMIN';
  permissionLevel: number;
  active: boolean;
}

export interface Person {
  id: string;
  fullName: string;
  nationality: string;
  birthYear: number;
  biography: string;
  photoUrl: string;
  creditType: 'DIRECTOR' | 'ACTOR' | 'BOTH';
  active: boolean;
}

export interface DashboardStats {
  totalUsers: number;
  totalMovies: number;
  activeRentals: number;
  flaggedReviews: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
}
