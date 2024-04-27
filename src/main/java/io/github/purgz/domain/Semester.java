package io.github.purgz.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Semester.
 */
@Entity
@Table(name = "semester")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Semester implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Column(name = "semester_num", nullable = false)
    private Integer semesterNum;

    @ManyToOne
    @JsonIgnoreProperties(value = { "semesters" }, allowSetters = true)
    private LeagueYear year;

    @OneToMany(mappedBy = "semester")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "semester", "semesterScores" }, allowSetters = true)
    private Set<LeaguePlayer> players = new HashSet<>();

    @OneToMany(mappedBy = "semester")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "semester", "rounds" }, allowSetters = true)
    private Set<Week> weeks = new HashSet<>();

    @OneToMany(mappedBy = "semester")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "semester", "player" }, allowSetters = true)
    private Set<SemesterScore> semesterScores = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Semester id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSemesterNum() {
        return this.semesterNum;
    }

    public Semester semesterNum(Integer semesterNum) {
        this.setSemesterNum(semesterNum);
        return this;
    }

    public void setSemesterNum(Integer semesterNum) {
        this.semesterNum = semesterNum;
    }

    public LeagueYear getYear() {
        return this.year;
    }

    public void setYear(LeagueYear leagueYear) {
        this.year = leagueYear;
    }

    public Semester year(LeagueYear leagueYear) {
        this.setYear(leagueYear);
        return this;
    }

    public Set<LeaguePlayer> getPlayers() {
        return this.players;
    }

    public void setPlayers(Set<LeaguePlayer> leaguePlayers) {
        if (this.players != null) {
            this.players.forEach(i -> i.setSemester(null));
        }
        if (leaguePlayers != null) {
            leaguePlayers.forEach(i -> i.setSemester(this));
        }
        this.players = leaguePlayers;
    }

    public Semester players(Set<LeaguePlayer> leaguePlayers) {
        this.setPlayers(leaguePlayers);
        return this;
    }

    public Semester addPlayers(LeaguePlayer leaguePlayer) {
        this.players.add(leaguePlayer);
        leaguePlayer.setSemester(this);
        return this;
    }

    public Semester removePlayers(LeaguePlayer leaguePlayer) {
        this.players.remove(leaguePlayer);
        leaguePlayer.setSemester(null);
        return this;
    }

    public Set<Week> getWeeks() {
        return this.weeks;
    }

    public void setWeeks(Set<Week> weeks) {
        if (this.weeks != null) {
            this.weeks.forEach(i -> i.setSemester(null));
        }
        if (weeks != null) {
            weeks.forEach(i -> i.setSemester(this));
        }
        this.weeks = weeks;
    }

    public Semester weeks(Set<Week> weeks) {
        this.setWeeks(weeks);
        return this;
    }

    public Semester addWeeks(Week week) {
        this.weeks.add(week);
        week.setSemester(this);
        return this;
    }

    public Semester removeWeeks(Week week) {
        this.weeks.remove(week);
        week.setSemester(null);
        return this;
    }

    public Set<SemesterScore> getSemesterScores() {
        return this.semesterScores;
    }

    public void setSemesterScores(Set<SemesterScore> semesterScores) {
        if (this.semesterScores != null) {
            this.semesterScores.forEach(i -> i.setSemester(null));
        }
        if (semesterScores != null) {
            semesterScores.forEach(i -> i.setSemester(this));
        }
        this.semesterScores = semesterScores;
    }

    public Semester semesterScores(Set<SemesterScore> semesterScores) {
        this.setSemesterScores(semesterScores);
        return this;
    }

    public Semester addSemesterScores(SemesterScore semesterScore) {
        this.semesterScores.add(semesterScore);
        semesterScore.setSemester(this);
        return this;
    }

    public Semester removeSemesterScores(SemesterScore semesterScore) {
        this.semesterScores.remove(semesterScore);
        semesterScore.setSemester(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Semester)) {
            return false;
        }
        return id != null && id.equals(((Semester) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Semester{" +
            "id=" + getId() +
            ", semesterNum=" + getSemesterNum() +
            "}";
    }
}
