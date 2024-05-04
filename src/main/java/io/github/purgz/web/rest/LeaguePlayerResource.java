package io.github.purgz.web.rest;

import io.github.purgz.domain.LeaguePlayer;
import io.github.purgz.domain.LeagueYear;
import io.github.purgz.domain.Semester;
import io.github.purgz.repository.LeaguePlayerRepository;
import io.github.purgz.repository.LeagueYearRepository;
import io.github.purgz.repository.SemesterRepository;
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
 * REST controller for managing {@link io.github.purgz.domain.LeaguePlayer}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class LeaguePlayerResource {

    private final Logger log = LoggerFactory.getLogger(LeaguePlayerResource.class);

    private static final String ENTITY_NAME = "leaguePlayer";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LeaguePlayerRepository leaguePlayerRepository;
    private final SemesterRepository semesterRepository;
    private final LeagueYearRepository leagueYearRepository;

    public LeaguePlayerResource(
        LeaguePlayerRepository leaguePlayerRepository,
        SemesterRepository semesterRepository,
        LeagueYearRepository leagueYearRepository
    ) {
        this.leaguePlayerRepository = leaguePlayerRepository;
        this.semesterRepository = semesterRepository;
        this.leagueYearRepository = leagueYearRepository;
    }

    /**
     * {@code POST  /league-players} : Create a new leaguePlayer.
     *
     * @param leaguePlayer the leaguePlayer to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new leaguePlayer, or with status {@code 400 (Bad Request)} if the leaguePlayer has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/league-players")
    public ResponseEntity<LeaguePlayer> createLeaguePlayer(@Valid @RequestBody LeaguePlayer leaguePlayer) throws URISyntaxException {
        log.debug("REST request to save LeaguePlayer : {}", leaguePlayer);
        if (leaguePlayer.getId() != null) {
            throw new BadRequestAlertException("A new leaguePlayer cannot already have an ID", ENTITY_NAME, "idexists");
        }
        LeaguePlayer result = leaguePlayerRepository.save(leaguePlayer);
        return ResponseEntity
            .created(new URI("/api/league-players/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /league-players/:id} : Updates an existing leaguePlayer.
     *
     * @param id the id of the leaguePlayer to save.
     * @param leaguePlayer the leaguePlayer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leaguePlayer,
     * or with status {@code 400 (Bad Request)} if the leaguePlayer is not valid,
     * or with status {@code 500 (Internal Server Error)} if the leaguePlayer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/league-players/{id}")
    public ResponseEntity<LeaguePlayer> updateLeaguePlayer(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LeaguePlayer leaguePlayer
    ) throws URISyntaxException {
        log.debug("REST request to update LeaguePlayer : {}, {}", id, leaguePlayer);
        if (leaguePlayer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leaguePlayer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leaguePlayerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        LeaguePlayer result = leaguePlayerRepository.save(leaguePlayer);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, leaguePlayer.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /league-players/:id} : Partial updates given fields of an existing leaguePlayer, field will ignore if it is null
     *
     * @param id the id of the leaguePlayer to save.
     * @param leaguePlayer the leaguePlayer to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated leaguePlayer,
     * or with status {@code 400 (Bad Request)} if the leaguePlayer is not valid,
     * or with status {@code 404 (Not Found)} if the leaguePlayer is not found,
     * or with status {@code 500 (Internal Server Error)} if the leaguePlayer couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/league-players/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LeaguePlayer> partialUpdateLeaguePlayer(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LeaguePlayer leaguePlayer
    ) throws URISyntaxException {
        log.debug("REST request to partial update LeaguePlayer partially : {}, {}", id, leaguePlayer);
        if (leaguePlayer.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, leaguePlayer.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!leaguePlayerRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LeaguePlayer> result = leaguePlayerRepository
            .findById(leaguePlayer.getId())
            .map(existingLeaguePlayer -> {
                if (leaguePlayer.getFirstName() != null) {
                    existingLeaguePlayer.setFirstName(leaguePlayer.getFirstName());
                }
                if (leaguePlayer.getLastName() != null) {
                    existingLeaguePlayer.setLastName(leaguePlayer.getLastName());
                }
                if (leaguePlayer.getWins() != null) {
                    existingLeaguePlayer.setWins(leaguePlayer.getWins());
                }
                if (leaguePlayer.getLosses() != null) {
                    existingLeaguePlayer.setLosses(leaguePlayer.getLosses());
                }
                if (leaguePlayer.getEloRating() != null) {
                    existingLeaguePlayer.setEloRating(leaguePlayer.getEloRating());
                }
                if (leaguePlayer.getDishes() != null) {
                    existingLeaguePlayer.setDishes(leaguePlayer.getDishes());
                }
                if (leaguePlayer.getrDishes() != null) {
                    existingLeaguePlayer.setrDishes(leaguePlayer.getrDishes());
                }
                if (leaguePlayer.getPhoto() != null) {
                    existingLeaguePlayer.setPhoto(leaguePlayer.getPhoto());
                }
                if (leaguePlayer.getPhotoContentType() != null) {
                    existingLeaguePlayer.setPhotoContentType(leaguePlayer.getPhotoContentType());
                }

                return existingLeaguePlayer;
            })
            .map(leaguePlayerRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, leaguePlayer.getId().toString())
        );
    }

    /**
     * {@code GET  /league-players} : get all the leaguePlayers.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of leaguePlayers in body.
     */
    @GetMapping("/league-players")
    public List<LeaguePlayer> getAllLeaguePlayers(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all LeaguePlayers");
        if (eagerload) {
            return leaguePlayerRepository.findAllWithEagerRelationships();
        } else {
            return leaguePlayerRepository.findAll();
        }
    }

    /**
     * {@code GET  /league-players/:id} : get the "id" leaguePlayer.
     *
     * @param id the id of the leaguePlayer to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the leaguePlayer, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/league-players/{id}")
    public ResponseEntity<LeaguePlayer> getLeaguePlayer(@PathVariable Long id) {
        log.debug("REST request to get LeaguePlayer : {}", id);
        Optional<LeaguePlayer> leaguePlayer = leaguePlayerRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(leaguePlayer);
    }

    /**
     * {@code DELETE  /league-players/:id} : delete the "id" leaguePlayer.
     *
     * @param id the id of the leaguePlayer to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/league-players/{id}")
    public ResponseEntity<Void> deleteLeaguePlayer(@PathVariable Long id) {
        log.debug("REST request to delete LeaguePlayer : {}", id);
        leaguePlayerRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/league-players/semester/{id}")
    public ResponseEntity<Set<LeaguePlayer>> getBySem(@PathVariable Long id) {
        Optional<Semester> semester = semesterRepository.findById(id);

        if (!semester.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(semester.get().getPlayers(), HttpStatus.OK);
    }

    @GetMapping("/league-players/year/{id}")
    public ResponseEntity<Set<LeaguePlayer>> getbyYear(@PathVariable Long id) {
        Optional<LeagueYear> leagueYear = leagueYearRepository.findById(id);

        if (!leagueYear.isPresent()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Set<LeaguePlayer> leaguePlayers = new HashSet<>();

        //rework into a service probably.

        Hibernate.initialize(leagueYear.get().getSemesters());

        leagueYear
            .get()
            .getSemesters()
            .forEach(semester -> {
                leaguePlayers.addAll(semester.getPlayers());
            });

        return new ResponseEntity<>(leaguePlayers, HttpStatus.OK);
    }
}
