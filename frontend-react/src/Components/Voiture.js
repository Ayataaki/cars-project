import React, { Component } from 'react';
import { Card, Form, Col, Button, Row } from 'react-bootstrap';
import axios from 'axios';
// ✅ react-router-dom v7 : useParams + useNavigate remplacent match et history
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faSave, faUndo } from '@fortawesome/free-solid-svg-icons';
import MyToast from './myToast';

// ─── Wrapper fonctionnel pour injecter les hooks dans le composant classe ──
// Nécessaire car les hooks React ne fonctionnent que dans les composants
// fonctionnels, pas dans les classes (comme demandé dans le lab)
function VoitureWrapper(props) {
  const { id } = useParams();       // récupère :id depuis /edit/:id
  const navigate = useNavigate();   // remplace this.props.history.push()
  return <VoitureClass {...props} voitureId={id} navigate={navigate} />;
}

class VoitureClass extends Component {

  // ─── État initial (utilisé aussi pour le reset) ─────────────────────────
  initialState = {
    id:          '',
    marque:      '',
    modele:      '',
    couleur:     '',
    immatricule: '',
    prix:        '',
    annee:       '',
    show:        false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.voitureChange = this.voitureChange.bind(this);
    this.submitVoiture = this.submitVoiture.bind(this);
  }

  // ─── Si on arrive sur /edit/:id → charger la voiture ────────────────────
  componentDidMount() {

    const { voitureId } = this.props;

    if (voitureId) {

      axios.get(
        "http://localhost:8080/api/voitures/" + voitureId,
        {
          auth: {
            username: "admin",
            password: "1234"
          }
        }
      )

      .then(response => {

        this.setState({
          id: response.data.id,
          marque: response.data.marque,
          modele: response.data.modele,
          couleur: response.data.couleur,
          immatricule: response.data.immatricule,
          annee: response.data.annee,
          prix: response.data.prix
        });

      })

      .catch(error => {
        console.error("Erreur chargement voiture :", error);
      });
    }
  }

  /*
  componentDidMount() {
    const { voitureId } = this.props;
    if (voitureId) {
      axios.get("http://localhost:8080/api/voitures/" + voitureId)
        .then(response => {
          this.setState({
            id:          response.data.id,
            marque:      response.data.marque,
            modele:      response.data.modele,
            couleur:     response.data.couleur,
            immatricule: response.data.immatricule,
            annee:       response.data.annee,
            prix:        response.data.prix
          });
        })
        .catch(error => console.error("Erreur chargement voiture :", error));
    }
  }
  */

  // ─── Mise à jour dynamique du champ modifié ──────────────────────────────
  voitureChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // ─── Reset du formulaire ─────────────────────────────────────────────────
  resetVoiture = () => {
    this.setState(() => this.initialState);
  };

  // ─── Soumission : POST (ajout) ou PUT (édition) ──────────────────────────
  submitVoiture = event => {
    event.preventDefault();

    const voiture = {
      id:          this.state.id,
      marque:      this.state.marque,
      modele:      this.state.modele,
      couleur:     this.state.couleur,
      immatricule: this.state.immatricule,
      annee:       this.state.annee,
      prix:        this.state.prix
    };

    if (voiture.id) {
      // Mode édition → PUT
      axios.put("http://localhost:8080/api/voitures/" + voiture.id, voiture,{
       auth: {
        username: "admin",
        password: "1234"
       }
      })
        // .then(response => {
        //   if (response.data != null) {
        //     this.setState({ show: true });
        //     setTimeout(() => {
        //       this.setState({ show: false });
        //       this.props.navigate('/list'); // ✅ useNavigate v7
        //     }, 1500);
        //   } else {
        //     this.setState({ show: false });
        //   }
        // });
        .then(response => {
          if (response.data != null) {
            this.setState({ show: true });
            setTimeout(() => {
              this.setState({ show: false });
              this.props.navigate('/list');
            }, 1500);
          } else {
            this.setState({ show: false });
          }
        });
    } else {
      // Mode ajout → POST
      axios.post("http://localhost:8080/api/voitures", voiture,{
         auth: {
            username: "admin",
            password: "1234"
         }
         })
        .then(response => {
          if (response.data != null) {
            this.setState({ show: true });
            setTimeout(() => {
              this.setState({ show: false });
              this.props.navigate('/list');
            }, 1500);
          } else {
            this.setState({ show: false });
          }
        });
    }
  };

  // ─── Rendu ───────────────────────────────────────────────────────────────
  render() {
    const { marque, modele, couleur, immatricule, prix, annee } = this.state;

    return (
      <div>
        {/* Toast de confirmation */}
        <div style={{ display: this.state.show ? 'block' : 'none' }}>
          <MyToast children={{
            show:    this.state.show,
            message: 'Voiture enregistrée avec succès.',
            type:    'success'
          }} />
        </div>

        <Card className={"border border-dark bg-dark text-white"}>
          <Card.Header>
            <FontAwesomeIcon icon={faPlusSquare} /> Ajouter une Voiture
          </Card.Header>

          <Form onReset={this.resetVoiture} onSubmit={this.submitVoiture} id="VoitureFormId">
            <Card.Body>

              {/* Ligne 1 : Marque / Modèle */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridMarque">
                  <Form.Label>Marque</Form.Label>
                  <Form.Control required name="marque" type="text"
                    value={marque} autoComplete="off" onChange={this.voitureChange}
                    className={"bg-dark text-white"} placeholder="Entrez Marque Voiture" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridModele">
                  <Form.Label>Modele</Form.Label>
                  <Form.Control required name="modele" type="text"
                    value={modele} autoComplete="off" onChange={this.voitureChange}
                    className={"bg-dark text-white"} placeholder="Entrez Modele Voiture" />
                </Form.Group>
              </Row>

              {/* Ligne 2 : Couleur / Immatricule */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCouleur">
                  <Form.Label>Couleur</Form.Label>
                  <Form.Control required name="couleur" type="text"
                    value={couleur} autoComplete="off" onChange={this.voitureChange}
                    className={"bg-dark text-white"} placeholder="Entrez Couleur Voiture" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridImmatricule">
                  <Form.Label>Immatricule</Form.Label>
                  <Form.Control required name="immatricule" type="text"
                    value={immatricule} autoComplete="off" onChange={this.voitureChange}
                    className={"bg-dark text-white"} placeholder="Entrez Immatricule Voiture" />
                </Form.Group>
              </Row>

              {/* Ligne 3 : Prix / Année */}
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPrix">
                  <Form.Label>Prix</Form.Label>
                  <Form.Control required name="prix" type="number"
                    value={prix} autoComplete="off" onChange={this.voitureChange}
                    className={"bg-dark text-white"} placeholder="Entrez Prix Voiture" />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridAnnee">
                  <Form.Label>Annee</Form.Label>
                  <Form.Control required name="annee" type="number"
                    value={annee} autoComplete="off" onChange={this.voitureChange}
                    className={"bg-dark text-white"} placeholder="Entrez Annee Voiture" />
                </Form.Group>
              </Row>

            </Card.Body>

            <Card.Footer style={{ textAlign: 'right' }}>
              <Button size="sm" variant="success" type="submit">
                <FontAwesomeIcon icon={faSave} /> Submit
              </Button>
              {' '}
              <Button size="sm" variant="info" type="reset">
                <FontAwesomeIcon icon={faUndo} /> Reset
              </Button>
            </Card.Footer>
          </Form>
        </Card>
      </div>
    );
  }
}

export default VoitureWrapper;