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
