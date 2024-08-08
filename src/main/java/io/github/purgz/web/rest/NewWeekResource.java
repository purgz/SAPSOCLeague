package io.github.purgz.web.rest;

import io.github.purgz.domain.LeagueYear;
import io.github.purgz.domain.NewWeekDataModel.*;
import io.github.purgz.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import javax.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;

@RestController
@RequestMapping("/api")
@Transactional
public class NewWeekResource {

    @PostMapping("/new-week")
    public ResponseEntity<String> createNewWeek(@Valid @RequestBody NewWeekData newWeekData) throws URISyntaxException {
        System.out.println("New week data");
        System.out.println(newWeekData);
        System.out.println(newWeekData.getRounds());

        return new ResponseEntity<>("Successfully uploaded a week", HttpStatus.OK);
    }
}
