package io.github.purgz.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.purgz.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LeaguePlayerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(LeaguePlayer.class);
        LeaguePlayer leaguePlayer1 = new LeaguePlayer();
        leaguePlayer1.setId(1L);
        LeaguePlayer leaguePlayer2 = new LeaguePlayer();
        leaguePlayer2.setId(leaguePlayer1.getId());
        assertThat(leaguePlayer1).isEqualTo(leaguePlayer2);
        leaguePlayer2.setId(2L);
        assertThat(leaguePlayer1).isNotEqualTo(leaguePlayer2);
        leaguePlayer1.setId(null);
        assertThat(leaguePlayer1).isNotEqualTo(leaguePlayer2);
    }
}
