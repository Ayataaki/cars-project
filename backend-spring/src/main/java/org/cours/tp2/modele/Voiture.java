package org.cours.tp2.modele;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class Voiture {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private long id;

    @NonNull
    private String marque;

    @NonNull
    private String modele;

    @NonNull
    private String couleur;

    @NonNull
    private String immatricule;

    @NonNull
    private int annee;

    @NonNull
    private int prix;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proprietaire")
    @JsonIgnore
    private Proprietaire proprietaire;

    public Voiture(@NonNull int prix, @NonNull int annee, @NonNull String immatricule, @NonNull String couleur, @NonNull String modele, @NonNull String marque) {
        this.prix = prix;
        this.annee = annee;
        this.immatricule = immatricule;
        this.couleur = couleur;
        this.modele = modele;
        this.marque = marque;
    }
}