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

    @Lob
    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photo_content_type")
    private String photoContentType;

    @ManyToMany
    @JoinTable(
        name = "rel_league_player__semesters",
        joinColumns = @JoinColumn(name = "league_player_id"),
        inverseJoinColumns = @JoinColumn(name = "semesters_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "year", "weeks", "semesterScores", "players" }, allowSetters = true)
    private Set<Semester> semesters = new HashSet<>();

    @OneToMany(mappedBy = "player")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "semester", "player" }, allowSetters = true)
    private Set<SemesterScore> semesterScores = new HashSet<>();

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

    public byte[] getPhoto() {
        return this.photo;
    }

    public LeaguePlayer photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public LeaguePlayer photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public Set<Semester> getSemesters() {
        return this.semesters;
    }

    public void setSemesters(Set<Semester> semesters) {
        this.semesters = semesters;
    }

    public LeaguePlayer semesters(Set<Semester> semesters) {
        this.setSemesters(semesters);
        return this;
    }

    public LeaguePlayer addSemesters(Semester semester) {
        this.semesters.add(semester);
        semester.getPlayers().add(this);
        return this;
    }

    public LeaguePlayer removeSemesters(Semester semester) {
        this.semesters.remove(semester);
        semester.getPlayers().remove(this);
        return this;
    }

    public Set<SemesterScore> getSemesterScores() {
        return this.semesterScores;
    }

    public void setSemesterScores(Set<SemesterScore> semesterScores) {
        if (this.semesterScores != null) {
            this.semesterScores.forEach(i -> i.setPlayer(null));
        }
        if (semesterScores != null) {
            semesterScores.forEach(i -> i.setPlayer(this));
        }
        this.semesterScores = semesterScores;
    }

    public LeaguePlayer semesterScores(Set<SemesterScore> semesterScores) {
        this.setSemesterScores(semesterScores);
        return this;
    }

    public LeaguePlayer addSemesterScores(SemesterScore semesterScore) {
        this.semesterScores.add(semesterScore);
        semesterScore.setPlayer(this);
        return this;
    }

    public LeaguePlayer removeSemesterScores(SemesterScore semesterScore) {
        this.semesterScores.remove(semesterScore);
        semesterScore.setPlayer(null);
        return this;
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
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            "}";
    }
}
