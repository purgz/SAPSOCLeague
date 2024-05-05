package io.github.purgz.web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminFileUpload {

    //this method allows to upload data <player - semester score> to a particular semester
    //since this just does bulk data it is not appropriate for general use
    //used to upload historical data where round and individual match information is not accessible.
    @PostMapping("/upload-score-csv")
    public ResponseEntity<String> uploadScoreCsv(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println(file.getContentType());
            // TODO: 05/05/2024
            //assumes there is already a valid semester inside a valid year object.
            //Create new player with the player name, unless there is already a player with that name, then just use them
            //Given a semester ID, find that semester, add the player, create semester score, then add score to semester.

        } catch (Exception e) {
            return new ResponseEntity<>("Failed to upload file", HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity<>(HttpStatus.ACCEPTED);
    }
}
