# MiolaCar — Système de Gestion Automobile avec Intelligence Artificielle

MiolaCar est une application web full-stack combinant la **gestion de voitures** avec un **assistant intelligent alimenté par IA** ainsi qu'un **générateur automatique d'annonces marketing**.  
L'application permet de gérer un stock de véhicules, obtenir des recommandations intelligentes et générer automatiquement des descriptions publicitaires professionnelles grâce à une IA locale utilisant **Ollama**.

---

# Aperçu de l'Application

## Page d'accueil
![Home](screenshots/home.PNG)

## Gestion des voitures

### L'ajout d'une voiture
![Cars](screenshots/add-car.PNG)

### La liste des voitures
![Cars](screenshots/list-cars.PNG)

### La modification d'une voiture
![Cars](screenshots/edit-car.PNG)

### La liste des voitures avec celle modifiée
![Cars](screenshots/edit-cars.PNG)

## Assistant IA
![Assistant](screenshots/assistant.PNG)

## Générateur Marketing
![Marketing](screenshots/marketing.PNG)

---

# Fonctionnalités

## Assistant Automobile Intelligent
- Posez des questions en langage naturel
- Obtenez des recommandations selon :
  - le budget
  - la couleur
  - les préférences
  - les critères utilisateur
- L'IA répond uniquement à partir du stock disponible en base de données

### Exemple :
> "Je cherche une voiture rouge avec un budget de 100 000 DH"

---

## Générateur d'Annonce Marketing IA
- Génération automatique d'annonces publicitaires
- Texte professionnel et convaincant
- Mise en avant des qualités du véhicule
- Génération en un clic

### Exemple :
> "Découvrez cette magnifique Honda CRV 2016, élégante, fiable et idéale pour les longs trajets…"

---

## Gestion Complète des Voitures
- Ajouter une voiture
- Modifier une voiture
- Supprimer une voiture
- Afficher la liste des véhicules

---

## Intelligence Artificielle Locale
- Utilisation de **Ollama**
- Modèle IA local (**TinyLlama**)
- Aucun appel à une API externe
- Fonctionne entièrement en local

---

# Technologies Utilisées

## Frontend
- React.js
- Bootstrap

## Backend
- Spring Boot
- Spring AI

## Base de données
- MariaDB

## Intelligence Artificielle
- Ollama
- TinyLlama

## Infrastructure
- Docker & Docker Compose
- Kubernetes (minikube)

---

# Architecture du Projet

```text
┌─────────────────────────────────────────────────────┐
│                   Utilisateur                        │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              Frontend React :3030                    │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP /api
┌──────────────────────▼──────────────────────────────┐
│           Backend Spring Boot :8080                  │
│              REST API + Spring AI                    │
└──────────┬───────────────────────┬──────────────────┘
           │                       │
┌──────────▼──────────┐  ┌─────────▼───────────────────┐
│   MariaDB :3306     │  │     Ollama :11434            │
│   Base de données   │  │  IA locale (TinyLlama)       │
└─────────────────────┘  └─────────────────────────────┘
```

---

# Lancement avec Docker Compose

## Prérequis
- Docker Desktop installé et démarré
- Git

## Cloner le projet

```bash
git clone https://github.com/votre-username/miolacar.git
cd miolacar
```

## Lancer l'application

```bash
docker compose up --build
```

> ⏳ Le premier lancement télécharge le modèle IA TinyLlama (~600 MB) — prévoir 5 à 15 minutes selon la connexion.

## Accès aux Services

| Service        | URL                                                    |
| -------------- | ------------------------------------------------------ |
| Frontend React | [http://localhost:3030](http://localhost:3030)         |
| Backend Spring | [http://localhost:8080/api](http://localhost:8080/api) |
| Ollama         | [http://localhost:11434](http://localhost:11434)       |

## Services Docker

| Service        | Description                           |
| -------------- | ------------------------------------- |
| `mariadb`      | Base de données                       |
| `backend`      | API Spring Boot                       |
| `frontend`     | Interface React                       |
| `ollama`       | Serveur IA local                      |
| `ollama-setup` | Téléchargement automatique du modèle  |

---

# Lancement avec Kubernetes (minikube)

## Architecture Kubernetes

```text
                    ┌─────────────────────────────────┐
                    │      Namespace: miolacar         │
                    │                                  │
                    │  ┌──────────────────────────┐   │
                    │  │         Ingress           │   │
                    │  │  /      → frontend-svc    │   │
                    │  │  /api/* → backend-svc     │   │
                    │  └────────────┬─────────────┘   │
                    │        ┌──────┴───────┐          │
                    │  ┌─────▼──────┐ ┌────▼────────┐ │
                    │  │ Deployment │ │ Deployment  │ │
                    │  │  frontend  │ │   backend   │ │
                    │  │ (React)    │ │ (Spring)    │ │
                    │  └────────────┘ └──────┬──────┘ │
                    │                   ┌────┴────┐    │
                    │            ┌──────▼──┐ ┌────▼──┐ │
                    │            │StatefulS│ │Deploy.│ │
                    │            │ mariadb │ │ollama │ │
                    │            │  +PVC   │ │ +PVC  │ │
                    │            └─────────┘ └───────┘ │
                    │                                  │
                    │  ┌──────────┐  ┌─────────────┐  │
                    │  │  Secret  │  │  ConfigMap  │  │
                    │  │  (mots   │  │  (config    │  │
                    │  │  passe)  │  │   réseau)   │  │
                    │  └──────────┘  └─────────────┘  │
                    └─────────────────────────────────┘
```

## Structure des fichiers Kubernetes

```
k8s/
├── namespace.yaml          ← Espace de noms isolé
├── secret.yaml             ← Mots de passe (base64)
├── configmap.yaml          ← Variables de configuration
├── mariadb/
│   ├── pvc.yaml            ← Volume persistant 1Gi
│   ├── statefulset.yaml    ← StatefulSet (identité stable)
│   └── service.yaml        ← ClusterIP :3306
├── ollama/
│   ├── pvc.yaml            ← Volume persistant 5Gi (modèle)
│   ├── deployment.yaml     ← Serveur Ollama
│   ├── service.yaml        ← ClusterIP :11434
│   └── job-setup.yaml      ← Job one-shot (pull du modèle)
├── backend/
│   ├── deployment.yaml     ← Spring Boot
│   └── service.yaml        ← ClusterIP :8080
├── frontend/
│   ├── deployment.yaml     ← React
│   └── service.yaml        ← ClusterIP :3030
└── ingress.yaml            ← Point d'entrée unique :80
```

## Correspondance Docker Compose → Kubernetes

| Docker Compose        | Kubernetes                          | Raison                                          |
| --------------------- | ----------------------------------- | ----------------------------------------------- |
| `service: mariadb`    | `StatefulSet` + Service             | Identité stable (même pod, même volume)         |
| `service: ollama`     | `Deployment` + Service              | Service stateless scalable                      |
| `service: ollama-setup` | `Job` (one-shot)                  | Se termine seul, K8s ne le relance pas          |
| `service: backend`    | `Deployment` + Service              | Service stateless scalable                      |
| `service: frontend`   | `Deployment` + Service              | Service stateless scalable                      |
| `depends_on`          | `initContainers` (wait-for-*)       | K8s n'a pas de depends_on natif                 |
| `volumes:`            | `PersistentVolumeClaim`             | Stockage découplé du pod                        |
| `environment:`        | `ConfigMap` + `Secret`              | Config non sensible / mots de passe séparés     |
| `ports:`              | `Ingress`                           | Un seul point d'entrée, routage par path        |

## Prérequis

- [kubectl](https://kubernetes.io/docs/tasks/tools/) installé
- [minikube](https://minikube.sigs.k8s.io/docs/start/) installé
- Docker Desktop démarré

## Étape 1 — Démarrer minikube

```bash
minikube start --driver=docker --memory=4096 --cpus=2
```

## Étape 2 — Builder les images dans minikube

```bash
# Basculer sur le daemon Docker de minikube
eval $(minikube docker-env)        # Mac/Linux
# ou sur Windows PowerShell :
# & minikube -p minikube docker-env --shell powershell | Invoke-Expression

# Builder les images directement dans minikube
docker build -t miolacar-backend:latest ./backend-spring
docker build -t miolacar-frontend:latest ./frontend-react
```

> **Pourquoi ?** minikube a son propre daemon Docker, séparé de Docker Desktop. Les images buildées ici sont directement disponibles pour Kubernetes sans passer par un registry.

## Étape 3 — Charger l'image Ollama dans minikube

`ollama/ollama` (~3.8 GB) doit être chargée manuellement pour éviter les timeouts réseau :

```bash
# Télécharger via Docker Desktop (reprend si coupé)
docker pull ollama/ollama

# Sauvegarder et transférer dans minikube (local, pas de réseau)
docker save ollama/ollama -o ollama.tar
minikube image load ollama.tar
rm ollama.tar

# Vérifier
minikube image ls | grep ollama
```

## Étape 4 — Activer l'Ingress

```bash
minikube addons enable ingress

# Vérifier que le pod ingress est Running
kubectl get pods -n ingress-nginx
```

## Étape 5 — Déployer dans l'ordre

```bash
# 1. Namespace + configuration
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/configmap.yaml

# 2. Base de données
kubectl apply -f k8s/mariadb/pvc.yaml
kubectl apply -f k8s/mariadb/statefulset.yaml
kubectl apply -f k8s/mariadb/service.yaml
kubectl wait --for=condition=ready pod -l app=mariadb -n miolacar --timeout=120s

# 3. Ollama (serveur IA)
kubectl apply -f k8s/ollama/pvc.yaml
kubectl apply -f k8s/ollama/deployment.yaml
kubectl apply -f k8s/ollama/service.yaml
kubectl wait --for=condition=ready pod -l app=ollama -n miolacar --timeout=120s

# 4. Téléchargement du modèle TinyLlama (job one-shot)
kubectl apply -f k8s/ollama/job-setup.yaml
kubectl wait --for=condition=complete job/ollama-setup -n miolacar --timeout=600s

# 5. Backend et Frontend
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml

# 6. Ingress (routage)
kubectl apply -f k8s/ingress.yaml
```

## Vérifier l'état

```bash
# Vue globale
kubectl get all -n miolacar

# Surveiller en temps réel
kubectl get pods -n miolacar -w

# Diagnostiquer un pod bloqué
kubectl describe pod <nom-du-pod> -n miolacar
kubectl logs -f <nom-du-pod> -n miolacar
```

État attendu quand tout fonctionne :

```
NAME                           READY   STATUS      AGE
pod/mariadb-0                  1/1     Running     5m
pod/ollama-xxx                 1/1     Running     4m
pod/ollama-setup-xxx           0/1     Completed   3m
pod/backend-xxx                1/1     Running     2m
pod/frontend-xxx               1/1     Running     1m
```

## Accéder à l'application

```bash
# Ouvrir le tunnel minikube (laisser ce terminal ouvert)
minikube tunnel
```

| Service        | URL                              |
| -------------- | -------------------------------- |
| Application    | http://localhost                 |
| Backend API    | http://localhost/api/voitures    |

## Arrêter sans perdre les données

```bash
# Arrêter (conserve les volumes)
kubectl delete -R -f k8s/

# Reset complet (supprime aussi les données)
minikube delete
```

---

# Endpoints API

## Gestion des voitures

| Méthode | Endpoint             | Description           |
| ------- | -------------------- | --------------------- |
| GET     | `/api/voitures`      | Liste des voitures    |
| POST    | `/api/voitures`      | Ajouter une voiture   |
| PUT     | `/api/voitures/{id}` | Modifier une voiture  |
| DELETE  | `/api/voitures/{id}` | Supprimer une voiture |

## Intelligence Artificielle

| Méthode | Endpoint                         | Description              |
| ------- | -------------------------------- | ------------------------ |
| POST    | `/api/voitures/assistant`        | Assistant automobile IA  |
| GET     | `/api/voitures/{id}/marketing`   | Générer une annonce IA   |

---

# Variables de Configuration

## Docker Compose (`docker-compose.yml`)

```env
SPRING_DATASOURCE_URL=jdbc:mariadb://mariadb:3306/springboot
SPRING_DATASOURCE_USERNAME=spring
SPRING_DATASOURCE_PASSWORD=spring
SPRING_AI_OLLAMA_BASE_URL=http://ollama:11434
SPRING_AI_OLLAMA_CHAT_MODEL=tinyllama
```

## Kubernetes (`k8s/configmap.yaml`)

```env
SPRING_DATASOURCE_URL=jdbc:mariadb://mariadb-svc:3306/springboot
SPRING_AI_OLLAMA_BASE_URL=http://ollama-svc:11434
SPRING_AI_OLLAMA_CHAT_MODEL=tinyllama
```

> Les noms de services Docker (`mariadb`, `ollama`) deviennent des noms de services Kubernetes (`mariadb-svc`, `ollama-svc`), qui sont résolus automatiquement par le DNS interne du cluster.

---

# Fonctionnement de l'IA

## Assistant IA

1. Récupère toutes les voitures de la base
2. Construit un catalogue dynamique
3. Envoie le catalogue + la demande utilisateur au modèle IA
4. Génère une recommandation intelligente basée uniquement sur le stock

## Générateur Marketing

L'IA reçoit : marque, modèle, couleur, année — et génère automatiquement une annonce publicitaire professionnelle.

---

# Notes Importantes

- Le premier lancement peut prendre plusieurs minutes (téléchargement du modèle IA TinyLlama ~600 MB)
- Docker doit être lancé avant le démarrage
- Avec Kubernetes sur machine locale, prévoir au moins **8 GB de RAM** et **2 CPU**
- L'image `ollama/ollama` (~3.8 GB) doit être chargée manuellement dans minikube pour éviter les timeouts réseau

## Ports requis (Docker Compose)

| Port  | Service  |
| ----- | -------- |
| 3030  | Frontend |
| 8080  | Backend  |
| 3306  | MariaDB  |
| 11434 | Ollama   |

## Port requis (Kubernetes)

| Port | Service               |
| ---- | --------------------- |
| 80   | Ingress (tout passe par là) |

---

# Objectifs du Projet

Ce projet démontre :

- L'intégration de l'IA dans une application métier
- L'utilisation d'un LLM local avec Ollama
- Le développement full-stack moderne
- La conteneurisation avec Docker & Docker Compose
- L'orchestration avec Kubernetes
- L'automatisation marketing par intelligence artificielle

---

# Améliorations Futures

- Authentification utilisateurs/admin
- Génération d'images IA
- Support multilingue
- Déploiement Cloud (GKE, EKS, AKS)
- Tableau de bord analytique
- Streaming des réponses IA
- Pipeline CI/CD avec GitHub Actions

---

# Licence

Projet open-source sous licence MIT.

---

# Auteur

**Aya Taki**

Projet développé dans le cadre d'un apprentissage :

- Full Stack Development
- Intelligence Artificielle
- Docker & Microservices
- Kubernetes & Orchestration
- Intégration de modèles LLM locaux