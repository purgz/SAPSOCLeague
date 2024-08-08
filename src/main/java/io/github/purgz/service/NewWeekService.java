package io.github.purgz.service;

import io.github.purgz.domain.NewWeekDataModel.NewRound;
import io.github.purgz.domain.NewWeekDataModel.NewWeekData;
import io.github.purgz.domain.Round;
import io.github.purgz.domain.Semester;
import io.github.purgz.domain.Week;
import io.github.purgz.repository.SemesterRepository;
import io.github.purgz.repository.WeekRepository;
import java.time.LocalDate;
import javax.persistence.EntityManager;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NewWeekService {

    private final EntityManager entityManager;
    private final SemesterRepository semesterRepository;
    private final WeekRepository weekRepository;

    @Autowired
    public NewWeekService(EntityManager entityManager, SemesterRepository semesterRepository, WeekRepository weekRepository) {
        this.entityManager = entityManager;

        this.semesterRepository = semesterRepository;
        this.weekRepository = weekRepository;
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

        newWeekData
            .getRounds()
            .forEach(newRound -> {
                Round round = processRound(newRound);

                if (round != null) {
                    newWeek.addRounds(round);
                }
            });

        return null;
    }

    public Round processRound(NewRound round) {
        //do something

        return null;
    }
}
