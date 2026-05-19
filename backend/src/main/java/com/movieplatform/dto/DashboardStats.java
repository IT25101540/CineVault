// IT25101540 – Gunathilaka H.D.T.T. – Component 05: Admin Management
package com.movieplatform.dto;

/** DashboardStats – value object aggregating stats from all components. */
public class DashboardStats {
    private long totalUsers;
    private long totalMovies;
    private long activeRentals;
    private long flaggedReviews;

    public DashboardStats() {}

    public DashboardStats(long totalUsers, long totalMovies, long activeRentals, long flaggedReviews) {
        this.totalUsers = totalUsers;
        this.totalMovies = totalMovies;
        this.activeRentals = activeRentals;
        this.flaggedReviews = flaggedReviews;
    }

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalMovies() { return totalMovies; }
    public void setTotalMovies(long totalMovies) { this.totalMovies = totalMovies; }
    public long getActiveRentals() { return activeRentals; }
    public void setActiveRentals(long activeRentals) { this.activeRentals = activeRentals; }
    public long getFlaggedReviews() { return flaggedReviews; }
    public void setFlaggedReviews(long flaggedReviews) { this.flaggedReviews = flaggedReviews; }

    @Override public String toString() {
        return "DashboardStats{users=" + totalUsers + ", movies=" + totalMovies +
               ", rentals=" + activeRentals + ", flagged=" + flaggedReviews + "}";
    }
}
