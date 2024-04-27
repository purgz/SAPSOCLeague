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
 * A Round.
 */
@Entity
@Table(name = "round")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Round implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Min(value = 0)
    @Column(name = "round_no", nullable = false)
    private Integer roundNo;

    @ManyToOne
    @JsonIgnoreProperties(value = { "semester", "rounds" }, allowSetters = true)
    private Week week;

    @OneToMany(mappedBy = "round")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "player1", "player2", "round" }, allowSetters = true)
    private Set<GameResult> roundResults = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Round id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRoundNo() {
        return this.roundNo;
    }

    public Round roundNo(Integer roundNo) {
        this.setRoundNo(roundNo);
        return this;
    }

    public void setRoundNo(Integer roundNo) {
        this.roundNo = roundNo;
    }

    public Week getWeek() {
        return this.week;
    }

    public void setWeek(Week week) {
        this.week = week;
    }

    public Round week(Week week) {
        this.setWeek(week);
        return this;
    }

    public Set<GameResult> getRoundResults() {
        return this.roundResults;
    }

    public void setRoundResults(Set<GameResult> gameResults) {
        if (this.roundResults != null) {
            this.roundResults.forEach(i -> i.setRound(null));
        }
        if (gameResults != null) {
            gameResults.forEach(i -> i.setRound(this));
        }
        this.roundResults = gameResults;
    }

    public Round roundResults(Set<GameResult> gameResults) {
        this.setRoundResults(gameResults);
        return this;
    }

    public Round addRoundResults(GameResult gameResult) {
        this.roundResults.add(gameResult);
        gameResult.setRound(this);
        return this;
    }

    public Round removeRoundResults(GameResult gameResult) {
        this.roundResults.remove(gameResult);
        gameResult.setRound(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Round)) {
            return false;
        }
        return id != null && id.equals(((Round) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Round{" +
            "id=" + getId() +
            ", roundNo=" + getRoundNo() +
            "}";
    }
}
