package com.movieplatform.config;

import com.movieplatform.model.Admin;
import com.movieplatform.model.Person;
import com.movieplatform.model.StreamableMovie;
import com.movieplatform.repository.AdminRepository;
import com.movieplatform.repository.MovieRepository;
import com.movieplatform.repository.PersonRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DatabaseSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final MovieRepository movieRepository;
    private final PersonRepository personRepository;

    public DatabaseSeeder(AdminRepository adminRepository, MovieRepository movieRepository,
                          PersonRepository personRepository) {
        this.adminRepository = adminRepository;
        this.movieRepository = movieRepository;
        this.personRepository = personRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin Users for Group Members
        if (adminRepository.count() == 0) {
            // IT25101540 - Gunathilaka H.D.T.T. (Component 03) - password: 1540
            adminRepository.save(new Admin(null, "gunathilaka1540", "gunathilaka1540@cinevault.com", Integer.toHexString("1540".hashCode()), "SUPER_ADMIN", 5));
            // IT25102885 - Dhimantha W.L.T. (Component 01) - password: 2885
            adminRepository.save(new Admin(null, "dhimantha2885", "dhimantha2885@cinevault.com", Integer.toHexString("2885".hashCode()), "USER_ADMIN", 4));
            // IT25103586 - Navishika D.M.N.N. (Component 02) - password: 3586
            adminRepository.save(new Admin(null, "navishika3586", "navishika3586@cinevault.com", Integer.toHexString("3586".hashCode()), "MOVIE_ADMIN", 4));
            // IT25103608 - Herath H.M.H.S. (Component 04) - password: 3608
            adminRepository.save(new Admin(null, "herath3608", "herath3608@cinevault.com", Integer.toHexString("3608".hashCode()), "RENTAL_ADMIN", 4));
            // IT25101901 - Thanuluxshan K. (Component 03: Review & Rating) - password: 1901
            adminRepository.save(new Admin(null, "thanuluxshan1901", "thanuluxshan1901@cinevault.com", Integer.toHexString("1901".hashCode()), "REVIEW_ADMIN", 4));
            // IT25100813 - Luckshidhan K. (Component 06) - password: 0813
            adminRepository.save(new Admin(null, "luckshidhan0813", "luckshidhan0813@cinevault.com", Integer.toHexString("0813".hashCode()), "PERSON_ADMIN", 4));

            System.out.println("✅ Group Admin users seeded. Each password = last 4 digits of IT number.");
        }


        // Seed Movies
        if (movieRepository.count() == 0) {
            StreamableMovie movie1 = new StreamableMovie(
                    null, "Inception", "Sci-Fi", 2010,
                    "A thief who steals corporate secrets through the use of dream-sharing technology.",
                    "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
                    "tt1375666", "director_1",
                    "https://example.com/stream/inception", "4K", true
            );
            movie1.setAverageRating(4.8);

            StreamableMovie movie2 = new StreamableMovie(
                    null, "The Dark Knight", "Action", 2008,
                    "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham.",
                    "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
                    "tt0468569", "director_1",
                    "https://example.com/stream/dark-knight", "1080p", true
            );
            movie2.setAverageRating(4.9);

            StreamableMovie movie3 = new StreamableMovie(
                    null, "Interstellar", "Sci-Fi", 2014,
                    "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
                    "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
                    "tt0816692", "director_1",
                    "https://example.com/stream/interstellar", "4K", true
            );
            movie3.setAverageRating(4.7);

            movieRepository.save(movie1);
            movieRepository.save(movie2);
            movieRepository.save(movie3);
            System.out.println("✅ Movies seeded successfully.");
        }
    }
}


