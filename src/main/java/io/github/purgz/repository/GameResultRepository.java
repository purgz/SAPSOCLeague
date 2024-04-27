package io.github.purgz.repository;

import io.github.purgz.domain.GameResult;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the GameResult entity.
 */
@SuppressWarnings("unused")
@Repository
public interface GameResultRepository extends JpaRepository<GameResult, Long> {}
