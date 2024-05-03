package io.github.purgz.repository;

import io.github.purgz.domain.Semester;
import io.github.purgz.domain.SemesterScore;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SemesterScore entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SemesterScoreRepository extends JpaRepository<SemesterScore, Long> {
    List<SemesterScore> getSemesterScoreBySemester(Semester semester);
}
