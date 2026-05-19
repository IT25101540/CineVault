// IT25101540 – Gunathilaka H.D.T.T. – Component 05: Admin Management
package com.movieplatform.repository;

import com.movieplatform.model.PromoCode;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PromoCodeRepository extends MongoRepository<PromoCode, String> {
    Optional<PromoCode> findByCode(String code);
}
