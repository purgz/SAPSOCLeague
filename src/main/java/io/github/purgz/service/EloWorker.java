package io.github.purgz.service;

import io.github.purgz.domain.LeaguePlayer;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EloWorker {

    private final float K_FACTOR = 32;

    public float expectedScore(float ratingA, float ratingB) {
        //expected score formula for ELO ratings.

        //find difference factor between players
        float diff = (ratingB - ratingA) / 400;

        //find denominator
        float result = 1 + (float) Math.pow(10, diff);

        //return reciprocal
        return 1f / result;
    }

    // TODO: 04/09/2024 could add expected scores to match week generation

    public float newRating(float expectedScore, float score, float ratingA) {
        //rating adjustment formula
        return ratingA + K_FACTOR * (score - expectedScore);
    }

    @Transactional
    public boolean updatePlayers(LeaguePlayer playerA, LeaguePlayer playerB) {
        /*
        Updates both players at the same time
        Player A must be passed in as the winner.
        At this time there is no option for a draw
        so game results are binary.
         */
        try {
            float ratingA = playerA.getEloRating();
            float ratingB = playerB.getEloRating();

            float eA = expectedScore(ratingA, ratingB);
            float eB = expectedScore(ratingB, ratingA);

            playerA.setEloRating(newRating(eA, 1f, ratingA));
            playerB.setEloRating(newRating(eB, 0f, ratingB));

            return true;
        } catch (Exception e) {
            System.out.println(e);
            System.out.println("Error with elo adjustment - could be a player missing elo rating");
            System.out.println("Make this better later");
            return false;
        }
    }
}
