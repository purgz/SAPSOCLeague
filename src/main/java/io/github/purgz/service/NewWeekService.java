package io.github.purgz.service;

import io.github.purgz.domain.*;
import io.github.purgz.domain.NewWeekDataModel.Match;
import io.github.purgz.domain.NewWeekDataModel.NewRound;
import io.github.purgz.domain.NewWeekDataModel.NewWeekData;
import io.github.purgz.domain.enumeration.GameEnding;
import io.github.purgz.repository.*;
import java.time.LocalDate;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import javax.persistence.EntityManager;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NewWeekService {

    private final EntityManager entityManager;
    private final SemesterRepository semesterRepository;
    private final WeekRepository weekRepository;

    private final RoundRepository roundRepository;

    private final GameResultRepository gameResultRepository;
    private final LeaguePlayerRepository leaguePlayerRepository;

    @Autowired
    public NewWeekService(
        EntityManager entityManager,
        SemesterRepository semesterRepository,
        WeekRepository weekRepository,
        RoundRepository roundRepository,
        GameResultRepository gameResultRepository,
        LeaguePlayerRepository leaguePlayerRepository
    ) {
        this.entityManager = entityManager;
        this.semesterRepository = semesterRepository;
        this.weekRepository = weekRepository;
        this.roundRepository = roundRepository;
        this.gameResultRepository = gameResultRepository;
        this.leaguePlayerRepository = leaguePlayerRepository;
    }

    public Week generateNewWeekData(Semester semester, NewWeekData newWeekData) {
        Hibernate.initialize(semester);
        entityManager.refresh(semester);

        int weekNum = semester.getWeeks().size() + 1;
        Week newWeek = new Week();
        newWeek.setWeekNum(weekNum);
        LocalDate date = LocalDate.now();
        newWeek.setDate(date);
        newWeek.setSemester(semester);
        weekRepository.save(newWeek);
        Hibernate.initialize(newWeek);

        AtomicInteger count = new AtomicInteger(1);
        newWeekData
            .getRounds()
            .forEach(newRound -> {
                Round round = processRound(newRound, newWeek, count);
                count.getAndIncrement();
            });

        return null;
    }

    private Round processRound(NewRound newRound, Week week, AtomicInteger count) {
        //do something

        if (newRound == null) {
            return null;
        }

        Round round = new Round();
        round.setWeek(week);
        round.setRoundNo(count.get());
        roundRepository.save(round);
        week.addRounds(round);

        newRound
            .getMatches()
            .forEach(match -> {
                //process the matches.
                GameResult gameResult = processGameResult(match, round);
                System.out.println("GAME RESULT");
                System.out.println(gameResult);
            });

        return round;
    }

    private GameResult processGameResult(Match match, Round round) {
        //need to get the players and update their scores here.

        System.out.println("MARK 1");

        if (match == null) {
            return null;
        }

        Optional<LeaguePlayer> p1Optional = this.leaguePlayerRepository.findById(match.getPlayer1().getId());
        Optional<LeaguePlayer> p2Optional = this.leaguePlayerRepository.findById(match.getPlayer2().getId());

        //// TODO: 11/08/2024 handle byes here - need to find which player is selected

        if (p1Optional.isEmpty() || p2Optional.isEmpty()) {
            return null;
        }

        System.out.println("MARK 2");

        GameResult gameResult = new GameResult();
        gameResult.setPlayer1(p1Optional.get());
        gameResult.setPlayer2(p2Optional.get());
        gameResult.setRound(round);
        gameResult.setp1Score(match.getP1Score());
        gameResult.setp2Score(match.getP2Score());

        if (match.getGameEnding() != null) {
            switch (match.getGameEnding()) {
                case "DISH":
                    gameResult.setGameEnding(GameEnding.DISH);
                    break;
                case "REVERSE_DISH":
                    gameResult.setGameEnding(GameEnding.REVERSE_DISH);
                    break;
                default:
                    break;
            }
        }

        gameResultRepository.save(gameResult);
        return gameResult;
    }
}
