package io.github.purgz.repository;

import io.github.purgz.domain.LeaguePlayer;
import io.github.purgz.domain.Semester;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the LeaguePlayer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LeaguePlayerRepository extends JpaRepository<LeaguePlayer, Long> {
    List<LeaguePlayer> findAllBySemester(Semester semester);
}
