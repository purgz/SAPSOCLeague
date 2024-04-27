package io.github.purgz.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Week.
 */
@Entity
@Table(name = "week")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Week implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Column(name = "week_num", nullable = false)
    private Integer weekNum;

    @Column(name = "date")
    private LocalDate date;

    @ManyToOne
    @JsonIgnoreProperties(value = { "year", "players", "weeks", "semesterScores" }, allowSetters = true)
    private Semester semester;

    @OneToMany(mappedBy = "week")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "week", "roundResults" }, allowSetters = true)
    private Set<Round> rounds = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Week id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getWeekNum() {
        return this.weekNum;
    }

    public Week weekNum(Integer weekNum) {
        this.setWeekNum(weekNum);
        return this;
    }

    public void setWeekNum(Integer weekNum) {
        this.weekNum = weekNum;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Week date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Semester getSemester() {
        return this.semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }

    public Week semester(Semester semester) {
        this.setSemester(semester);
        return this;
    }

    public Set<Round> getRounds() {
        return this.rounds;
    }

    public void setRounds(Set<Round> rounds) {
        if (this.rounds != null) {
            this.rounds.forEach(i -> i.setWeek(null));
        }
        if (rounds != null) {
            rounds.forEach(i -> i.setWeek(this));
        }
        this.rounds = rounds;
    }

    public Week rounds(Set<Round> rounds) {
        this.setRounds(rounds);
        return this;
    }

    public Week addRounds(Round round) {
        this.rounds.add(round);
        round.setWeek(this);
        return this;
    }

    public Week removeRounds(Round round) {
        this.rounds.remove(round);
        round.setWeek(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Week)) {
            return false;
        }
        return id != null && id.equals(((Week) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Week{" +
            "id=" + getId() +
            ", weekNum=" + getWeekNum() +
            ", date='" + getDate() + "'" +
            "}";
    }
}
