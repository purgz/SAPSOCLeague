package io.github.purgz.repository;

import io.github.purgz.domain.LeaguePlayer;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class LeaguePlayerRepositoryWithBagRelationshipsImpl implements LeaguePlayerRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<LeaguePlayer> fetchBagRelationships(Optional<LeaguePlayer> leaguePlayer) {
        return leaguePlayer.map(this::fetchSemesters);
    }

    @Override
    public Page<LeaguePlayer> fetchBagRelationships(Page<LeaguePlayer> leaguePlayers) {
        return new PageImpl<>(
            fetchBagRelationships(leaguePlayers.getContent()),
            leaguePlayers.getPageable(),
            leaguePlayers.getTotalElements()
        );
    }

    @Override
    public List<LeaguePlayer> fetchBagRelationships(List<LeaguePlayer> leaguePlayers) {
        return Optional.of(leaguePlayers).map(this::fetchSemesters).orElse(Collections.emptyList());
    }

    LeaguePlayer fetchSemesters(LeaguePlayer result) {
        return entityManager
            .createQuery(
                "select leaguePlayer from LeaguePlayer leaguePlayer left join fetch leaguePlayer.semesters where leaguePlayer is :leaguePlayer",
                LeaguePlayer.class
            )
            .setParameter("leaguePlayer", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<LeaguePlayer> fetchSemesters(List<LeaguePlayer> leaguePlayers) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, leaguePlayers.size()).forEach(index -> order.put(leaguePlayers.get(index).getId(), index));
        List<LeaguePlayer> result = entityManager
            .createQuery(
                "select distinct leaguePlayer from LeaguePlayer leaguePlayer left join fetch leaguePlayer.semesters where leaguePlayer in :leaguePlayers",
                LeaguePlayer.class
            )
            .setParameter("leaguePlayers", leaguePlayers)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
