package io.github.purgz.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.purgz.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SemesterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Semester.class);
        Semester semester1 = new Semester();
        semester1.setId(1L);
        Semester semester2 = new Semester();
        semester2.setId(semester1.getId());
        assertThat(semester1).isEqualTo(semester2);
        semester2.setId(2L);
        assertThat(semester1).isNotEqualTo(semester2);
        semester1.setId(null);
        assertThat(semester1).isNotEqualTo(semester2);
    }
}
