import React, { Component } from 'react';
import { Card, Table, Button, ButtonGroup, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faEdit, faTrash, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import API from '../Api';
import MyToast from './myToast';

export default class VoitureListe extends Component {

  constructor(props) {
    super(props);
    this.state = {
      voitures: [], show: false,
      showModal: false, marketing: '', loadingMkt: false, voitureSelectee: null
    };
  }

  componentDidMount() { this.findAllVoitures(); }

  findAllVoitures() {
    API.get('/voitures',
          {auth: { username: 'admin', password: '1234' }}
    )
      .then(res => this.setState({ voitures: res.data }))
      .catch(err => console.error('Erreur chargement voitures :', err));
  }

  deleteVoiture = (voitureId) => {
    API.delete('/voitures/' + voitureId,
          {auth: { username: 'admin', password: '1234' }}
    )
      .then(() => {
        this.setState({ show: true });
        setTimeout(() => this.setState({ show: false }), 3000);
        this.setState({ voitures: this.state.voitures.filter(v => v.id !== voitureId) });
      })
      .catch(err => console.error('Erreur suppression :', err));
  };

  voirMarketing = (voiture) => {
    this.setState({ showModal: true, loadingMkt: true, marketing: '', voitureSelectee: voiture });
    API.get(`/voitures/${voiture.id}/marketing`,
          {auth: { username: 'admin', password: '1234' }}
    )
      .then(res => this.setState({ marketing: res.data, loadingMkt: false }))
      .catch(() => this.setState({ marketing: "Erreur lors de la génération.", loadingMkt: false }));
  };

  render() {
    const { voitures, show, showModal, marketing, loadingMkt, voitureSelectee } = this.state;
    return (
      <div>
        <div style={{ display: show ? 'block' : 'none' }}>
          <MyToast children={{ show, message: 'Voiture supprimée avec succès.', type: 'danger' }} />
        </div>
        <Card className="border border-dark bg-dark text-white">
          <Card.Header><FontAwesomeIcon icon={faList} /> Liste des Voitures</Card.Header>
          <Card.Body>
            <Table bordered hover striped variant="dark">
              <thead>
                <tr>
                  <th>Marque</th><th>Modele</th><th>Couleur</th>
                  <th>Immatricule</th><th>Annee</th><th>Prix</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {voitures.length === 0
                  ? <tr><td colSpan="7" className="text-center">Aucune voiture disponible</td></tr>
                  : voitures.map(voiture => (
                    <tr key={voiture.id}>
                      <td>{voiture.marque}</td><td>{voiture.modele}</td>
                      <td>{voiture.couleur}</td><td>{voiture.immatricule}</td>
                      <td>{voiture.annee}</td><td>{voiture.prix} DH</td>
                      <td>
                        <ButtonGroup>
                          <Link to={"/edit/" + voiture.id} className="btn btn-sm btn-outline-primary">
                            <FontAwesomeIcon icon={faEdit} />
                          </Link>{' '}
                          <Button size="sm" variant="outline-danger"
                            onClick={this.deleteVoiture.bind(this, voiture.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>{' '}
                          <Button size="sm" variant="outline-warning"
                            onClick={() => this.voirMarketing(voiture)} title="Annonce IA">
                            <FontAwesomeIcon icon={faBullhorn} />
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        <Modal show={showModal} onHide={() => this.setState({ showModal: false })} size="lg">
          <Modal.Header closeButton className="bg-dark text-white">
            <Modal.Title>📣 Annonce IA — {voitureSelectee?.marque} {voitureSelectee?.modele}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-dark text-white">
            {loadingMkt
              ? <div className="text-center py-4">
                  <div className="spinner-border text-warning" />
                  <p className="mt-2">L'IA rédige l'annonce...</p>
                </div>
              : <div style={{ whiteSpace: 'pre-line' }}>{marketing}</div>
            }
          </Modal.Body>
          <Modal.Footer className="bg-dark">
            <Button variant="secondary" onClick={() => this.setState({ showModal: false })}>Fermer</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}