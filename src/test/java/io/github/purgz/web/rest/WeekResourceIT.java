package io.github.purgz.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.purgz.IntegrationTest;
import io.github.purgz.domain.Week;
import io.github.purgz.repository.WeekRepository;
import java.time.LocalDate;
import java.time.ZoneId;
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
 * Integration tests for the {@link WeekResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WeekResourceIT {

    private static final Integer DEFAULT_WEEK_NUM = 0;
    private static final Integer UPDATED_WEEK_NUM = 1;

    private static final LocalDate DEFAULT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/weeks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WeekRepository weekRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWeekMockMvc;

    private Week week;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Week createEntity(EntityManager em) {
        Week week = new Week().weekNum(DEFAULT_WEEK_NUM).date(DEFAULT_DATE);
        return week;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Week createUpdatedEntity(EntityManager em) {
        Week week = new Week().weekNum(UPDATED_WEEK_NUM).date(UPDATED_DATE);
        return week;
    }

    @BeforeEach
    public void initTest() {
        week = createEntity(em);
    }

    @Test
    @Transactional
    void createWeek() throws Exception {
        int databaseSizeBeforeCreate = weekRepository.findAll().size();
        // Create the Week
        restWeekMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(week)))
            .andExpect(status().isCreated());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeCreate + 1);
        Week testWeek = weekList.get(weekList.size() - 1);
        assertThat(testWeek.getWeekNum()).isEqualTo(DEFAULT_WEEK_NUM);
        assertThat(testWeek.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createWeekWithExistingId() throws Exception {
        // Create the Week with an existing ID
        week.setId(1L);

        int databaseSizeBeforeCreate = weekRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWeekMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(week)))
            .andExpect(status().isBadRequest());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkWeekNumIsRequired() throws Exception {
        int databaseSizeBeforeTest = weekRepository.findAll().size();
        // set the field null
        week.setWeekNum(null);

        // Create the Week, which fails.

        restWeekMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(week)))
            .andExpect(status().isBadRequest());

        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWeeks() throws Exception {
        // Initialize the database
        weekRepository.saveAndFlush(week);

        // Get all the weekList
        restWeekMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(week.getId().intValue())))
            .andExpect(jsonPath("$.[*].weekNum").value(hasItem(DEFAULT_WEEK_NUM)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getWeek() throws Exception {
        // Initialize the database
        weekRepository.saveAndFlush(week);

        // Get the week
        restWeekMockMvc
            .perform(get(ENTITY_API_URL_ID, week.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(week.getId().intValue()))
            .andExpect(jsonPath("$.weekNum").value(DEFAULT_WEEK_NUM))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWeek() throws Exception {
        // Get the week
        restWeekMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWeek() throws Exception {
        // Initialize the database
        weekRepository.saveAndFlush(week);

        int databaseSizeBeforeUpdate = weekRepository.findAll().size();

        // Update the week
        Week updatedWeek = weekRepository.findById(week.getId()).get();
        // Disconnect from session so that the updates on updatedWeek are not directly saved in db
        em.detach(updatedWeek);
        updatedWeek.weekNum(UPDATED_WEEK_NUM).date(UPDATED_DATE);

        restWeekMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWeek.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWeek))
            )
            .andExpect(status().isOk());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
        Week testWeek = weekList.get(weekList.size() - 1);
        assertThat(testWeek.getWeekNum()).isEqualTo(UPDATED_WEEK_NUM);
        assertThat(testWeek.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingWeek() throws Exception {
        int databaseSizeBeforeUpdate = weekRepository.findAll().size();
        week.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeekMockMvc
            .perform(
                put(ENTITY_API_URL_ID, week.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(week))
            )
            .andExpect(status().isBadRequest());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWeek() throws Exception {
        int databaseSizeBeforeUpdate = weekRepository.findAll().size();
        week.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeekMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(week))
            )
            .andExpect(status().isBadRequest());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWeek() throws Exception {
        int databaseSizeBeforeUpdate = weekRepository.findAll().size();
        week.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeekMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(week)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWeekWithPatch() throws Exception {
        // Initialize the database
        weekRepository.saveAndFlush(week);

        int databaseSizeBeforeUpdate = weekRepository.findAll().size();

        // Update the week using partial update
        Week partialUpdatedWeek = new Week();
        partialUpdatedWeek.setId(week.getId());

        partialUpdatedWeek.weekNum(UPDATED_WEEK_NUM);

        restWeekMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWeek.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWeek))
            )
            .andExpect(status().isOk());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
        Week testWeek = weekList.get(weekList.size() - 1);
        assertThat(testWeek.getWeekNum()).isEqualTo(UPDATED_WEEK_NUM);
        assertThat(testWeek.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateWeekWithPatch() throws Exception {
        // Initialize the database
        weekRepository.saveAndFlush(week);

        int databaseSizeBeforeUpdate = weekRepository.findAll().size();

        // Update the week using partial update
        Week partialUpdatedWeek = new Week();
        partialUpdatedWeek.setId(week.getId());

        partialUpdatedWeek.weekNum(UPDATED_WEEK_NUM).date(UPDATED_DATE);

        restWeekMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWeek.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWeek))
            )
            .andExpect(status().isOk());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
        Week testWeek = weekList.get(weekList.size() - 1);
        assertThat(testWeek.getWeekNum()).isEqualTo(UPDATED_WEEK_NUM);
        assertThat(testWeek.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingWeek() throws Exception {
        int databaseSizeBeforeUpdate = weekRepository.findAll().size();
        week.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWeekMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, week.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(week))
            )
            .andExpect(status().isBadRequest());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWeek() throws Exception {
        int databaseSizeBeforeUpdate = weekRepository.findAll().size();
        week.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeekMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(week))
            )
            .andExpect(status().isBadRequest());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWeek() throws Exception {
        int databaseSizeBeforeUpdate = weekRepository.findAll().size();
        week.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWeekMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(week)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Week in the database
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWeek() throws Exception {
        // Initialize the database
        weekRepository.saveAndFlush(week);

        int databaseSizeBeforeDelete = weekRepository.findAll().size();

        // Delete the week
        restWeekMockMvc
            .perform(delete(ENTITY_API_URL_ID, week.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Week> weekList = weekRepository.findAll();
        assertThat(weekList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
