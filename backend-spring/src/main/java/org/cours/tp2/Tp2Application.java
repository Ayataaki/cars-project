package org.cours.tp2;

import org.cours.tp2.modele.Proprietaire;
import org.cours.tp2.modele.ProprietaireRepository;
import org.cours.tp2.modele.Voiture;
import org.cours.tp2.modele.VoitureRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Tp2Application {

    @Autowired
    private VoitureRepository voitureRepository;

    @Autowired
    private ProprietaireRepository proprietaireRepository;

    public static void main(String[] args) {
        SpringApplication.run(Tp2Application.class, args);
	}

    @Bean
    CommandLineRunner runner() {

        return args -> {

            Proprietaire proprietaire1 = new Proprietaire("Ali", "Hassan");
            Proprietaire proprietaire2 = new Proprietaire("Najat", "Bani");

            proprietaireRepository.save(proprietaire1);
            proprietaireRepository.save(proprietaire2);

            Voiture v1 = new Voiture("Toyota","Corolla","Grise","A-1-9090",2018,95000);
            v1.setProprietaire(proprietaire1);

            Voiture v2 = new Voiture("Ford","Fiesta","Rouge","A-2-8090",2015,90000);
            v2.setProprietaire(proprietaire1);

            Voiture v3 = new Voiture("Honda","CRV","Bleu","A-3-7090",2016,140000);
            v3.setProprietaire(proprietaire2);

            voitureRepository.save(v1);
            voitureRepository.save(v2);
            voitureRepository.save(v3);
        };
    }


}
