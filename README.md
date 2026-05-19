# 🎬 CineVault
### Premium Movie Review & Rental Platform
**SE1020 Object-Oriented Programming | SOA Architecture | SLIIT 2026**

---

[![Angular](https://img.shields.io/badge/Angular-17-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas/database)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.oracle.com/java/)

**CineVault** is a full-stack Movie Rental and Review Platform built with a **Service-Oriented Architecture (SOA)**. Users can browse movies, write reviews, rent movies online with membership-based pricing, and manage subscriptions. Administrators have a dedicated control panel for all entities.

---

## ✨ Key Features

- 🎭 **Movie Catalogue** — Browse, search and filter by genre with Netflix-style hero UI
- 📦 **Rental System** — Membership-based pricing (FREE/PREMIUM/ELITE); automated late-fee calculation
- ⭐ **Review System** — Star ratings + comments; verified renter badges; admin moderation
- 💎 **Membership Plans** — FREE → PREMIUM (LKR 2,500/mo) → ELITE (LKR 5,800/mo)
- 🧾 **Invoice PDF** — Auto-generated PDF on rental confirmation and membership activation
- 🛡️ **Admin Panel** — Full CRUD for movies, users, reviews, rentals, people, and admins
- 🎬 **People Management** — Director and cast profiles linked to movies

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────┐
│         Angular 17 Frontend          │
│   Standalone Components + RxJS       │
│         localhost:4200               │
└─────────────┬────────────────────────┘
              │  HTTP REST (JSON)
              │  CORS enabled
┌─────────────▼────────────────────────┐
│      Spring Boot 3.2 Backend         │
│  Controllers → Services → Repos      │
│         localhost:7000               │
└─────────────┬────────────────────────┘
              │  Spring Data MongoDB
┌─────────────▼────────────────────────┐
│       MongoDB Atlas (Cloud)          │
│   Database: cinevault                │
│   7 Collections                      │
└──────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Angular 17 (Standalone Components, RxJS) |
| **Styling** | Vanilla CSS (Glassmorphism, Bento UI, Material Symbols) |
| **Backend** | Spring Boot 3.2, Spring MVC, Jackson |
| **Database** | MongoDB Atlas (NoSQL Cloud) |
| **Server** | Embedded Apache Tomcat 10 (Port 7000) |
| **Build Tools** | Maven (Backend) & Angular CLI (Frontend) |
| **Version Control** | Git + GitHub (`main`, `theviya_dev`, `harini_dev`) |

---

## 👥 Group Members & Responsibilities

| IT Number | Name | Component |
| :--- | :--- | :--- |
| **IT25102885** | Dhimantha W.L.T. | **Component 01** – User Management: Auth, Roles, Profiles & Membership Billing |
| **IT25103586** | Navishika D.M.N.N. | **Component 02** – Movie Management: Catalogue, Search & Media Types |
| **IT25101901** | Thanuluxshan K. | **Component 03** – Review & Rating: Social System & Moderation |
| **IT25103608** | Herath H.M.H.S. | **Component 04** – Rental Management: Transactions, Logistics & Late Fees |
| **IT25101540** | Gunathilaka H.D.T.T. | **Component 05** – Admin Management: Dashboard, KPI Stats & Promo Codes |
| **IT25100813** | Luckshidhan K. | **Component 06** – Director & Cast: People Profiles & Filmography |

---

## 🧩 OOP Concepts Applied

### Inheritance — 10 Subclasses across 5 Hierarchies

```
User
 ├── RegularUser      canRent(), reviewLimit(), activeRentals
 └── Admin            role, permissionLevel, grantPermission(), canDelete()

Movie
 ├── StreamableMovie  streamingUrl, resolution, subtitlesAvailable
 └── PhysicalDisc     discType, copiesAvailable

RentalTransaction
 ├── DigitalRental    streamToken, watchDeadlineHours
 └── PhysicalRental   deliveryAddress, discType

Review
 ├── PublicReview          badge: "User Review"
 └── VerifiedRenterReview  badge: "✓ Verified Renter", rentVerified

Person
 ├── Director    awardsWon, signatureStyle
 └── CastMember  knownRole, agentContact (private)
```

### Encapsulation

| Field | Class | Protection |
| :--- | :--- | :--- |
| `-passwordHash` | `User` | Never in DTO; compared only internally |
| `-permissionLevel` | `Admin` | Changed only via `grantPermission(level)` |
| `-totalFee` | `RentalTransaction` | Computed via `markReturned()` internally |
| `-agentContact` | `CastMember` | Admin-only; excluded from public API |
| `-MAX_RENTALS` | `RegularUser` | Static constant; enforced via `canRent()` |

### Polymorphism — Method Overriding

| Method | Overridden In | Different Behaviour |
| :--- | :--- | :--- |
| `displayInfo()` | `StreamableMovie`, `PhysicalDisc` | Appends resolution / disc type |
| `calculateLateFee()` | `DigitalRental` (LKR 50/hr), `PhysicalRental` (LKR 150/day) | Different formulae |
| `renderBadge()` | `PublicReview`, `VerifiedRenterReview` | Different HTML badge output |
| `displayCredit()` | `Director` → "Directed by", `CastMember` → "Starring" | Different label |
| `authenticate()` | `RegularUser` | Adds `isActive()` check on top of base |

---

## 🔗 Class Relationships

### Inheritance (IS-A)

| Subclass | Superclass |
| :--- | :--- |
| `RegularUser`, `Admin` | `User` |
| `StreamableMovie`, `PhysicalDisc` | `Movie` |
| `DigitalRental`, `PhysicalRental` | `RentalTransaction` |
| `PublicReview`, `VerifiedRenterReview` | `Review` |
| `Director`, `CastMember` | `Person` |

### Associations (HAS-A)

| From | To | Multiplicity | Key |
| :--- | :--- | :--- | :--- |
| `RegularUser` | `RentalTransaction` | 1 → 0..* | `userId` in RentalTransaction |
| `RegularUser` | `Review` | 1 → 0..* | `userId` in Review |
| `Admin` | `AdminActivityLog` | 1 → 0..* | `adminId` in AdminActivityLog |
| `RentalTransaction` | `Movie` | 0..* → 1 | `movieId` in RentalTransaction |
| `RentalTransaction` | `PromoCode` | 0..* → 0..1 | `promoCode` (code string) |
| `Review` | `Movie` | 0..* → 1 | `movieId` in Review |
| `Movie` | `Person` (Director) | 0..* → 0..1 | `directorId` in Movie |
| `Movie` | `Person` (Actors) | 0..* → 0..* | `actorIds[]` in Movie |

---

## 📋 CRUD Operations

### Component 01 — User Management

| Operation | HTTP | Endpoint |
| :--- | :--- | :--- |
| Register (always FREE) | `POST` | `/api/users/register` |
| Login | `POST` | `/api/users/login` |
| Get all users | `GET` | `/api/users` |
| Get user by ID | `GET` | `/api/users/{id}` |
| Update / Membership upgrade | `PUT` | `/api/users/{id}` |
| Delete | `DELETE` | `/api/users/{id}` |

> **Membership Pricing:** FREE = LKR 500/rental · PREMIUM/ELITE = LKR 0.00 (free rentals)

---

### Component 02 — Movie Management

| Operation | HTTP | Endpoint |
| :--- | :--- | :--- |
| Add movie | `POST` | `/api/movies` |
| Get all movies | `GET` | `/api/movies` |
| Get movie by ID | `GET` | `/api/movies/{id}` |
| Search | `GET` | `/api/movies/search?q=` |
| Update | `PUT` | `/api/movies/{id}` |
| Delete | `DELETE` | `/api/movies/{id}` |

> **Types:** `StreamableMovie` (URL, resolution, subtitles) · `PhysicalDisc` (DVD/BLU_RAY, copies)

---

### Component 03 — Review & Rating Management

| Operation | HTTP | Endpoint |
| :--- | :--- | :--- |
| Post review | `POST` | `/api/reviews` |
| Get by movie | `GET` | `/api/reviews/movie/{movieId}` |
| Get by user | `GET` | `/api/reviews/user/{userId}` |
| Update | `PUT` | `/api/reviews/{id}` |
| Delete | `DELETE` | `/api/reviews/{id}` |
| Hide (admin) | `PATCH` | `/api/reviews/{id}/hide` |
| Approve (admin) | `PATCH` | `/api/reviews/{id}/approve` |

> **Encapsulation:** `starRating` setter validates 1–5 range; throws `IllegalArgumentException` on violation.

---

### Component 04 — Rental Management

| Operation | HTTP | Endpoint |
| :--- | :--- | :--- |
| Rent a movie | `POST` | `/api/rentals` |
| Get all rentals (admin) | `GET` | `/api/rentals` |
| Get user rentals | `GET` | `/api/rentals/user/{userId}` |
| Get rental by ID | `GET` | `/api/rentals/{id}` |
| Return rental | `PATCH` | `/api/rentals/{id}/return` |
| Delete rental | `DELETE` | `/api/rentals/{id}` |

> **Late Fees (Polymorphism):** `DigitalRental` = LKR 50 × overdue hours · `PhysicalRental` = LKR 150 × overdue days

---

### Component 05 — Admin Management

| Operation | HTTP | Endpoint |
| :--- | :--- | :--- |
| Admin login | `POST` | `/api/admins/login` |
| Create admin | `POST` | `/api/admins` |
| Get all admins | `GET` | `/api/admins` |
| Update admin | `PUT` | `/api/admins/{id}` |
| Deactivate | `PATCH` | `/api/admins/{id}/deactivate` |
| Delete | `DELETE` | `/api/admins/{id}` |

> **Security:** Regular user credentials rejected at admin login via MongoDB `$exists` query filter.

---

### Component 06 — Director & Cast Management

| Operation | HTTP | Endpoint |
| :--- | :--- | :--- |
| Add person | `POST` | `/api/people` |
| Get all people | `GET` | `/api/people` |
| Get by ID | `GET` | `/api/people/{id}` |
| Search | `GET` | `/api/people/search?q=` |
| Filter by type | `GET` | `/api/people/type/{creditType}` |
| Update | `PUT` | `/api/people/{id}` |
| Delete | `DELETE` | `/api/people/{id}` |

> **`creditType` values:** `DIRECTOR` · `ACTOR` · `BOTH`

---

## 🗄️ MongoDB Collections

| Collection | Stored Classes | Key Fields |
| :--- | :--- | :--- |
| `users` | `User`, `RegularUser`, `Admin` | `username`, `email`, `membershipType`, `role` |
| `movies` | `Movie`, `StreamableMovie`, `PhysicalDisc` | `title`, `genre`, `directorId`, `actorIds` |
| `reviews` | `Review`, `PublicReview`, `VerifiedRenterReview` | `movieId`, `userId`, `starRating`, `status` |
| `rentals` | `RentalTransaction`, `DigitalRental`, `PhysicalRental` | `userId`, `movieId`, `status`, `totalFee` |
| `people` | `Person`, `Director`, `CastMember` | `fullName`, `creditType`, `nationality` |
| `promocodes` | `PromoCode` | `code`, `discountPercentage`, `active` |
| `admin_logs` | `AdminActivityLog` | `adminId`, `action`, `timestamp` |

---

## 🚀 Getting Started

### Prerequisites
- **Java 21 LTS**
- **Node.js 18+**
- **Maven 3.9+** (or use IntelliJ's bundled Maven)
- **MongoDB Atlas** account

### 1. Backend

```bash
cd backend
# Update spring.data.mongodb.uri in src/main/resources/application.properties
mvn spring-boot:run
# API available at http://localhost:7000
```

### 2. Frontend

```bash
cd frontend
npm install
npm start
# App available at http://localhost:4200
```

---

## 📂 Project Structure

```
CineVault/
├── backend/
│   └── src/main/java/com/movieplatform/
│       ├── model/          # 20 Entity classes (6 hierarchies)
│       ├── dto/            # Data Transfer Objects
│       ├── repository/     # MongoDB repositories
│       ├── service/        # Business logic interfaces + impls
│       ├── controller/     # REST Controllers (7 modules)
│       └── config/         # CORS, DatabaseSeeder
├── frontend/
│   └── src/app/
│       ├── core/           # Models, Services, Guards
│       └── features/       # Angular page components
└── README.md
```

---

<p align="center">
  Developed for the 2nd Semester OOP Module at SLIIT &bull; 2026
</p>
