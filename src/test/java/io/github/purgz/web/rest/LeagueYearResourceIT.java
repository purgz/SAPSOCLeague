package io.github.purgz.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.purgz.IntegrationTest;
import io.github.purgz.domain.LeagueYear;
import io.github.purgz.repository.LeagueYearRepository;
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
 * Integration tests for the {@link LeagueYearResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser(authorities = AuthoritiesConstants.ADMIN)
class LeagueYearResourceIT {

    private static final Integer DEFAULT_YEAR_START = 1;
    private static final Integer UPDATED_YEAR_START = 2;

    private static final Integer DEFAULT_YEAR_END = 1;
    private static final Integer UPDATED_YEAR_END = 2;

    private static final String ENTITY_API_URL = "/api/league-years";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LeagueYearRepository leagueYearRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLeagueYearMockMvc;

    private LeagueYear leagueYear;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeagueYear createEntity(EntityManager em) {
        LeagueYear leagueYear = new LeagueYear().yearStart(DEFAULT_YEAR_START).yearEnd(DEFAULT_YEAR_END);
        return leagueYear;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeagueYear createUpdatedEntity(EntityManager em) {
        LeagueYear leagueYear = new LeagueYear().yearStart(UPDATED_YEAR_START).yearEnd(UPDATED_YEAR_END);
        return leagueYear;
    }

    @BeforeEach
    public void initTest() {
        leagueYear = createEntity(em);
    }

    @Test
    @Transactional
    void createLeagueYear() throws Exception {
        int databaseSizeBeforeCreate = leagueYearRepository.findAll().size();
        // Create the LeagueYear
        restLeagueYearMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leagueYear)))
            .andExpect(status().isCreated());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeCreate + 1);
        LeagueYear testLeagueYear = leagueYearList.get(leagueYearList.size() - 1);
        assertThat(testLeagueYear.getYearStart()).isEqualTo(DEFAULT_YEAR_START);
        assertThat(testLeagueYear.getYearEnd()).isEqualTo(DEFAULT_YEAR_END);
    }

    @Test
    @Transactional
    void createLeagueYearWithExistingId() throws Exception {
        // Create the LeagueYear with an existing ID
        leagueYear.setId(1L);

        int databaseSizeBeforeCreate = leagueYearRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeagueYearMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leagueYear)))
            .andExpect(status().isBadRequest());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkYearStartIsRequired() throws Exception {
        int databaseSizeBeforeTest = leagueYearRepository.findAll().size();
        // set the field null
        leagueYear.setYearStart(null);

        // Create the LeagueYear, which fails.

        restLeagueYearMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leagueYear)))
            .andExpect(status().isBadRequest());

        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLeagueYears() throws Exception {
        // Initialize the database
        leagueYearRepository.saveAndFlush(leagueYear);

        // Get all the leagueYearList
        restLeagueYearMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leagueYear.getId().intValue())))
            .andExpect(jsonPath("$.[*].yearStart").value(hasItem(DEFAULT_YEAR_START)))
            .andExpect(jsonPath("$.[*].yearEnd").value(hasItem(DEFAULT_YEAR_END)));
    }

    @Test
    @Transactional
    void getLeagueYear() throws Exception {
        // Initialize the database
        leagueYearRepository.saveAndFlush(leagueYear);

        // Get the leagueYear
        restLeagueYearMockMvc
            .perform(get(ENTITY_API_URL_ID, leagueYear.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(leagueYear.getId().intValue()))
            .andExpect(jsonPath("$.yearStart").value(DEFAULT_YEAR_START))
            .andExpect(jsonPath("$.yearEnd").value(DEFAULT_YEAR_END));
    }

    @Test
    @Transactional
    void getNonExistingLeagueYear() throws Exception {
        // Get the leagueYear
        restLeagueYearMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLeagueYear() throws Exception {
        // Initialize the database
        leagueYearRepository.saveAndFlush(leagueYear);

        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();

        // Update the leagueYear
        LeagueYear updatedLeagueYear = leagueYearRepository.findById(leagueYear.getId()).get();
        // Disconnect from session so that the updates on updatedLeagueYear are not directly saved in db
        em.detach(updatedLeagueYear);
        updatedLeagueYear.yearStart(UPDATED_YEAR_START).yearEnd(UPDATED_YEAR_END);

        restLeagueYearMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLeagueYear.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLeagueYear))
            )
            .andExpect(status().isOk());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
        LeagueYear testLeagueYear = leagueYearList.get(leagueYearList.size() - 1);
        assertThat(testLeagueYear.getYearStart()).isEqualTo(UPDATED_YEAR_START);
        assertThat(testLeagueYear.getYearEnd()).isEqualTo(UPDATED_YEAR_END);
    }

    @Test
    @Transactional
    void putNonExistingLeagueYear() throws Exception {
        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();
        leagueYear.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeagueYearMockMvc
            .perform(
                put(ENTITY_API_URL_ID, leagueYear.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leagueYear))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLeagueYear() throws Exception {
        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();
        leagueYear.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeagueYearMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leagueYear))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLeagueYear() throws Exception {
        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();
        leagueYear.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeagueYearMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leagueYear)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLeagueYearWithPatch() throws Exception {
        // Initialize the database
        leagueYearRepository.saveAndFlush(leagueYear);

        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();

        // Update the leagueYear using partial update
        LeagueYear partialUpdatedLeagueYear = new LeagueYear();
        partialUpdatedLeagueYear.setId(leagueYear.getId());

        partialUpdatedLeagueYear.yearStart(UPDATED_YEAR_START).yearEnd(UPDATED_YEAR_END);

        restLeagueYearMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeagueYear.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeagueYear))
            )
            .andExpect(status().isOk());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
        LeagueYear testLeagueYear = leagueYearList.get(leagueYearList.size() - 1);
        assertThat(testLeagueYear.getYearStart()).isEqualTo(UPDATED_YEAR_START);
        assertThat(testLeagueYear.getYearEnd()).isEqualTo(UPDATED_YEAR_END);
    }

    @Test
    @Transactional
    void fullUpdateLeagueYearWithPatch() throws Exception {
        // Initialize the database
        leagueYearRepository.saveAndFlush(leagueYear);

        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();

        // Update the leagueYear using partial update
        LeagueYear partialUpdatedLeagueYear = new LeagueYear();
        partialUpdatedLeagueYear.setId(leagueYear.getId());

        partialUpdatedLeagueYear.yearStart(UPDATED_YEAR_START).yearEnd(UPDATED_YEAR_END);

        restLeagueYearMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeagueYear.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeagueYear))
            )
            .andExpect(status().isOk());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
        LeagueYear testLeagueYear = leagueYearList.get(leagueYearList.size() - 1);
        assertThat(testLeagueYear.getYearStart()).isEqualTo(UPDATED_YEAR_START);
        assertThat(testLeagueYear.getYearEnd()).isEqualTo(UPDATED_YEAR_END);
    }

    @Test
    @Transactional
    void patchNonExistingLeagueYear() throws Exception {
        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();
        leagueYear.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeagueYearMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, leagueYear.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leagueYear))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLeagueYear() throws Exception {
        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();
        leagueYear.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeagueYearMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leagueYear))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLeagueYear() throws Exception {
        int databaseSizeBeforeUpdate = leagueYearRepository.findAll().size();
        leagueYear.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeagueYearMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(leagueYear))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LeagueYear in the database
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLeagueYear() throws Exception {
        // Initialize the database
        leagueYearRepository.saveAndFlush(leagueYear);

        int databaseSizeBeforeDelete = leagueYearRepository.findAll().size();

        // Delete the leagueYear
        restLeagueYearMockMvc
            .perform(delete(ENTITY_API_URL_ID, leagueYear.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LeagueYear> leagueYearList = leagueYearRepository.findAll();
        assertThat(leagueYearList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
