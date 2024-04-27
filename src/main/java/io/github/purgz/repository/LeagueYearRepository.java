package io.github.purgz.repository;

import io.github.purgz.domain.LeagueYear;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LeagueYear entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeagueYearRepository extends JpaRepository<LeagueYear, Long> {}
