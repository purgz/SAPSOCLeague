package io.github.purgz.service;

import io.github.purgz.domain.GameResult;
import io.github.purgz.domain.NewWeekDataModel.Match;
import io.github.purgz.domain.NewWeekDataModel.NewRound;
import io.github.purgz.domain.NewWeekDataModel.NewWeekData;
import io.github.purgz.domain.Round;
import io.github.purgz.domain.Semester;
import io.github.purgz.domain.Week;
import io.github.purgz.repository.RoundRepository;
import io.github.purgz.repository.SemesterRepository;
import io.github.purgz.repository.WeekRepository;
import java.time.LocalDate;
import java.util.Set;
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

    @Autowired
    public NewWeekService(
        EntityManager entityManager,
        SemesterRepository semesterRepository,
        WeekRepository weekRepository,
        RoundRepository roundRepository
    ) {
        this.entityManager = entityManager;

        this.semesterRepository = semesterRepository;
        this.weekRepository = weekRepository;
        this.roundRepository = roundRepository;
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
                GameResult gameResults = processGameResult(match, round);
            });

        return round;
    }

    private GameResult processGameResult(Match match, Round round) {
        return null;
    }
}
