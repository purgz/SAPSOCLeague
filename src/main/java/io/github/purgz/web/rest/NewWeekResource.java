package io.github.purgz.web.rest;

import io.github.purgz.domain.NewWeekDataModel.*;
import io.github.purgz.domain.Semester;
import io.github.purgz.domain.Week;
import io.github.purgz.repository.SemesterRepository;
import io.github.purgz.repository.WeekRepository;
import io.github.purgz.service.NewWeekService;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.Optional;
import javax.persistence.EntityManager;
import javax.validation.Valid;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@Transactional
public class NewWeekResource {

    SemesterRepository semesterRepository;

    WeekRepository weekRepository;

    EntityManager entityManager;

    private final NewWeekService newWeekService;

    @Autowired
    public NewWeekResource(
        SemesterRepository semesterRepository,
        WeekRepository weekRepository,
        EntityManager entityManager,
        NewWeekService newWeekService
    ) {
        this.semesterRepository = semesterRepository;
        this.weekRepository = weekRepository;
        this.entityManager = entityManager;
        this.newWeekService = newWeekService;
    }

    @PostMapping("/new-week/{semesterId}")
    public ResponseEntity<String> createNewWeek(@Valid @RequestBody NewWeekData newWeekData, @PathVariable Long semesterId)
        throws URISyntaxException {
        System.out.println("New week data");
        System.out.println(newWeekData);
        System.out.println(newWeekData.getRounds());

        //todo create the related domain models and persist using hibernate

        //find the semester for the new week
        Optional<Semester> semesterOptional = semesterRepository.findById(semesterId);

        if (semesterOptional.isEmpty()) {
            return new ResponseEntity<>("Failed to find requested semester", HttpStatus.NOT_FOUND);
        }

        newWeekService.generateNewWeekData(semesterOptional.get(), newWeekData);

        return new ResponseEntity<>("Successfully uploaded a week", HttpStatus.OK);
    }
}
