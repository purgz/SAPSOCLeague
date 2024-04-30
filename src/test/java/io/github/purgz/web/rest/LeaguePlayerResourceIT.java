package io.github.purgz.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import io.github.purgz.IntegrationTest;
import io.github.purgz.domain.LeaguePlayer;
import io.github.purgz.repository.LeaguePlayerRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link LeaguePlayerResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class LeaguePlayerResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final Integer DEFAULT_WINS = 0;
    private static final Integer UPDATED_WINS = 1;

    private static final Integer DEFAULT_LOSSES = 0;
    private static final Integer UPDATED_LOSSES = 1;

    private static final Float DEFAULT_ELO_RATING = 0F;
    private static final Float UPDATED_ELO_RATING = 1F;

    private static final Integer DEFAULT_DISHES = 0;
    private static final Integer UPDATED_DISHES = 1;

    private static final Integer DEFAULT_R_DISHES = 0;
    private static final Integer UPDATED_R_DISHES = 1;

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/league-players";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private LeaguePlayerRepository leaguePlayerRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restLeaguePlayerMockMvc;

    private LeaguePlayer leaguePlayer;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeaguePlayer createEntity(EntityManager em) {
        LeaguePlayer leaguePlayer = new LeaguePlayer()
            .firstName(DEFAULT_FIRST_NAME)
            .lastName(DEFAULT_LAST_NAME)
            .wins(DEFAULT_WINS)
            .losses(DEFAULT_LOSSES)
            .eloRating(DEFAULT_ELO_RATING)
            .dishes(DEFAULT_DISHES)
            .rDishes(DEFAULT_R_DISHES)
            .photo(DEFAULT_PHOTO)
            .photoContentType(DEFAULT_PHOTO_CONTENT_TYPE);
        return leaguePlayer;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static LeaguePlayer createUpdatedEntity(EntityManager em) {
        LeaguePlayer leaguePlayer = new LeaguePlayer()
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .wins(UPDATED_WINS)
            .losses(UPDATED_LOSSES)
            .eloRating(UPDATED_ELO_RATING)
            .dishes(UPDATED_DISHES)
            .rDishes(UPDATED_R_DISHES)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);
        return leaguePlayer;
    }

    @BeforeEach
    public void initTest() {
        leaguePlayer = createEntity(em);
    }

    @Test
    @Transactional
    void createLeaguePlayer() throws Exception {
        int databaseSizeBeforeCreate = leaguePlayerRepository.findAll().size();
        // Create the LeaguePlayer
        restLeaguePlayerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaguePlayer)))
            .andExpect(status().isCreated());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeCreate + 1);
        LeaguePlayer testLeaguePlayer = leaguePlayerList.get(leaguePlayerList.size() - 1);
        assertThat(testLeaguePlayer.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testLeaguePlayer.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
        assertThat(testLeaguePlayer.getWins()).isEqualTo(DEFAULT_WINS);
        assertThat(testLeaguePlayer.getLosses()).isEqualTo(DEFAULT_LOSSES);
        assertThat(testLeaguePlayer.getEloRating()).isEqualTo(DEFAULT_ELO_RATING);
        assertThat(testLeaguePlayer.getDishes()).isEqualTo(DEFAULT_DISHES);
        assertThat(testLeaguePlayer.getrDishes()).isEqualTo(DEFAULT_R_DISHES);
        assertThat(testLeaguePlayer.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testLeaguePlayer.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createLeaguePlayerWithExistingId() throws Exception {
        // Create the LeaguePlayer with an existing ID
        leaguePlayer.setId(1L);

        int databaseSizeBeforeCreate = leaguePlayerRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restLeaguePlayerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaguePlayer)))
            .andExpect(status().isBadRequest());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaguePlayerRepository.findAll().size();
        // set the field null
        leaguePlayer.setFirstName(null);

        // Create the LeaguePlayer, which fails.

        restLeaguePlayerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaguePlayer)))
            .andExpect(status().isBadRequest());

        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkWinsIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaguePlayerRepository.findAll().size();
        // set the field null
        leaguePlayer.setWins(null);

        // Create the LeaguePlayer, which fails.

        restLeaguePlayerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaguePlayer)))
            .andExpect(status().isBadRequest());

        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkLossesIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaguePlayerRepository.findAll().size();
        // set the field null
        leaguePlayer.setLosses(null);

        // Create the LeaguePlayer, which fails.

        restLeaguePlayerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaguePlayer)))
            .andExpect(status().isBadRequest());

        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkEloRatingIsRequired() throws Exception {
        int databaseSizeBeforeTest = leaguePlayerRepository.findAll().size();
        // set the field null
        leaguePlayer.setEloRating(null);

        // Create the LeaguePlayer, which fails.

        restLeaguePlayerMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaguePlayer)))
            .andExpect(status().isBadRequest());

        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllLeaguePlayers() throws Exception {
        // Initialize the database
        leaguePlayerRepository.saveAndFlush(leaguePlayer);

        // Get all the leaguePlayerList
        restLeaguePlayerMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(leaguePlayer.getId().intValue())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)))
            .andExpect(jsonPath("$.[*].wins").value(hasItem(DEFAULT_WINS)))
            .andExpect(jsonPath("$.[*].losses").value(hasItem(DEFAULT_LOSSES)))
            .andExpect(jsonPath("$.[*].eloRating").value(hasItem(DEFAULT_ELO_RATING.doubleValue())))
            .andExpect(jsonPath("$.[*].dishes").value(hasItem(DEFAULT_DISHES)))
            .andExpect(jsonPath("$.[*].rDishes").value(hasItem(DEFAULT_R_DISHES)))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))));
    }

    @Test
    @Transactional
    void getLeaguePlayer() throws Exception {
        // Initialize the database
        leaguePlayerRepository.saveAndFlush(leaguePlayer);

        // Get the leaguePlayer
        restLeaguePlayerMockMvc
            .perform(get(ENTITY_API_URL_ID, leaguePlayer.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(leaguePlayer.getId().intValue()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME))
            .andExpect(jsonPath("$.wins").value(DEFAULT_WINS))
            .andExpect(jsonPath("$.losses").value(DEFAULT_LOSSES))
            .andExpect(jsonPath("$.eloRating").value(DEFAULT_ELO_RATING.doubleValue()))
            .andExpect(jsonPath("$.dishes").value(DEFAULT_DISHES))
            .andExpect(jsonPath("$.rDishes").value(DEFAULT_R_DISHES))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)));
    }

    @Test
    @Transactional
    void getNonExistingLeaguePlayer() throws Exception {
        // Get the leaguePlayer
        restLeaguePlayerMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingLeaguePlayer() throws Exception {
        // Initialize the database
        leaguePlayerRepository.saveAndFlush(leaguePlayer);

        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();

        // Update the leaguePlayer
        LeaguePlayer updatedLeaguePlayer = leaguePlayerRepository.findById(leaguePlayer.getId()).get();
        // Disconnect from session so that the updates on updatedLeaguePlayer are not directly saved in db
        em.detach(updatedLeaguePlayer);
        updatedLeaguePlayer
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .wins(UPDATED_WINS)
            .losses(UPDATED_LOSSES)
            .eloRating(UPDATED_ELO_RATING)
            .dishes(UPDATED_DISHES)
            .rDishes(UPDATED_R_DISHES)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restLeaguePlayerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedLeaguePlayer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedLeaguePlayer))
            )
            .andExpect(status().isOk());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
        LeaguePlayer testLeaguePlayer = leaguePlayerList.get(leaguePlayerList.size() - 1);
        assertThat(testLeaguePlayer.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testLeaguePlayer.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testLeaguePlayer.getWins()).isEqualTo(UPDATED_WINS);
        assertThat(testLeaguePlayer.getLosses()).isEqualTo(UPDATED_LOSSES);
        assertThat(testLeaguePlayer.getEloRating()).isEqualTo(UPDATED_ELO_RATING);
        assertThat(testLeaguePlayer.getDishes()).isEqualTo(UPDATED_DISHES);
        assertThat(testLeaguePlayer.getrDishes()).isEqualTo(UPDATED_R_DISHES);
        assertThat(testLeaguePlayer.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testLeaguePlayer.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingLeaguePlayer() throws Exception {
        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();
        leaguePlayer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeaguePlayerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, leaguePlayer.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaguePlayer))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchLeaguePlayer() throws Exception {
        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();
        leaguePlayer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaguePlayerMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(leaguePlayer))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamLeaguePlayer() throws Exception {
        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();
        leaguePlayer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaguePlayerMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(leaguePlayer)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateLeaguePlayerWithPatch() throws Exception {
        // Initialize the database
        leaguePlayerRepository.saveAndFlush(leaguePlayer);

        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();

        // Update the leaguePlayer using partial update
        LeaguePlayer partialUpdatedLeaguePlayer = new LeaguePlayer();
        partialUpdatedLeaguePlayer.setId(leaguePlayer.getId());

        partialUpdatedLeaguePlayer
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .rDishes(UPDATED_R_DISHES)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restLeaguePlayerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeaguePlayer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeaguePlayer))
            )
            .andExpect(status().isOk());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
        LeaguePlayer testLeaguePlayer = leaguePlayerList.get(leaguePlayerList.size() - 1);
        assertThat(testLeaguePlayer.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testLeaguePlayer.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testLeaguePlayer.getWins()).isEqualTo(DEFAULT_WINS);
        assertThat(testLeaguePlayer.getLosses()).isEqualTo(DEFAULT_LOSSES);
        assertThat(testLeaguePlayer.getEloRating()).isEqualTo(DEFAULT_ELO_RATING);
        assertThat(testLeaguePlayer.getDishes()).isEqualTo(DEFAULT_DISHES);
        assertThat(testLeaguePlayer.getrDishes()).isEqualTo(UPDATED_R_DISHES);
        assertThat(testLeaguePlayer.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testLeaguePlayer.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateLeaguePlayerWithPatch() throws Exception {
        // Initialize the database
        leaguePlayerRepository.saveAndFlush(leaguePlayer);

        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();

        // Update the leaguePlayer using partial update
        LeaguePlayer partialUpdatedLeaguePlayer = new LeaguePlayer();
        partialUpdatedLeaguePlayer.setId(leaguePlayer.getId());

        partialUpdatedLeaguePlayer
            .firstName(UPDATED_FIRST_NAME)
            .lastName(UPDATED_LAST_NAME)
            .wins(UPDATED_WINS)
            .losses(UPDATED_LOSSES)
            .eloRating(UPDATED_ELO_RATING)
            .dishes(UPDATED_DISHES)
            .rDishes(UPDATED_R_DISHES)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restLeaguePlayerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedLeaguePlayer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedLeaguePlayer))
            )
            .andExpect(status().isOk());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
        LeaguePlayer testLeaguePlayer = leaguePlayerList.get(leaguePlayerList.size() - 1);
        assertThat(testLeaguePlayer.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testLeaguePlayer.getLastName()).isEqualTo(UPDATED_LAST_NAME);
        assertThat(testLeaguePlayer.getWins()).isEqualTo(UPDATED_WINS);
        assertThat(testLeaguePlayer.getLosses()).isEqualTo(UPDATED_LOSSES);
        assertThat(testLeaguePlayer.getEloRating()).isEqualTo(UPDATED_ELO_RATING);
        assertThat(testLeaguePlayer.getDishes()).isEqualTo(UPDATED_DISHES);
        assertThat(testLeaguePlayer.getrDishes()).isEqualTo(UPDATED_R_DISHES);
        assertThat(testLeaguePlayer.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testLeaguePlayer.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingLeaguePlayer() throws Exception {
        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();
        leaguePlayer.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restLeaguePlayerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, leaguePlayer.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leaguePlayer))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchLeaguePlayer() throws Exception {
        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();
        leaguePlayer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaguePlayerMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(leaguePlayer))
            )
            .andExpect(status().isBadRequest());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamLeaguePlayer() throws Exception {
        int databaseSizeBeforeUpdate = leaguePlayerRepository.findAll().size();
        leaguePlayer.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restLeaguePlayerMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(leaguePlayer))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the LeaguePlayer in the database
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteLeaguePlayer() throws Exception {
        // Initialize the database
        leaguePlayerRepository.saveAndFlush(leaguePlayer);

        int databaseSizeBeforeDelete = leaguePlayerRepository.findAll().size();

        // Delete the leaguePlayer
        restLeaguePlayerMockMvc
            .perform(delete(ENTITY_API_URL_ID, leaguePlayer.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<LeaguePlayer> leaguePlayerList = leaguePlayerRepository.findAll();
        assertThat(leaguePlayerList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
