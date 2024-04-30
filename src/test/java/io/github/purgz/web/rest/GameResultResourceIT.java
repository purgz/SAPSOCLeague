package io.github.purgz.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.purgz.IntegrationTest;
import io.github.purgz.domain.GameResult;
import io.github.purgz.domain.enumeration.GameEnding;
import io.github.purgz.repository.GameResultRepository;
import io.github.purgz.security.AuthoritiesConstants;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link GameResultResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser(authorities = AuthoritiesConstants.ADMIN)
class GameResultResourceIT {

    private static final GameEnding DEFAULT_GAME_ENDING = GameEnding.DISH;
    private static final GameEnding UPDATED_GAME_ENDING = GameEnding.REVERSE_DISH;

    private static final Float DEFAULT_P_1_SCORE = 0F;
    private static final Float UPDATED_P_1_SCORE = 1F;

    private static final Float DEFAULT_P_2_SCORE = 0F;
    private static final Float UPDATED_P_2_SCORE = 1F;

    private static final String ENTITY_API_URL = "/api/game-results";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private GameResultRepository gameResultRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restGameResultMockMvc;

    private GameResult gameResult;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GameResult createEntity(EntityManager em) {
        GameResult gameResult = new GameResult().gameEnding(DEFAULT_GAME_ENDING).p1Score(DEFAULT_P_1_SCORE).p2Score(DEFAULT_P_2_SCORE);
        return gameResult;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static GameResult createUpdatedEntity(EntityManager em) {
        GameResult gameResult = new GameResult().gameEnding(UPDATED_GAME_ENDING).p1Score(UPDATED_P_1_SCORE).p2Score(UPDATED_P_2_SCORE);
        return gameResult;
    }

    @BeforeEach
    public void initTest() {
        gameResult = createEntity(em);
    }

    @Test
    @Transactional
    void createGameResult() throws Exception {
        int databaseSizeBeforeCreate = gameResultRepository.findAll().size();
        // Create the GameResult
        restGameResultMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameResult)))
            .andExpect(status().isCreated());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeCreate + 1);
        GameResult testGameResult = gameResultList.get(gameResultList.size() - 1);
        assertThat(testGameResult.getGameEnding()).isEqualTo(DEFAULT_GAME_ENDING);
        assertThat(testGameResult.getp1Score()).isEqualTo(DEFAULT_P_1_SCORE);
        assertThat(testGameResult.getp2Score()).isEqualTo(DEFAULT_P_2_SCORE);
    }

    @Test
    @Transactional
    void createGameResultWithExistingId() throws Exception {
        // Create the GameResult with an existing ID
        gameResult.setId(1L);

        int databaseSizeBeforeCreate = gameResultRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restGameResultMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameResult)))
            .andExpect(status().isBadRequest());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllGameResults() throws Exception {
        // Initialize the database
        gameResultRepository.saveAndFlush(gameResult);

        // Get all the gameResultList
        restGameResultMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(gameResult.getId().intValue())))
            .andExpect(jsonPath("$.[*].gameEnding").value(hasItem(DEFAULT_GAME_ENDING.toString())))
            .andExpect(jsonPath("$.[*].p1Score").value(hasItem(DEFAULT_P_1_SCORE.doubleValue())))
            .andExpect(jsonPath("$.[*].p2Score").value(hasItem(DEFAULT_P_2_SCORE.doubleValue())));
    }

    @Test
    @Transactional
    void getGameResult() throws Exception {
        // Initialize the database
        gameResultRepository.saveAndFlush(gameResult);

        // Get the gameResult
        restGameResultMockMvc
            .perform(get(ENTITY_API_URL_ID, gameResult.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(gameResult.getId().intValue()))
            .andExpect(jsonPath("$.gameEnding").value(DEFAULT_GAME_ENDING.toString()))
            .andExpect(jsonPath("$.p1Score").value(DEFAULT_P_1_SCORE.doubleValue()))
            .andExpect(jsonPath("$.p2Score").value(DEFAULT_P_2_SCORE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingGameResult() throws Exception {
        // Get the gameResult
        restGameResultMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingGameResult() throws Exception {
        // Initialize the database
        gameResultRepository.saveAndFlush(gameResult);

        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();

        // Update the gameResult
        GameResult updatedGameResult = gameResultRepository.findById(gameResult.getId()).get();
        // Disconnect from session so that the updates on updatedGameResult are not directly saved in db
        em.detach(updatedGameResult);
        updatedGameResult.gameEnding(UPDATED_GAME_ENDING).p1Score(UPDATED_P_1_SCORE).p2Score(UPDATED_P_2_SCORE);

        restGameResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedGameResult.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedGameResult))
            )
            .andExpect(status().isOk());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
        GameResult testGameResult = gameResultList.get(gameResultList.size() - 1);
        assertThat(testGameResult.getGameEnding()).isEqualTo(UPDATED_GAME_ENDING);
        assertThat(testGameResult.getp1Score()).isEqualTo(UPDATED_P_1_SCORE);
        assertThat(testGameResult.getp2Score()).isEqualTo(UPDATED_P_2_SCORE);
    }

    @Test
    @Transactional
    void putNonExistingGameResult() throws Exception {
        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();
        gameResult.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGameResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, gameResult.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gameResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchGameResult() throws Exception {
        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();
        gameResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameResultMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(gameResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamGameResult() throws Exception {
        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();
        gameResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameResultMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(gameResult)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateGameResultWithPatch() throws Exception {
        // Initialize the database
        gameResultRepository.saveAndFlush(gameResult);

        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();

        // Update the gameResult using partial update
        GameResult partialUpdatedGameResult = new GameResult();
        partialUpdatedGameResult.setId(gameResult.getId());

        partialUpdatedGameResult.gameEnding(UPDATED_GAME_ENDING).p1Score(UPDATED_P_1_SCORE);

        restGameResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGameResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGameResult))
            )
            .andExpect(status().isOk());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
        GameResult testGameResult = gameResultList.get(gameResultList.size() - 1);
        assertThat(testGameResult.getGameEnding()).isEqualTo(UPDATED_GAME_ENDING);
        assertThat(testGameResult.getp1Score()).isEqualTo(UPDATED_P_1_SCORE);
        assertThat(testGameResult.getp2Score()).isEqualTo(DEFAULT_P_2_SCORE);
    }

    @Test
    @Transactional
    void fullUpdateGameResultWithPatch() throws Exception {
        // Initialize the database
        gameResultRepository.saveAndFlush(gameResult);

        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();

        // Update the gameResult using partial update
        GameResult partialUpdatedGameResult = new GameResult();
        partialUpdatedGameResult.setId(gameResult.getId());

        partialUpdatedGameResult.gameEnding(UPDATED_GAME_ENDING).p1Score(UPDATED_P_1_SCORE).p2Score(UPDATED_P_2_SCORE);

        restGameResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedGameResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedGameResult))
            )
            .andExpect(status().isOk());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
        GameResult testGameResult = gameResultList.get(gameResultList.size() - 1);
        assertThat(testGameResult.getGameEnding()).isEqualTo(UPDATED_GAME_ENDING);
        assertThat(testGameResult.getp1Score()).isEqualTo(UPDATED_P_1_SCORE);
        assertThat(testGameResult.getp2Score()).isEqualTo(UPDATED_P_2_SCORE);
    }

    @Test
    @Transactional
    void patchNonExistingGameResult() throws Exception {
        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();
        gameResult.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restGameResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, gameResult.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gameResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchGameResult() throws Exception {
        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();
        gameResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameResultMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(gameResult))
            )
            .andExpect(status().isBadRequest());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamGameResult() throws Exception {
        int databaseSizeBeforeUpdate = gameResultRepository.findAll().size();
        gameResult.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restGameResultMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(gameResult))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the GameResult in the database
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteGameResult() throws Exception {
        // Initialize the database
        gameResultRepository.saveAndFlush(gameResult);

        int databaseSizeBeforeDelete = gameResultRepository.findAll().size();

        // Delete the gameResult
        restGameResultMockMvc
            .perform(delete(ENTITY_API_URL_ID, gameResult.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<GameResult> gameResultList = gameResultRepository.findAll();
        assertThat(gameResultList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
