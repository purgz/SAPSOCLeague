package io.github.purgz.web.rest;

import io.github.purgz.domain.LeagueYear;
import io.github.purgz.repository.LeagueYearRepository;
import io.github.purgz.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.hibernate.Hibernate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link io.github.purgz.domain.LeagueYear}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LeagueYearResource {

    private final Logger log = LoggerFactory.getLogger(LeagueYearResource.class);

    private static final String ENTITY_NAME = "leagueYear";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LeagueYearRepository leagueYearRepository;

    public LeagueYearResource(LeagueYearRepository leagueYearRepository) {
        this.leagueYearRepository = leagueYearRepository;
    }

    /**
     * {@code POST  /league-years} : Create a new leagueYear.
     *
     * @param leagueYear the leagueYear to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new leagueYear, or with status {@code 400 (Bad Request)} if the leagueYear has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/league-years")
    public ResponseEntity<LeagueYear> createLeagueYear(@Valid @RequestBody LeagueYear leagueYear) throws URISyntaxException {
        log.debug("REST request to save LeagueYear : {}", leagueYear);
        if (leagueYear.getId() != null) {
            throw new BadRequestAlertException("A new leagueYear cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeagueYear result = leagueYearRepository.save(leagueYear);
        return ResponseEntity
            .created(new URI("/api/league-years/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /league-years/:id} : Updates an existing leagueYear.
     *
     * @param id the id of the leagueYear to save.
     * @param leagueYear the leagueYear to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leagueYear,
     * or with status {@code 400 (Bad Request)} if the leagueYear is not valid,
     * or with status {@code 500 (Internal Server Error)} if the leagueYear couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/league-years/{id}")
    public ResponseEntity<LeagueYear> updateLeagueYear(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LeagueYear leagueYear
    ) throws URISyntaxException {
        log.debug("REST request to update LeagueYear : {}, {}", id, leagueYear);
        if (leagueYear.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leagueYear.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leagueYearRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LeagueYear result = leagueYearRepository.save(leagueYear);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, leagueYear.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /league-years/:id} : Partial updates given fields of an existing leagueYear, field will ignore if it is null
     *
     * @param id the id of the leagueYear to save.
     * @param leagueYear the leagueYear to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leagueYear,
     * or with status {@code 400 (Bad Request)} if the leagueYear is not valid,
     * or with status {@code 404 (Not Found)} if the leagueYear is not found,
     * or with status {@code 500 (Internal Server Error)} if the leagueYear couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/league-years/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LeagueYear> partialUpdateLeagueYear(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LeagueYear leagueYear
    ) throws URISyntaxException {
        log.debug("REST request to partial update LeagueYear partially : {}, {}", id, leagueYear);
        if (leagueYear.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leagueYear.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leagueYearRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LeagueYear> result = leagueYearRepository
            .findById(leagueYear.getId())
            .map(existingLeagueYear -> {
                if (leagueYear.getYearStart() != null) {
                    existingLeagueYear.setYearStart(leagueYear.getYearStart());
                }
                if (leagueYear.getYearEnd() != null) {
                    existingLeagueYear.setYearEnd(leagueYear.getYearEnd());
                }

                return existingLeagueYear;
            })
            .map(leagueYearRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, leagueYear.getId().toString())
        );
    }

    /**
     * {@code GET  /league-years} : get all the leagueYears.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of leagueYears in body.
     */
    @GetMapping("/league-years")
    public List<LeagueYear> getAllLeagueYears() {
        log.debug("REST request to get all LeagueYears");
        return leagueYearRepository.findAll();
    }

    /**
     * {@code GET  /league-years/:id} : get the "id" leagueYear.
     *
     * @param id the id of the leagueYear to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the leagueYear, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/league-years/{id}")
    public ResponseEntity<LeagueYear> getLeagueYear(@PathVariable Long id) {
        log.debug("REST request to get LeagueYear : {}", id);
        Optional<LeagueYear> leagueYear = leagueYearRepository.findById(id);
        Hibernate.initialize(leagueYear.get().getSemesters());
        return ResponseUtil.wrapOrNotFound(leagueYear);
    }

    /**
     * {@code DELETE  /league-years/:id} : delete the "id" leagueYear.
     *
     * @param id the id of the leagueYear to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/league-years/{id}")
    public ResponseEntity<Void> deleteLeagueYear(@PathVariable Long id) {
        log.debug("REST request to delete LeagueYear : {}", id);
        leagueYearRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
