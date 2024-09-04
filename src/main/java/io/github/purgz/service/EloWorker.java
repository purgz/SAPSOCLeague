package io.github.purgz.service;

import org.springframework.stereotype.Service;

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
}
