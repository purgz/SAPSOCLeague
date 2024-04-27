package io.github.purgz.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SemesterScore.
 */
@Entity
@Table(name = "semester_score")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SemesterScore implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Min(value = 0)
    @Column(name = "score")
    private Integer score;

    @ManyToOne
    @JsonIgnoreProperties(value = { "year", "players", "weeks", "semesterScores" }, allowSetters = true)
    private Semester semester;

    @ManyToOne
    @JsonIgnoreProperties(value = { "semester", "semesterScores" }, allowSetters = true)
    private LeaguePlayer player;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SemesterScore id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getScore() {
        return this.score;
    }

    public SemesterScore score(Integer score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Semester getSemester() {
        return this.semester;
    }

    public void setSemester(Semester semester) {
        this.semester = semester;
    }

    public SemesterScore semester(Semester semester) {
        this.setSemester(semester);
        return this;
    }

    public LeaguePlayer getPlayer() {
        return this.player;
    }

    public void setPlayer(LeaguePlayer leaguePlayer) {
        this.player = leaguePlayer;
    }

    public SemesterScore player(LeaguePlayer leaguePlayer) {
        this.setPlayer(leaguePlayer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SemesterScore)) {
            return false;
        }
        return id != null && id.equals(((SemesterScore) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SemesterScore{" +
            "id=" + getId() +
            ", score=" + getScore() +
            "}";
    }
}
