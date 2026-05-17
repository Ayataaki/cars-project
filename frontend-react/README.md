# Voiture Shop — React Frontend

## Commandes d'installation (dans l'ordre)

```bash
# 1. Créer le projet React
create-react-app reactjs
cd reactjs

# 2. Installer les dépendances
npm install react-bootstrap bootstrap
npm install --save react-router-dom
npm install axios
npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/react-fontawesome

# 3. Lancer le serveur
npm start
```

## Structure des fichiers
```
src/
├── App.js              ← Routeur principal
├── App.css             ← Fond sombre
├── index.css           ← Vide
└── Components/
    ├── NavigationBar.js  ← Barre de navigation
    ├── Bienvenue.js      ← Page d'accueil
    ├── Footer.js         ← Pied de page (année dynamique)
    ├── Voiture.js        ← Formulaire ajout + édition
    ├── VoitureListe.js   ← Liste avec suppression
    └── myToast.js        ← Notification (vert=succès, rouge=suppression)
```

## Endpoints Spring Boot attendus
| Méthode | URL                              | Action             |
|---------|----------------------------------|--------------------|
| GET     | http://localhost:8080/voitures   | Liste des voitures |
| POST    | http://localhost:8080/voitures   | Ajouter            |
| PUT     | http://localhost:8080/voitures/{id} | Modifier        |
| DELETE  | http://localhost:8080/voitures/{id} | Supprimer       |

## Fix CORS (côté Spring Boot)
Ajouter sur VoitureController :
```java
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class VoitureController { ... }
```