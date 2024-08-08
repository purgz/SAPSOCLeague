package io.github.purgz.domain.NewWeekDataModel;

import com.fasterxml.jackson.annotation.*;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.annotation.Generated;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonPropertyOrder({ "matches", "bye" })
@Generated("jsonschema2pojo")
public class Round {

    @JsonProperty("matches")
    private List<Match> matches;

    @JsonProperty("bye")
    private Bye bye;

    @JsonIgnore
    private Map<String, Object> additionalProperties = new LinkedHashMap<String, Object>();

    @JsonProperty("matches")
    public List<Match> getMatches() {
        return matches;
    }

    @JsonProperty("matches")
    public void setMatches(List<Match> matches) {
        this.matches = matches;
    }

    @JsonProperty("bye")
    public Bye getBye() {
        return bye;
    }

    @JsonProperty("bye")
    public void setBye(Bye bye) {
        this.bye = bye;
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
