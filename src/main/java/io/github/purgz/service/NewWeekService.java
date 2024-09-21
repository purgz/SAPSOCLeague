package io.github.purgz.service;

import io.github.purgz.domain.*;
import io.github.purgz.domain.NewWeekDataModel.Match;
import io.github.purgz.domain.NewWeekDataModel.NewRound;
import io.github.purgz.domain.NewWeekDataModel.NewWeekData;
import io.github.purgz.domain.enumeration.GameEnding;
import io.github.purgz.repository.*;
import java.time.LocalDate;
import java.util.Objects;
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

    private final SemesterScoreRepository semesterScoreRepository;

    private final EloWorker eloWorker;

    private Long semId;

    @Autowired
    public NewWeekService(
        EntityManager entityManager,
        SemesterRepository semesterRepository,
        WeekRepository weekRepository,
        RoundRepository roundRepository,
        GameResultRepository gameResultRepository,
        LeaguePlayerRepository leaguePlayerRepository,
        SemesterScoreRepository semesterScoreRepository,
        EloWorker eloWorker
    ) {
        this.entityManager = entityManager;
        this.semesterRepository = semesterRepository;
        this.weekRepository = weekRepository;
        this.roundRepository = roundRepository;
        this.gameResultRepository = gameResultRepository;
        this.leaguePlayerRepository = leaguePlayerRepository;
        this.semesterScoreRepository = semesterScoreRepository;
        this.eloWorker = eloWorker;
    }

    public Week generateNewWeekData(Semester semester, NewWeekData newWeekData) {
        Hibernate.initialize(semester);
        entityManager.refresh(semester);

        this.semId = semester.getId();

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
            });

        Optional<LeaguePlayer> byeOptional = this.leaguePlayerRepository.findById(Long.valueOf(newRound.getBye().getId()));
        if (byeOptional.isPresent()) {
            SemesterScore byeSemesterScore = null;
            SemesterScore[] semesterScoresBye = byeOptional.get().getSemesterScores().toArray(new SemesterScore[0]);

            for (int i = 0; i < semesterScoresBye.length; i++) {
                if (semesterScoresBye[i].getSemester().getId() == this.semId) {
                    byeSemesterScore = semesterScoresBye[i];

                    byeSemesterScore.setScore(byeSemesterScore.getScore() + 0.5f);
                }
            }
        }

        return round;
    }

    private GameResult processGameResult(Match match, Round round) {
        //need to get the players and update their scores here.

        if (match == null) {
            return null;
        }

        Optional<LeaguePlayer> p1Optional = this.leaguePlayerRepository.findById(match.getPlayer1().getId());
        Optional<LeaguePlayer> p2Optional = this.leaguePlayerRepository.findById(match.getPlayer2().getId());

        //// TODO: 11/08/2024 handle byes here - need to find which player is selected

        if (p1Optional.isEmpty() || p2Optional.isEmpty()) {
            return null;
        }

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
        updatePlayerScores(gameResult.getPlayer1(), gameResult.getPlayer2(), gameResult.getp1Score(), gameResult.getp2Score());
        return gameResult;
    }

    private void updatePlayerScores(LeaguePlayer player1, LeaguePlayer player2, float p1Score, float p2Score) {
        SemesterScore p1SemesterScore = null;
        SemesterScore p2SemesterScore = null;

        SemesterScore[] semesterScoresP1 = player1.getSemesterScores().toArray(new SemesterScore[0]);
        SemesterScore[] semesterScoresP2 = player2.getSemesterScores().toArray(new SemesterScore[0]);

        for (int i = 0; i < semesterScoresP1.length; i++) {
            if (semesterScoresP1[i].getSemester().getId() == this.semId) {
                p1SemesterScore = semesterScoresP1[i];
            }
        }
        for (int i = 0; i < semesterScoresP2.length; i++) {
            if (Objects.equals(semesterScoresP2[i].getSemester().getId(), this.semId)) {
                p2SemesterScore = semesterScoresP2[i];
            }
        }

        if (p1Score == 1f) {
            updateEloAndScores(player2, player1, p2SemesterScore, p1SemesterScore);
            player1.setWins(player1.getWins() + 1);
            player2.setLosses(player2.getLosses() + 1);
        } else if (p2Score == 1f) {
            player2.setWins(player2.getWins() + 1);
            player1.setLosses(player1.getLosses() + 1);
            updateEloAndScores(player1, player2, p1SemesterScore, p2SemesterScore);
        }
    }

    private void updateEloAndScores(
        LeaguePlayer player1,
        LeaguePlayer player2,
        SemesterScore p1SemesterScore,
        SemesterScore p2SemesterScore
    ) {
        updateELO(player2, player1);
        if (p2SemesterScore != null) {
            p2SemesterScore.setScore(p2SemesterScore.getScore() + 1f);
            if (p1SemesterScore != null) {
                if (p2SemesterScore.getScore() < p1SemesterScore.getScore()) {
                    p2SemesterScore.setScore(
                        p2SemesterScore.getScore() + calculateExtraPoints(p2SemesterScore.getScore(), p1SemesterScore.getScore())
                    );
                }
            }
        }
    }

    private float calculateExtraPoints(float p1, float p2) {
        float diff = p2 - p1;
        return diff * 0.2f;
    }

    private void updateELO(LeaguePlayer playerA, LeaguePlayer playerB) {
        System.out.println("PREVIOUS ELO");
        System.out.println(playerA.getEloRating());
        System.out.println(playerB.getEloRating());
        this.eloWorker.updatePlayers(playerA, playerB);
        System.out.println("ELO UPDATED NEW RATINGS:");
        System.out.println(playerA.getEloRating());
        System.out.println(playerB.getEloRating());
    }
}
