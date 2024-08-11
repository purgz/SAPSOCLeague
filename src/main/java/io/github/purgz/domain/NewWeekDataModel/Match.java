package io.github.purgz.domain.NewWeekDataModel;

import com.fasterxml.jackson.annotation.*;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.annotation.Generated;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "player1", "player2" })
@Generated("jsonschema2pojo")
public class Match {

    @JsonProperty("player1")
    private Player1 player1;

    @JsonProperty("player2")
    private Player2 player2;

    @JsonProperty("gameEnding")
    private String gameEnding;

    @JsonProperty("p1Score")
    private float p1Score;

    @JsonProperty("p2Score")
    private float p2Score;

    @JsonProperty("gameEnding")
    public String getGameEnding() {
        return gameEnding;
    }

    @JsonProperty("gameEnding")
    public void setGameEnding(String gameEnding) {
        this.gameEnding = gameEnding;
    }

    @JsonProperty("p1Score")
    public float getP1Score() {
        return p1Score;
    }

    @JsonProperty("p1Score")
    public void setP1Score(float p1Score) {
        this.p1Score = p1Score;
    }

    @JsonProperty("p2Score")
    public float getP2Score() {
        return p2Score;
    }

    @JsonProperty("p2Score")
    public void setP2Score(float p2Score) {
        this.p2Score = p2Score;
    }

    @JsonIgnore
    private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();

    @JsonProperty("player1")
    public Player1 getPlayer1() {
        return player1;
    }

    @JsonProperty("player1")
    public void setPlayer1(Player1 player1) {
        this.player1 = player1;
    }

    @JsonProperty("player2")
    public Player2 getPlayer2() {
        return player2;
    }

    @JsonProperty("player2")
    public void setPlayer2(Player2 player2) {
        this.player2 = player2;
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
