package io.github.purgz.domain;

import io.github.purgz.domain.enumeration.GameEnding;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GameResult.
 */
@Entity
@Table(name = "game_result")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GameResult implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "game_ending")
    private GameEnding gameEnding;

    @DecimalMin(value = "0")
    @Column(name = "p_1_score")
    private Float p1Score;

    @DecimalMin(value = "0")
    @Column(name = "p_2_score")
    private Float p2Score;

    @ManyToOne
    private LeaguePlayer player1;

    @ManyToOne
    private LeaguePlayer player2;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GameResult id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GameEnding getGameEnding() {
        return this.gameEnding;
    }

    public GameResult gameEnding(GameEnding gameEnding) {
        this.setGameEnding(gameEnding);
        return this;
    }

    public void setGameEnding(GameEnding gameEnding) {
        this.gameEnding = gameEnding;
    }

    public Float getp1Score() {
        return this.p1Score;
    }

    public GameResult p1Score(Float p1Score) {
        this.setp1Score(p1Score);
        return this;
    }

    public void setp1Score(Float p1Score) {
        this.p1Score = p1Score;
    }

    public Float getp2Score() {
        return this.p2Score;
    }

    public GameResult p2Score(Float p2Score) {
        this.setp2Score(p2Score);
        return this;
    }

    public void setp2Score(Float p2Score) {
        this.p2Score = p2Score;
    }

    public LeaguePlayer getPlayer1() {
        return this.player1;
    }

    public void setPlayer1(LeaguePlayer leaguePlayer) {
        this.player1 = leaguePlayer;
    }

    public GameResult player1(LeaguePlayer leaguePlayer) {
        this.setPlayer1(leaguePlayer);
        return this;
    }

    public LeaguePlayer getPlayer2() {
        return this.player2;
    }

    public void setPlayer2(LeaguePlayer leaguePlayer) {
        this.player2 = leaguePlayer;
    }

    public GameResult player2(LeaguePlayer leaguePlayer) {
        this.setPlayer2(leaguePlayer);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GameResult)) {
            return false;
        }
        return id != null && id.equals(((GameResult) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GameResult{" +
            "id=" + getId() +
            ", gameEnding='" + getGameEnding() + "'" +
            ", p1Score=" + getp1Score() +
            ", p2Score=" + getp2Score() +
            "}";
    }
}
