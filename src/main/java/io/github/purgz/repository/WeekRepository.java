package io.github.purgz.repository;

import io.github.purgz.domain.Week;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Week entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WeekRepository extends JpaRepository<Week, Long> {}
