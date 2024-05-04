package io.github.purgz.web.rest;

import io.github.purgz.domain.LeaguePlayer;
import io.github.purgz.domain.LeagueYear;
import io.github.purgz.domain.Semester;
import io.github.purgz.domain.SemesterScore;
import io.github.purgz.repository.LeaguePlayerRepository;
import io.github.purgz.repository.LeagueYearRepository;
import io.github.purgz.repository.SemesterRepository;
import io.github.purgz.repository.SemesterScoreRepository;
import io.github.purgz.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link io.github.purgz.domain.SemesterScore}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SemesterScoreResource {

    private final Logger log = LoggerFactory.getLogger(SemesterScoreResource.class);

    private static final String ENTITY_NAME = "semesterScore";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SemesterScoreRepository semesterScoreRepository;
    private final SemesterRepository semesterRepository;
    private final LeaguePlayerRepository leaguePlayerRepository;
    private final LeagueYearRepository leagueYearRepository;

    public SemesterScoreResource(
        SemesterScoreRepository semesterScoreRepository,
        SemesterRepository semesterRepository,
        LeaguePlayerRepository leaguePlayerRepository,
        LeagueYearRepository leagueYearRepository
    ) {
        this.semesterScoreRepository = semesterScoreRepository;
        this.semesterRepository = semesterRepository;
        this.leaguePlayerRepository = leaguePlayerRepository;
        this.leagueYearRepository = leagueYearRepository;
    }

    /**
     * {@code POST  /semester-scores} : Create a new semesterScore.
     *
     * @param semesterScore the semesterScore to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new semesterScore, or with status {@code 400 (Bad Request)} if the semesterScore has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/semester-scores")
    public ResponseEntity<SemesterScore> createSemesterScore(@Valid @RequestBody SemesterScore semesterScore) throws URISyntaxException {
        log.debug("REST request to save SemesterScore : {}", semesterScore);
        if (semesterScore.getId() != null) {
            throw new BadRequestAlertException("A new semesterScore cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SemesterScore result = semesterScoreRepository.save(semesterScore);
        return ResponseEntity
            .created(new URI("/api/semester-scores/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /semester-scores/:id} : Updates an existing semesterScore.
     *
     * @param id the id of the semesterScore to save.
     * @param semesterScore the semesterScore to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semesterScore,
     * or with status {@code 400 (Bad Request)} if the semesterScore is not valid,
     * or with status {@code 500 (Internal Server Error)} if the semesterScore couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/semester-scores/{id}")
    public ResponseEntity<SemesterScore> updateSemesterScore(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody SemesterScore semesterScore
    ) throws URISyntaxException {
        log.debug("REST request to update SemesterScore : {}, {}", id, semesterScore);
        if (semesterScore.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, semesterScore.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!semesterScoreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SemesterScore result = semesterScoreRepository.save(semesterScore);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semesterScore.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /semester-scores/:id} : Partial updates given fields of an existing semesterScore, field will ignore if it is null
     *
     * @param id the id of the semesterScore to save.
     * @param semesterScore the semesterScore to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semesterScore,
     * or with status {@code 400 (Bad Request)} if the semesterScore is not valid,
     * or with status {@code 404 (Not Found)} if the semesterScore is not found,
     * or with status {@code 500 (Internal Server Error)} if the semesterScore couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/semester-scores/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SemesterScore> partialUpdateSemesterScore(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody SemesterScore semesterScore
    ) throws URISyntaxException {
        log.debug("REST request to partial update SemesterScore partially : {}, {}", id, semesterScore);
        if (semesterScore.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, semesterScore.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!semesterScoreRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SemesterScore> result = semesterScoreRepository
            .findById(semesterScore.getId())
            .map(existingSemesterScore -> {
                if (semesterScore.getScore() != null) {
                    existingSemesterScore.setScore(semesterScore.getScore());
                }

                return existingSemesterScore;
            })
            .map(semesterScoreRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semesterScore.getId().toString())
        );
    }

    /**
     * {@code GET  /semester-scores} : get all the semesterScores.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of semesterScores in body.
     */
    @GetMapping("/semester-scores")
    public List<SemesterScore> getAllSemesterScores() {
        log.debug("REST request to get all SemesterScores");
        return semesterScoreRepository.findAll();
    }

    /**
     * {@code GET  /semester-scores/:id} : get the "id" semesterScore.
     *
     * @param id the id of the semesterScore to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the semesterScore, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/semester-scores/{id}")
    public ResponseEntity<SemesterScore> getSemesterScore(@PathVariable Long id) {
        log.debug("REST request to get SemesterScore : {}", id);
        Optional<SemesterScore> semesterScore = semesterScoreRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(semesterScore);
    }

    /**
     * {@code DELETE  /semester-scores/:id} : delete the "id" semesterScore.
     *
     * @param id the id of the semesterScore to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/semester-scores/{id}")
    public ResponseEntity<Void> deleteSemesterScore(@PathVariable Long id) {
        log.debug("REST request to delete SemesterScore : {}", id);
        semesterScoreRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/semester-scores/{playerId}/{semesterId}")
    public ResponseEntity<Set<SemesterScore>> getByPlayerAndSem(@PathVariable Long playerId, @PathVariable Long semesterId) {
        Optional<Semester> semester = semesterRepository.findById(semesterId);
        Optional<LeaguePlayer> leaguePlayer = leaguePlayerRepository.findById(playerId);

        return new ResponseEntity<>(semesterScoreRepository.findAllBySemesterAndPlayer(semester.get(), leaguePlayer.get()), HttpStatus.OK);
    }

    @GetMapping("/semester-scores/year/{playerId}/{yearId}")
    public ResponseEntity<Set<SemesterScore>> getByPlayerAndYear(@PathVariable Long playerId, @PathVariable Long yearId) {
        Optional<LeagueYear> leagueYear = leagueYearRepository.findById(yearId);
        Optional<LeaguePlayer> leaguePlayer = leaguePlayerRepository.findById(playerId);

        if (!leagueYear.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Set<SemesterScore> scores = new HashSet<>();

        leagueYear
            .get()
            .getSemesters()
            .forEach(semester -> {
                scores.addAll(semesterScoreRepository.findAllBySemesterAndPlayer(semester, leaguePlayer.get()));
            });

        return new ResponseEntity<>(scores, HttpStatus.OK);
    }
}
