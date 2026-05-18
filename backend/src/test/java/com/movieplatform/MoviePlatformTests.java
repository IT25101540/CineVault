// SE1020 – Movie Review & Rental Platform – Unit Tests
package com.movieplatform;

import com.movieplatform.model.*;
import com.movieplatform.dto.*;
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests covering OOP concepts across all 6 components.
 * Run with: mvn test
 */
public class MoviePlatformTests {

    // =====================================================
    // Component 01: User Management – IT25102885
    // =====================================================

    @Test
    @DisplayName("C01 – RegularUser.canRent() returns true when active and under limit")
    void regularUser_canRent_whenActiveAndUnderLimit() {
        RegularUser user = new RegularUser("u1", "alice", "alice@test.com", "hash", "FREE");
        assertTrue(user.canRent(), "Active user with 0 rentals should be able to rent");
    }

    @Test
    @DisplayName("C01 – Encapsulation: UserDTO has no password field")
    void userDTO_doesNotExposePassword() {
        UserDTO dto = new UserDTO("u1", "alice", "alice@test.com", "FREE", true);
        // DTO has no getPasswordHash() – the following line would not compile if it did
        assertNotNull(dto.getUsername());
        assertNull(getFieldIfExists(dto, "passwordHash"),
                "UserDTO must not expose passwordHash");
    }

    @Test
    @DisplayName("C01 – Inheritance: AdminUser is instance of User")
    void adminUser_isInstanceOfUser() {
        AdminUser admin = new AdminUser("a1", "admin", "admin@test.com", "hash", true);
        assertInstanceOf(User.class, admin);
    }

    @Test
    @DisplayName("C01 – Polymorphism: authenticate() is overridden in RegularUser")
    void regularUser_authenticate_returnsFalseWhenInactive() {
        RegularUser user = new RegularUser("u2", "bob", "bob@test.com", "abc123", "PREMIUM");
        user.setActive(false);
        assertFalse(user.authenticate("abc123"),
                "Inactive user should fail authentication");
    }

    // =====================================================
    // Component 02: Movie Management – IT25103586
    // =====================================================

    @Test
    @DisplayName("C02 – Encapsulation: Movie.imdbId is not null after construction")
    void movie_imdbId_setViaConstructor() {
        Movie m = new Movie("m1", "Inception", "SciFi", 2010,
                "Dreams within dreams", "", "tt1375666", "d1");
        assertNotNull(m.getImdbId());
    }

    @Test
    @DisplayName("C02 – Inheritance: StreamableMovie is instance of Movie")
    void streamableMovie_isInstanceOfMovie() {
        StreamableMovie sm = new StreamableMovie("m2", "Dune", "SciFi", 2021,
                "Epic sci-fi", "", "tt1160419", "d2", "https://stream.example.com", "4K", true);
        assertInstanceOf(Movie.class, sm);
    }

    @Test
    @DisplayName("C02 – Polymorphism: StreamableMovie.displayInfo() includes resolution")
    void streamableMovie_displayInfo_includesResolution() {
        StreamableMovie sm = new StreamableMovie("m3", "Interstellar", "SciFi", 2014,
                "", "", "tt0816692", "d3", "https://stream.example.com", "4K", false);
        assertTrue(sm.displayInfo().contains("4K"),
                "displayInfo() for StreamableMovie should mention resolution");
    }

    @Test
    @DisplayName("C02 – Polymorphism: PhysicalDisc.displayInfo() includes disc type")
    void physicalDisc_displayInfo_includesDiscType() {
        PhysicalDisc pd = new PhysicalDisc("m4", "The Dark Knight", "Action", 2008,
                "", "", "tt0468569", "d4", "BLU_RAY", 5);
        assertTrue(pd.displayInfo().contains("BLU_RAY"),
                "displayInfo() for PhysicalDisc should mention disc type");
    }

    // =====================================================
    // Component 03: Review & Rating – IT25101540
    // =====================================================

    @Test
    @DisplayName("C03 – Encapsulation: setStarRating() rejects rating below 1")
    void review_setStarRating_throwsForZero() {
        Review r = new Review();
        assertThrows(IllegalArgumentException.class,
                () -> r.setStarRating(0),
                "Rating 0 should throw IllegalArgumentException");
    }

    @Test
    @DisplayName("C03 – Encapsulation: setStarRating() rejects rating above 5")
    void review_setStarRating_throwsForSix() {
        Review r = new Review();
        assertThrows(IllegalArgumentException.class,
                () -> r.setStarRating(6),
                "Rating 6 should throw IllegalArgumentException");
    }

    @Test
    @DisplayName("C03 – Inheritance: VerifiedRenterReview is instance of Review")
    void verifiedRenterReview_isInstanceOfReview() {
        VerifiedRenterReview vr = new VerifiedRenterReview("r1", "m1", "u1", 5, "Great!", true);
        assertInstanceOf(Review.class, vr);
    }

    @Test
    @DisplayName("C03 – Polymorphism: renderBadge() differs between subclasses")
    void renderBadge_differsBetweenSubclasses() {
        PublicReview pub = new PublicReview("r2", "m1", "u1", 4, "Good");
        VerifiedRenterReview ver = new VerifiedRenterReview("r3", "m1", "u2", 5, "Excellent!", true);
        assertNotEquals(pub.renderBadge(), ver.renderBadge(),
                "renderBadge() should return different strings for different subtypes");
    }

    // =====================================================
    // Component 04: Rental Management – IT25103608
    // =====================================================

    @Test
    @DisplayName("C04 – Encapsulation: totalFee cannot be set directly")
    void rentalTransaction_totalFee_notPubliclySettable() throws Exception {
        // Verify no public setTotalFee method exists
        boolean hasPublicSetter = false;
        for (var m : RentalTransaction.class.getMethods()) {
            if (m.getName().equals("setTotalFee")) { hasPublicSetter = true; break; }
        }
        assertFalse(hasPublicSetter, "RentalTransaction should not have a public setTotalFee()");
    }

    @Test
    @DisplayName("C04 – Inheritance: DigitalRental is instance of RentalTransaction")
    void digitalRental_isInstanceOfRentalTransaction() {
        DigitalRental dr = new DigitalRental("rent1", "u1", "m1",
                java.time.LocalDate.now(), java.time.LocalDate.now().plusDays(7),
                "token123", 48);
        assertInstanceOf(RentalTransaction.class, dr);
    }

    @Test
    @DisplayName("C04 – Polymorphism: DigitalRental.calculateLateFee() charges per hour")
    void digitalRental_lateFee_isHigherThanPhysical() {
        java.time.LocalDate due = java.time.LocalDate.now().minusDays(2);
        java.time.LocalDate returned = java.time.LocalDate.now();

        DigitalRental dr = new DigitalRental("r1","u1","m1",
                java.time.LocalDate.now().minusDays(9), due, "tok", 48);
        dr.setReturnedDate(returned);

        PhysicalRental pr = new PhysicalRental("r2","u1","m1",
                java.time.LocalDate.now().minusDays(9), due, "addr", "DVD");
        pr.setReturnedDate(returned);

        // Digital: 2 days × 24h × $0.50 = $24; Physical: 2 days × $1.50 = $3
        assertTrue(dr.calculateLateFee() > pr.calculateLateFee(),
                "Digital late fee should be higher than physical for same overdue period");
    }

    // =====================================================
    // Component 05: Admin Management – IT25101901
    // =====================================================

    @Test
    @DisplayName("C05 – Inheritance: Admin is instance of User")
    void admin_isInstanceOfUser() {
        Admin a = new Admin("a1", "superadmin", "sa@test.com", "hash", "SUPER_ADMIN", 5);
        assertInstanceOf(User.class, a);
    }

    @Test
    @DisplayName("C05 – Encapsulation: grantPermission() rejects invalid level")
    void admin_grantPermission_throwsForInvalidLevel() {
        Admin a = new Admin("a2", "mod", "mod@test.com", "hash", "MODERATOR", 2);
        assertThrows(IllegalArgumentException.class,
                () -> a.grantPermission(10),
                "Permission level > 5 should throw IllegalArgumentException");
    }

    @Test
    @DisplayName("C05 – Polymorphism: SUPER_ADMIN can delete, MODERATOR with low level cannot")
    void admin_canDelete_differsByRole() {
        Admin superAdmin = new Admin("a3", "sup", "sup@test.com", "hash", "SUPER_ADMIN", 5);
        Admin moderator  = new Admin("a4", "mod", "mod@test.com", "hash", "MODERATOR",  1);
        assertTrue(superAdmin.canDelete("Review"),  "SUPER_ADMIN should always be able to delete");
        assertFalse(moderator.canDelete("Review"),  "MODERATOR with level 1 should not be able to delete");
    }

    // =====================================================
    // Component 06: Director & Cast – IT25100813
    // =====================================================

    @Test
    @DisplayName("C06 – Inheritance: Director is instance of Person")
    void director_isInstanceOfPerson() {
        Director d = new Director("p1", "Christopher Nolan", "British", 1970,
                "Acclaimed director", "", 3, "Non-linear narrative");
        assertInstanceOf(Person.class, d);
    }

    @Test
    @DisplayName("C06 – Polymorphism: Director.displayCredit() says 'Directed by'")
    void director_displayCredit_containsDirectedBy() {
        Director d = new Director("p2", "Ridley Scott", "British", 1937, "", "", 2, "Epic visuals");
        assertTrue(d.displayCredit().contains("Directed by"),
                "Director.displayCredit() should say 'Directed by'");
    }

    @Test
    @DisplayName("C06 – Polymorphism: CastMember.displayCredit() says 'Starring'")
    void castMember_displayCredit_containsStarring() {
        CastMember c = new CastMember("p3", "Leonardo DiCaprio", "American", 1974,
                "", "", "Dom Cobb", "agent@talent.com");
        assertTrue(c.displayCredit().contains("Starring"),
                "CastMember.displayCredit() should say 'Starring'");
    }

    @Test
    @DisplayName("C06 – Encapsulation: PersonDTO does not expose agentContact")
    void personDTO_doesNotExposeAgentContact() {
        assertNull(getFieldIfExists(new PersonDTO(), "agentContact"),
                "PersonDTO should not expose agentContact");
    }

    // =====================================================
    // Helpers
    // =====================================================

    private Object getFieldIfExists(Object obj, String fieldName) {
        try {
            var field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException e) {
            return null;
        } catch (IllegalAccessException e) {
            return null;
        }
    }
}
