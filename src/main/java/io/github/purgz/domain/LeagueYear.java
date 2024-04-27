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
 * A LeagueYear.
 */
@Entity
@Table(name = "league_year")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LeagueYear implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "year_start", nullable = false)
    private Integer yearStart;

    @Column(name = "year_end")
    private Integer yearEnd;

    @OneToMany(mappedBy = "year")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "year", "players", "weeks", "semesterScores" }, allowSetters = true)
    private Set<Semester> semesters = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LeagueYear id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getYearStart() {
        return this.yearStart;
    }

    public LeagueYear yearStart(Integer yearStart) {
        this.setYearStart(yearStart);
        return this;
    }

    public void setYearStart(Integer yearStart) {
        this.yearStart = yearStart;
    }

    public Integer getYearEnd() {
        return this.yearEnd;
    }

    public LeagueYear yearEnd(Integer yearEnd) {
        this.setYearEnd(yearEnd);
        return this;
    }

    public void setYearEnd(Integer yearEnd) {
        this.yearEnd = yearEnd;
    }

    public Set<Semester> getSemesters() {
        return this.semesters;
    }

    public void setSemesters(Set<Semester> semesters) {
        if (this.semesters != null) {
            this.semesters.forEach(i -> i.setYear(null));
        }
        if (semesters != null) {
            semesters.forEach(i -> i.setYear(this));
        }
        this.semesters = semesters;
    }

    public LeagueYear semesters(Set<Semester> semesters) {
        this.setSemesters(semesters);
        return this;
    }

    public LeagueYear addSemesters(Semester semester) {
        this.semesters.add(semester);
        semester.setYear(this);
        return this;
    }

    public LeagueYear removeSemesters(Semester semester) {
        this.semesters.remove(semester);
        semester.setYear(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LeagueYear)) {
            return false;
        }
        return id != null && id.equals(((LeagueYear) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LeagueYear{" +
            "id=" + getId() +
            ", yearStart=" + getYearStart() +
            ", yearEnd=" + getYearEnd() +
            "}";
    }
}
