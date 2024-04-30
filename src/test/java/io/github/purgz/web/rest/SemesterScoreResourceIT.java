package io.github.purgz.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.purgz.IntegrationTest;
import io.github.purgz.domain.SemesterScore;
import io.github.purgz.repository.SemesterScoreRepository;
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
 * Integration tests for the {@link SemesterScoreResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser(authorities = AuthoritiesConstants.ADMIN)
class SemesterScoreResourceIT {

    private static final Integer DEFAULT_SCORE = 0;
    private static final Integer UPDATED_SCORE = 1;

    private static final String ENTITY_API_URL = "/api/semester-scores";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SemesterScoreRepository semesterScoreRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSemesterScoreMockMvc;

    private SemesterScore semesterScore;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SemesterScore createEntity(EntityManager em) {
        SemesterScore semesterScore = new SemesterScore().score(DEFAULT_SCORE);
        return semesterScore;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SemesterScore createUpdatedEntity(EntityManager em) {
        SemesterScore semesterScore = new SemesterScore().score(UPDATED_SCORE);
        return semesterScore;
    }

    @BeforeEach
    public void initTest() {
        semesterScore = createEntity(em);
    }

    @Test
    @Transactional
    void createSemesterScore() throws Exception {
        int databaseSizeBeforeCreate = semesterScoreRepository.findAll().size();
        // Create the SemesterScore
        restSemesterScoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semesterScore)))
            .andExpect(status().isCreated());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeCreate + 1);
        SemesterScore testSemesterScore = semesterScoreList.get(semesterScoreList.size() - 1);
        assertThat(testSemesterScore.getScore()).isEqualTo(DEFAULT_SCORE);
    }

    @Test
    @Transactional
    void createSemesterScoreWithExistingId() throws Exception {
        // Create the SemesterScore with an existing ID
        semesterScore.setId(1L);

        int databaseSizeBeforeCreate = semesterScoreRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSemesterScoreMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semesterScore)))
            .andExpect(status().isBadRequest());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSemesterScores() throws Exception {
        // Initialize the database
        semesterScoreRepository.saveAndFlush(semesterScore);

        // Get all the semesterScoreList
        restSemesterScoreMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(semesterScore.getId().intValue())))
            .andExpect(jsonPath("$.[*].score").value(hasItem(DEFAULT_SCORE)));
    }

    @Test
    @Transactional
    void getSemesterScore() throws Exception {
        // Initialize the database
        semesterScoreRepository.saveAndFlush(semesterScore);

        // Get the semesterScore
        restSemesterScoreMockMvc
            .perform(get(ENTITY_API_URL_ID, semesterScore.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(semesterScore.getId().intValue()))
            .andExpect(jsonPath("$.score").value(DEFAULT_SCORE));
    }

    @Test
    @Transactional
    void getNonExistingSemesterScore() throws Exception {
        // Get the semesterScore
        restSemesterScoreMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSemesterScore() throws Exception {
        // Initialize the database
        semesterScoreRepository.saveAndFlush(semesterScore);

        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();

        // Update the semesterScore
        SemesterScore updatedSemesterScore = semesterScoreRepository.findById(semesterScore.getId()).get();
        // Disconnect from session so that the updates on updatedSemesterScore are not directly saved in db
        em.detach(updatedSemesterScore);
        updatedSemesterScore.score(UPDATED_SCORE);

        restSemesterScoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSemesterScore.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSemesterScore))
            )
            .andExpect(status().isOk());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
        SemesterScore testSemesterScore = semesterScoreList.get(semesterScoreList.size() - 1);
        assertThat(testSemesterScore.getScore()).isEqualTo(UPDATED_SCORE);
    }

    @Test
    @Transactional
    void putNonExistingSemesterScore() throws Exception {
        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();
        semesterScore.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSemesterScoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, semesterScore.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(semesterScore))
            )
            .andExpect(status().isBadRequest());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSemesterScore() throws Exception {
        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();
        semesterScore.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemesterScoreMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(semesterScore))
            )
            .andExpect(status().isBadRequest());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSemesterScore() throws Exception {
        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();
        semesterScore.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemesterScoreMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(semesterScore)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSemesterScoreWithPatch() throws Exception {
        // Initialize the database
        semesterScoreRepository.saveAndFlush(semesterScore);

        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();

        // Update the semesterScore using partial update
        SemesterScore partialUpdatedSemesterScore = new SemesterScore();
        partialUpdatedSemesterScore.setId(semesterScore.getId());

        restSemesterScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSemesterScore.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSemesterScore))
            )
            .andExpect(status().isOk());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
        SemesterScore testSemesterScore = semesterScoreList.get(semesterScoreList.size() - 1);
        assertThat(testSemesterScore.getScore()).isEqualTo(DEFAULT_SCORE);
    }

    @Test
    @Transactional
    void fullUpdateSemesterScoreWithPatch() throws Exception {
        // Initialize the database
        semesterScoreRepository.saveAndFlush(semesterScore);

        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();

        // Update the semesterScore using partial update
        SemesterScore partialUpdatedSemesterScore = new SemesterScore();
        partialUpdatedSemesterScore.setId(semesterScore.getId());

        partialUpdatedSemesterScore.score(UPDATED_SCORE);

        restSemesterScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSemesterScore.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSemesterScore))
            )
            .andExpect(status().isOk());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
        SemesterScore testSemesterScore = semesterScoreList.get(semesterScoreList.size() - 1);
        assertThat(testSemesterScore.getScore()).isEqualTo(UPDATED_SCORE);
    }

    @Test
    @Transactional
    void patchNonExistingSemesterScore() throws Exception {
        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();
        semesterScore.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSemesterScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, semesterScore.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(semesterScore))
            )
            .andExpect(status().isBadRequest());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSemesterScore() throws Exception {
        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();
        semesterScore.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemesterScoreMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(semesterScore))
            )
            .andExpect(status().isBadRequest());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSemesterScore() throws Exception {
        int databaseSizeBeforeUpdate = semesterScoreRepository.findAll().size();
        semesterScore.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSemesterScoreMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(semesterScore))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the SemesterScore in the database
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSemesterScore() throws Exception {
        // Initialize the database
        semesterScoreRepository.saveAndFlush(semesterScore);

        int databaseSizeBeforeDelete = semesterScoreRepository.findAll().size();

        // Delete the semesterScore
        restSemesterScoreMockMvc
            .perform(delete(ENTITY_API_URL_ID, semesterScore.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<SemesterScore> semesterScoreList = semesterScoreRepository.findAll();
        assertThat(semesterScoreList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
