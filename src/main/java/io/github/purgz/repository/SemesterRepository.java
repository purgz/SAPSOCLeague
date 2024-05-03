package io.github.purgz.repository;

import io.github.purgz.domain.LeagueYear;
import io.github.purgz.domain.Semester;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Semester entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    List<Semester> findAllByYear(LeagueYear year);
}
