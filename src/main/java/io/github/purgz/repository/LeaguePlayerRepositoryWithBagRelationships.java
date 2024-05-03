package io.github.purgz.repository;

import io.github.purgz.domain.LeaguePlayer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface LeaguePlayerRepositoryWithBagRelationships {
    Optional<LeaguePlayer> fetchBagRelationships(Optional<LeaguePlayer> leaguePlayer);

    List<LeaguePlayer> fetchBagRelationships(List<LeaguePlayer> leaguePlayers);

    Page<LeaguePlayer> fetchBagRelationships(Page<LeaguePlayer> leaguePlayers);
}
