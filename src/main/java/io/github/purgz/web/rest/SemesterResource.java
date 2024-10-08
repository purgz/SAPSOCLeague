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
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
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
 * REST controller for managing {@link io.github.purgz.domain.Semester}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SemesterResource {

    private final Logger log = LoggerFactory.getLogger(SemesterResource.class);

    private static final String ENTITY_NAME = "semester";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SemesterRepository semesterRepository;
    private final LeagueYearRepository leagueYearRepository;

    private final LeaguePlayerRepository leaguePlayerRepository;

    private final SemesterScoreRepository semesterScoreRepository;

    public SemesterResource(
        SemesterRepository semesterRepository,
        LeagueYearRepository leagueYearRepository,
        LeaguePlayerRepository leaguePlayerRepository,
        SemesterScoreRepository semesterScoreRepository
    ) {
        this.semesterRepository = semesterRepository;
        this.leagueYearRepository = leagueYearRepository;
        this.leaguePlayerRepository = leaguePlayerRepository;
        this.semesterScoreRepository = semesterScoreRepository;
    }

    /**
     * {@code POST  /semesters} : Create a new semester.
     *
     * @param semester the semester to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new semester, or with status {@code 400 (Bad Request)} if the semester has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/semesters")
    public ResponseEntity<Semester> createSemester(@Valid @RequestBody Semester semester) throws URISyntaxException {
        log.debug("REST request to save Semester : {}", semester);
        if (semester.getId() != null) {
            throw new BadRequestAlertException("A new semester cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Semester result = semesterRepository.save(semester);
        return ResponseEntity
            .created(new URI("/api/semesters/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/semesters/{semesterId}/add-players")
    public ResponseEntity<List<LeaguePlayer>> addPlayersToSemester(
        @Valid @RequestBody List<LeaguePlayer> leaguePlayers,
        @PathVariable Long semesterId
    ) throws URISyntaxException {
        log.debug("REST request to add list of players to semester");

        Optional<Semester> semesterOptional = this.semesterRepository.findById(semesterId);
        if (semesterOptional.isEmpty()) {
            throw new BadRequestAlertException("Semester not found", ENTITY_NAME, "semesternotfound");
        }

        leaguePlayers.forEach(leaguePlayer -> {
            try {
                Optional<LeaguePlayer> leaguePlayerOptional = this.leaguePlayerRepository.findById(leaguePlayer.getId());
                if (leaguePlayerOptional.isEmpty()) {
                    throw new BadRequestAlertException("Player not found", ENTITY_NAME, "playernotfound");
                }

                leaguePlayerOptional.get().getSemesters().add(semesterOptional.get());
                //create semester score
                SemesterScore semesterScore = new SemesterScore();
                semesterScore.setScore(0f);
                semesterScoreRepository.save(semesterScore);
                semesterScore.setPlayer(leaguePlayer);
                semesterScore.setSemester(semesterOptional.get());
            } catch (Error error) {
                System.out.println(error);
                System.out.println("Failed to add league player with id: " + leaguePlayer.getId());
            }
        });

        return new ResponseEntity<>(leaguePlayers, HttpStatus.OK);
    }

    /**
     * {@code PUT  /semesters/:id} : Updates an existing semester.
     *
     * @param id the id of the semester to save.
     * @param semester the semester to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semester,
     * or with status {@code 400 (Bad Request)} if the semester is not valid,
     * or with status {@code 500 (Internal Server Error)} if the semester couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/semesters/{id}")
    public ResponseEntity<Semester> updateSemester(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Semester semester
    ) throws URISyntaxException {
        log.debug("REST request to update Semester : {}, {}", id, semester);
        if (semester.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, semester.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!semesterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Semester result = semesterRepository.save(semester);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semester.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /semesters/:id} : Partial updates given fields of an existing semester, field will ignore if it is null
     *
     * @param id the id of the semester to save.
     * @param semester the semester to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated semester,
     * or with status {@code 400 (Bad Request)} if the semester is not valid,
     * or with status {@code 404 (Not Found)} if the semester is not found,
     * or with status {@code 500 (Internal Server Error)} if the semester couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/semesters/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Semester> partialUpdateSemester(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Semester semester
    ) throws URISyntaxException {
        log.debug("REST request to partial update Semester partially : {}, {}", id, semester);
        if (semester.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, semester.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!semesterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Semester> result = semesterRepository
            .findById(semester.getId())
            .map(existingSemester -> {
                if (semester.getSemesterNum() != null) {
                    existingSemester.setSemesterNum(semester.getSemesterNum());
                }

                return existingSemester;
            })
            .map(semesterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, semester.getId().toString())
        );
    }

    /**
     * {@code GET  /semesters} : get all the semesters.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of semesters in body.
     */
    @GetMapping("/semesters")
    public List<Semester> getAllSemesters() {
        log.debug("REST request to get all Semesters");
        return semesterRepository.findAll();
    }

    /**
     * {@code GET  /semesters/:id} : get the "id" semester.
     *
     * @param id the id of the semester to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the semester, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/semesters/{id}")
    public ResponseEntity<Semester> getSemester(@PathVariable Long id) {
        log.debug("REST request to get Semester : {}", id);
        Optional<Semester> semester = semesterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(semester);
    }

    /**
     * {@code DELETE  /semesters/:id} : delete the "id" semester.
     *
     * @param id the id of the semester to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/semesters/{id}")
    public ResponseEntity<Void> deleteSemester(@PathVariable Long id) {
        log.debug("REST request to delete Semester : {}", id);
        semesterRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/semesters/year/{id}")
    public ResponseEntity<Set<Semester>> getSemsByYear(@PathVariable Long id) {
        Optional<LeagueYear> leagueYear = leagueYearRepository.findById(id);

        if (leagueYear.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Optional<Set<Semester>> semesters = semesterRepository.findByYear(leagueYear.get());

        if (semesters.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(semesters.get(), HttpStatus.OK);
    }
}
