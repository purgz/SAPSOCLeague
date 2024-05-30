package io.github.purgz.repository;

import io.github.purgz.domain.LeagueYear;
import io.github.purgz.domain.Semester;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Semester entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    Optional<Set<Semester>> findByYear(LeagueYear year);
}
