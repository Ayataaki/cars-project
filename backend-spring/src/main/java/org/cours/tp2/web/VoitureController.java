package org.cours.tp2.web;

import org.cours.tp2.modele.Voiture;
import org.cours.tp2.modele.VoitureRepository;
import org.cours.tp2.service.CarAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

//@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api")
public class VoitureController {

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private CarAiService carAiService;

    //get all
    @RequestMapping(path = "/voitures", method = GET)
    public Iterable<Voiture> getVoitures() {
        return voitureRepository.findAll();
    }

    // GET BY ID
    @GetMapping("/voitures/{id}")
    public Voiture getVoitureById(@PathVariable Long id) {
        return voitureRepository.findById(id).orElse(null);
    }

    // ADD
    @PostMapping("/voitures")
    public Voiture addVoiture(@RequestBody Voiture voiture) {
        return voitureRepository.save(voiture);
    }

    // UPDATE
    @PutMapping("/voitures/{id}")
    public Voiture updateVoiture(@PathVariable Long id,
                                 @RequestBody Voiture voiture) {

        voiture.setId(id);

        return voitureRepository.save(voiture);
    }

    // DELETE
    @DeleteMapping("/voitures/{id}")
    public void deleteVoiture(@PathVariable Long id) {
        voitureRepository.deleteById(id);
    }

    @PostMapping("/voitures/assistant")
    public String demanderAssistant(@RequestBody String question){
        return carAiService.recommanderVoitures(question);
    }

    @GetMapping("/voitures/{id}/marketing")
    public String obtenirDescriptionMarketing(@PathVariable Long id){
        Voiture voiture = voitureRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Voiture non trouvée"));
        return carAiService.genererDescriptionMarketing(voiture);
    }


}