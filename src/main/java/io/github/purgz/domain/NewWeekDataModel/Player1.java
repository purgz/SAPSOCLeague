package io.github.purgz.domain.NewWeekDataModel;

import com.fasterxml.jackson.annotation.*;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.annotation.Generated;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder(
    {
        "id",
        "firstName",
        "lastName",
        "wins",
        "losses",
        "eloRating",
        "dishes",
        "rDishes",
        "photo",
        "photoContentType",
        "semesters",
        "semesterScores",
    }
)
@Generated("jsonschema2pojo")
public class Player1 {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("firstName")
    private String firstName;

    @JsonProperty("lastName")
    private String lastName;

    @JsonProperty("wins")
    private Integer wins;

    @JsonProperty("losses")
    private Integer losses;

    @JsonProperty("eloRating")
    private Integer eloRating;

    @JsonProperty("dishes")
    private Object dishes;

    @JsonProperty("rDishes")
    private Object rDishes;

    @JsonProperty("photo")
    private Object photo;

    @JsonProperty("photoContentType")
    private Object photoContentType;

    @JsonProperty("semesters")
    private Object semesters;

    @JsonProperty("semesterScores")
    private Object semesterScores;

    @JsonIgnore
    private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();

    @JsonProperty("id")
    public Long getId() {
        return id;
    }

    @JsonProperty("id")
    public void setId(Long id) {
        this.id = id;
    }

    @JsonProperty("firstName")
    public String getFirstName() {
        return firstName;
    }

    @JsonProperty("firstName")
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @JsonProperty("lastName")
    public String getLastName() {
        return lastName;
    }

    @JsonProperty("lastName")
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @JsonProperty("wins")
    public Integer getWins() {
        return wins;
    }

    @JsonProperty("wins")
    public void setWins(Integer wins) {
        this.wins = wins;
    }

    @JsonProperty("losses")
    public Integer getLosses() {
        return losses;
    }

    @JsonProperty("losses")
    public void setLosses(Integer losses) {
        this.losses = losses;
    }

    @JsonProperty("eloRating")
    public Integer getEloRating() {
        return eloRating;
    }

    @JsonProperty("eloRating")
    public void setEloRating(Integer eloRating) {
        this.eloRating = eloRating;
    }

    @JsonProperty("dishes")
    public Object getDishes() {
        return dishes;
    }

    @JsonProperty("dishes")
    public void setDishes(Object dishes) {
        this.dishes = dishes;
    }

    @JsonProperty("rDishes")
    public Object getrDishes() {
        return rDishes;
    }

    @JsonProperty("rDishes")
    public void setrDishes(Object rDishes) {
        this.rDishes = rDishes;
    }

    @JsonProperty("photo")
    public Object getPhoto() {
        return photo;
    }

    @JsonProperty("photo")
    public void setPhoto(Object photo) {
        this.photo = photo;
    }

    @JsonProperty("photoContentType")
    public Object getPhotoContentType() {
        return photoContentType;
    }

    @JsonProperty("photoContentType")
    public void setPhotoContentType(Object photoContentType) {
        this.photoContentType = photoContentType;
    }

    @JsonProperty("semesters")
    public Object getSemesters() {
        return semesters;
    }

    @JsonProperty("semesters")
    public void setSemesters(Object semesters) {
        this.semesters = semesters;
    }

    @JsonProperty("semesterScores")
    public Object getSemesterScores() {
        return semesterScores;
    }

    @JsonProperty("semesterScores")
    public void setSemesterScores(Object semesterScores) {
        this.semesterScores = semesterScores;
    }

    @JsonAnyGetter
    public Map<String, Object> getAdditionalProperties() {
        return this.additionalProperties;
    }

    @JsonAnySetter
    public void setAdditionalProperty(String name, Object value) {
        this.additionalProperties.put(name, value);
    }
}
