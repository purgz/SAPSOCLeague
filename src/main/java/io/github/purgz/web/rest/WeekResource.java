package io.github.purgz.web.rest;

import com.sun.xml.bind.v2.TODO;
import io.github.purgz.domain.Round;
import io.github.purgz.domain.Semester;
import io.github.purgz.domain.Week;
import io.github.purgz.repository.SemesterRepository;
import io.github.purgz.repository.WeekRepository;
import io.github.purgz.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.hibernate.Hibernate;
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
 * REST controller for managing {@link io.github.purgz.domain.Week}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class WeekResource {

    private final Logger log = LoggerFactory.getLogger(WeekResource.class);

    private static final String ENTITY_NAME = "week";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WeekRepository weekRepository;

    private final SemesterRepository semesterRepository;

    public WeekResource(WeekRepository weekRepository, SemesterRepository semesterRepository) {
        this.weekRepository = weekRepository;
        this.semesterRepository = semesterRepository;
    }

    /**
     * {@code POST  /weeks} : Create a new week.
     *
     * @param week the week to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new week, or with status {@code 400 (Bad Request)} if the week has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/weeks")
    public ResponseEntity<Week> createWeek(@Valid @RequestBody Week week) throws URISyntaxException {
        log.debug("REST request to save Week : {}", week);
        if (week.getId() != null) {
            throw new BadRequestAlertException("A new week cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Week result = weekRepository.save(week);
        return ResponseEntity
            .created(new URI("/api/weeks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /weeks/:id} : Updates an existing week.
     *
     * @param id the id of the week to save.
     * @param week the week to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated week,
     * or with status {@code 400 (Bad Request)} if the week is not valid,
     * or with status {@code 500 (Internal Server Error)} if the week couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/weeks/{id}")
    public ResponseEntity<Week> updateWeek(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Week week)
        throws URISyntaxException {
        log.debug("REST request to update Week : {}, {}", id, week);
        if (week.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, week.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!weekRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Week result = weekRepository.save(week);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, week.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /weeks/:id} : Partial updates given fields of an existing week, field will ignore if it is null
     *
     * @param id the id of the week to save.
     * @param week the week to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated week,
     * or with status {@code 400 (Bad Request)} if the week is not valid,
     * or with status {@code 404 (Not Found)} if the week is not found,
     * or with status {@code 500 (Internal Server Error)} if the week couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/weeks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Week> partialUpdateWeek(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Week week
    ) throws URISyntaxException {
        log.debug("REST request to partial update Week partially : {}, {}", id, week);
        if (week.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, week.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!weekRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Week> result = weekRepository
            .findById(week.getId())
            .map(existingWeek -> {
                if (week.getWeekNum() != null) {
                    existingWeek.setWeekNum(week.getWeekNum());
                }
                if (week.getDate() != null) {
                    existingWeek.setDate(week.getDate());
                }

                return existingWeek;
            })
            .map(weekRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, week.getId().toString())
        );
    }

    /**
     * {@code GET  /weeks} : get all the weeks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of weeks in body.
     */
    @GetMapping("/weeks")
    public List<Week> getAllWeeks() {
        log.debug("REST request to get all Weeks");
        return weekRepository.findAll();
    }

    /**
     * {@code GET  /weeks/:id} : get the "id" week.
     *
     * @param id the id of the week to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the week, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/weeks/{id}")
    public ResponseEntity<Week> getWeek(@PathVariable Long id) {
        log.debug("REST request to get Week : {}", id);
        Optional<Week> week = weekRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(week);
    }

    /**
     * {@code DELETE  /weeks/:id} : delete the "id" week.
     *
     * @param id the id of the week to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/weeks/{id}")
    public ResponseEntity<Void> deleteWeek(@PathVariable Long id) {
        log.debug("REST request to delete Week : {}", id);
        weekRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/weeks/semester/{id}")
    public ResponseEntity<List<Week>> getWeeksBySemester(@PathVariable Long id) {
        log.debug("REST request to get weeks by semester id");
        Optional<Semester> semesterOptional = this.semesterRepository.findById(id);

        if (semesterOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Hibernate.initialize(semesterOptional.get().getWeeks());

        Set<Week> weeks = semesterOptional.get().getWeeks();

        List<Week> weeksList = new ArrayList<>();
        weeksList.addAll(weeks);

        //eager load all weeks ?

        for (Week week : weeks) {
            Hibernate.initialize(week.getRounds());
        }
        return new ResponseEntity<>(weeksList, HttpStatus.OK);
    }
    //TODO need to make frontend nice to display list of weeks
    //when selecting a particular week, collect all the matches from each round in that week
    //store that in the frontend and display

}
