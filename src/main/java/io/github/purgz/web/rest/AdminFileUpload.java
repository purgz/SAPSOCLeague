package io.github.purgz.web.rest;

import io.github.purgz.domain.LeaguePlayer;
import io.github.purgz.domain.Semester;
import io.github.purgz.domain.SemesterScore;
import io.github.purgz.repository.LeaguePlayerRepository;
import io.github.purgz.repository.SemesterRepository;
import io.github.purgz.repository.SemesterScoreRepository;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import javax.persistence.EntityManager;
import org.hibernate.Hibernate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Transactional
@RequestMapping("/api/admin")
public class AdminFileUpload {

    private final SemesterRepository semesterRepository;
    private final LeaguePlayerRepository leaguePlayerRepository;
    private final SemesterScoreRepository semesterScoreRepository;

    private final EntityManager entityManager;

    public AdminFileUpload(
        SemesterRepository semesterRepository,
        LeaguePlayerRepository leaguePlayerRepository,
        SemesterScoreRepository semesterScoreRepository,
        EntityManager entityManager
    ) {
        this.semesterRepository = semesterRepository;
        this.leaguePlayerRepository = leaguePlayerRepository;
        this.semesterScoreRepository = semesterScoreRepository;
        this.entityManager = entityManager;
    }

    //this method allows to upload data <player - semester score> to a particular semester
    //since this just does bulk data it is not appropriate for general use
    //used to upload historical data where round and individual match information is not accessible.
    @PostMapping("/upload-score-csv")
    public ResponseEntity<String> uploadScoreCsv(@RequestParam("file") MultipartFile file, @RequestParam("semester") Long id) {
        try {
            // TODO: 05/05/2024
            //assumes there is already a valid semester inside a valid year object.
            //Create new player with the player name, unless there is already a player with that name, then just use them
            //Given a semester ID, find that semester, add the player, create semester score, then add score to semester.

            Optional<Semester> semesterOptional = semesterRepository.findById(id);

            if (semesterOptional.isEmpty()) {
                return new ResponseEntity<>("invalid semester id", HttpStatus.BAD_REQUEST);
            }

            BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()));

            String line;
            while ((line = br.readLine()) != null) {
                line = line.replace("\"", "");
                String[] values = line.split(",");

                Optional<LeaguePlayer> leaguePlayer = leaguePlayerRepository.findAllByFirstNameAndLastName(values[0], values[1]);
                if (leaguePlayer.isPresent()) {
                    //create the score for this user

                    SemesterScore semesterScore = new SemesterScore();
                    semesterScore.setScore(Float.parseFloat(values[2]));
                    semesterScore.setPlayer(leaguePlayer.get());
                    semesterScore.setSemester(semesterOptional.get());
                    semesterScoreRepository.save(semesterScore);
                    System.out.println(semesterScore);

                    Hibernate.initialize(leaguePlayer.get().getSemesters());
                    leaguePlayer.get().getSemesters().add(semesterOptional.get());
                    leaguePlayerRepository.save(leaguePlayer.get());
                    //add score to player and save

                } else {
                    //create a new user and the score

                    LeaguePlayer newPlayer = new LeaguePlayer();
                    newPlayer.setFirstName(values[0]);
                    newPlayer.setLastName(values[1]);
                    newPlayer.setLosses(0);
                    newPlayer.setWins(0);
                    newPlayer.setEloRating(1000f);

                    leaguePlayerRepository.save(newPlayer);

                    SemesterScore semesterScore = new SemesterScore();
                    semesterScore.setScore(Float.parseFloat(values[2]));
                    semesterScore.setPlayer(newPlayer);
                    semesterScore.setSemester(semesterOptional.get());
                    semesterScoreRepository.save(semesterScore);

                    Hibernate.initialize(newPlayer.getSemesters());
                    newPlayer.getSemesters().add(semesterOptional.get());
                    leaguePlayerRepository.save(newPlayer);
                }
            }
            br.close();
        } catch (Exception e) {
            System.out.println(e);
            return new ResponseEntity<>("Failed to upload file", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>("Added scores", HttpStatus.ACCEPTED);
    }
}
