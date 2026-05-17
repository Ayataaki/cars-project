package org.cours.tp2.service;

import org.cours.tp2.modele.Voiture;
import org.cours.tp2.modele.VoitureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.ai.ollama.OllamaChatModel;


// import org.springframework.ai.chat.model.ChatResponse;
// import org.springframework.ai.chat.prompt.Prompt;
// import org.springframework.ai.ollama.api.OllamaModel;
// import org.springframework.ai.ollama.api.OllamaOptions;

@Service
public class CarAiService {

    @Autowired
    private OllamaChatModel chatModel;

    @Autowired
    private VoitureRepository voitureRepository;

    public String recommanderVoitures(String criteresUtilisateur) {

        Iterable<Voiture> voitures = voitureRepository.findAll();

        StringBuilder catalogueText = new StringBuilder();

        for (Voiture v : voitures) {

            catalogueText.append(String.format(
                "- %s %s | Couleur: %s | Année: %d | Prix: %d DH\n",
                v.getMarque(),
                v.getModele(),
                v.getCouleur(),
                v.getAnnee(),
                v.getPrix()
            ));
        }

        String prompt = """
            Tu es un conseiller automobile professionnel chez MiolaCar.

            Ta mission est d'aider le client à choisir une voiture
            parmi le stock disponible.

            IMPORTANT :
            - Réponds uniquement en français
            - Sois clair et professionnel
            - Fais des réponses courtes et utiles
            - Ne génère aucune balise visuelle
            - Ne génère jamais de texte entre crochets []
            - Ne décris pas d'images
            - Ne répète pas les phrases
            - Ne parle que des voitures disponibles
            - Si aucune voiture ne correspond, explique-le poliment

            Stock disponible :
            """ + catalogueText + """

            Demande du client :
            """ + criteresUtilisateur + """

            Réponse :
            """;

        return chatModel.call(prompt);
    }

    public String genererDescriptionMarketing(Voiture voiture) {

        String prompt = String.format("""
        Tu es un expert en marketing automobile chez MiolaCar.

        Ta mission : rédiger une annonce publicitaire professionnelle pour vendre une voiture.

        IMPORTANT :
        - Réponds uniquement en français
        - Texte fluide, naturel et vendeur
        - Maximum 100 à 120 mots
        - Ne génère aucune balise visuelle
        - Ne génère jamais de texte entre crochets []
        - Ne décris pas d'images
        - Ne fais pas de répétitions
        - Style professionnel et convaincant

        Voiture :
        - Marque : %s
        - Modèle : %s
        - Couleur : %s
        - Année : %d

        Annonce :
        """,
                voiture.getMarque(),
                voiture.getModele(),
                voiture.getCouleur(),
                voiture.getAnnee()
            );

            String response = chatModel.call(prompt);

            // Nettoyage sécurité (anti hallucination visuelle)
            response = response.replaceAll("\\[.*?\\]", "");

            return response.trim();
    }


}
