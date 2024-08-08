package io.github.purgz.domain.NewWeekDataModel;

import com.fasterxml.jackson.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Generated;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "rounds" })
@Generated("jsonschema2pojo")
public class NewWeekData {

    @JsonProperty("rounds")
    private List<Round> rounds;

    @JsonIgnore
    private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();

    @JsonProperty("rounds")
    public List<Round> getRounds() {
        return rounds;
    }

    @JsonProperty("rounds")
    public void setRounds(List<Round> rounds) {
        this.rounds = rounds;
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
