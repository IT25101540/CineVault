package com.movieplatform.config;

import com.movieplatform.model.Admin;
import com.movieplatform.repository.AdminRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true")
public class DatabaseSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;

    public DatabaseSeeder(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
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
    }
}


