package io.github.purgz.domain;

import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A LeaguePlayer.
 */
@Entity
@Table(name = "league_player")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LeaguePlayer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    @Column(name = "first_name", length = 50, nullable = false)
    private String firstName;

    @Size(min = 1, max = 50)
    @Column(name = "last_name", length = 50)
    private String lastName;

    @NotNull
    @Min(value = 0)
    @Column(name = "wins", nullable = false)
    private Integer wins;

    @NotNull
    @Min(value = 0)
    @Column(name = "losses", nullable = false)
    private Integer losses;

    @NotNull
    @DecimalMin(value = "0")
    @Column(name = "elo_rating", nullable = false)
    private Float eloRating;

    @Min(value = 0)
    @Column(name = "dishes")
    private Integer dishes;

    @Min(value = 0)
    @Column(name = "r_dishes")
    private Integer rDishes;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public LeaguePlayer id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public LeaguePlayer firstName(String firstName) {
        this.setFirstName(firstName);
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return this.lastName;
    }

    public LeaguePlayer lastName(String lastName) {
        this.setLastName(lastName);
        return this;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public Integer getWins() {
        return this.wins;
    }

    public LeaguePlayer wins(Integer wins) {
        this.setWins(wins);
        return this;
    }

    public void setWins(Integer wins) {
        this.wins = wins;
    }

    public Integer getLosses() {
        return this.losses;
    }

    public LeaguePlayer losses(Integer losses) {
        this.setLosses(losses);
        return this;
    }

    public void setLosses(Integer losses) {
        this.losses = losses;
    }

    public Float getEloRating() {
        return this.eloRating;
    }

    public LeaguePlayer eloRating(Float eloRating) {
        this.setEloRating(eloRating);
        return this;
    }

    public void setEloRating(Float eloRating) {
        this.eloRating = eloRating;
    }

    public Integer getDishes() {
        return this.dishes;
    }

    public LeaguePlayer dishes(Integer dishes) {
        this.setDishes(dishes);
        return this;
    }

    public void setDishes(Integer dishes) {
        this.dishes = dishes;
    }

    public Integer getrDishes() {
        return this.rDishes;
    }

    public LeaguePlayer rDishes(Integer rDishes) {
        this.setrDishes(rDishes);
        return this;
    }

    public void setrDishes(Integer rDishes) {
        this.rDishes = rDishes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LeaguePlayer)) {
            return false;
        }
        return id != null && id.equals(((LeaguePlayer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LeaguePlayer{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastName='" + getLastName() + "'" +
            ", wins=" + getWins() +
            ", losses=" + getLosses() +
            ", eloRating=" + getEloRating() +
            ", dishes=" + getDishes() +
            ", rDishes=" + getrDishes() +
            "}";
    }
}
