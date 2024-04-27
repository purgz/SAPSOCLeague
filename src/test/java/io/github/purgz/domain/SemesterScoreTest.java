package io.github.purgz.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.purgz.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SemesterScoreTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SemesterScore.class);
        SemesterScore semesterScore1 = new SemesterScore();
        semesterScore1.setId(1L);
        SemesterScore semesterScore2 = new SemesterScore();
        semesterScore2.setId(semesterScore1.getId());
        assertThat(semesterScore1).isEqualTo(semesterScore2);
        semesterScore2.setId(2L);
        assertThat(semesterScore1).isNotEqualTo(semesterScore2);
        semesterScore1.setId(null);
        assertThat(semesterScore1).isNotEqualTo(semesterScore2);
    }
}
