package io.github.purgz.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.purgz.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LeagueYearTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeagueYear.class);
        LeagueYear leagueYear1 = new LeagueYear();
        leagueYear1.setId(1L);
        LeagueYear leagueYear2 = new LeagueYear();
        leagueYear2.setId(leagueYear1.getId());
        assertThat(leagueYear1).isEqualTo(leagueYear2);
        leagueYear2.setId(2L);
        assertThat(leagueYear1).isNotEqualTo(leagueYear2);
        leagueYear1.setId(null);
        assertThat(leagueYear1).isNotEqualTo(leagueYear2);
    }
}
