package io.github.purgz.repository;

import io.github.purgz.domain.SemesterScore;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SemesterScore entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SemesterScoreRepository extends JpaRepository<SemesterScore, Long> {}
