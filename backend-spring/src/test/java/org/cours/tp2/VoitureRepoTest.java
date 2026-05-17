package org.cours.tp2;


import org.cours.tp2.modele.Voiture;
import org.cours.tp2.modele.VoitureRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.junit4.SpringRunner;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

@RunWith(SpringRunner.class)
@DataJpaTest
//Si le test concerne uniquement les composantes JPA
//Lorsque cette annotation est utilisée, H2, Hibernate et Spring Data sont configurés
//automatiquement pour le test.
public class VoitureRepoTest {
    @Autowired
    private TestEntityManager entityManager;
    //TestEntityManager est utilisée pour manipuler les entités persistantes
    @Autowired
    VoitureRepository voitureRepo;

    @Test
    public void ajouterVoiture() {
        Voiture voiture = new Voiture ("MiolaCar","Uber","Blanche","M-2020", 2021, 180000);
        entityManager.persistAndFlush(voiture);
        //permet de faire persister ce tuple de l’entité Voiture
        assertThat(voiture.getId()).isNotNull();
        //permet de tester qu'un tuple de Voiture a bien été ajoutée en mémoire H2
    }

    @Test
    public void supprimerVoiture() {
        entityManager.persistAndFlush(new Voiture("MiolaCar","Uber","Blanche","M-2020", 2021, 180000));
        entityManager.persistAndFlush(new Voiture("MiniCooper","Uber","Rouge","C-2020", 2021, 180000));

        voitureRepo.deleteAll();

        assertThat(voitureRepo.count()).isEqualTo(0);
    }

}