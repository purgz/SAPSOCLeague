package io.github.purgz.domain;

import static org.assertj.core.api.Assertions.assertThat;

import io.github.purgz.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class GameResultTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(GameResult.class);
        GameResult gameResult1 = new GameResult();
        gameResult1.setId(1L);
        GameResult gameResult2 = new GameResult();
        gameResult2.setId(gameResult1.getId());
        assertThat(gameResult1).isEqualTo(gameResult2);
        gameResult2.setId(2L);
        assertThat(gameResult1).isNotEqualTo(gameResult2);
        gameResult1.setId(null);
        assertThat(gameResult1).isNotEqualTo(gameResult2);
    }
}
