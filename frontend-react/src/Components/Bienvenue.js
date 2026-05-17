import React from 'react';
// ✅ react-bootstrap v2 : Jumbotron supprimé → on le remplace par un <div>
// avec les classes Bootstrap 5 équivalentes

class Bienvenue extends React.Component {
  render() {
    return (
      <div className="p-5 mb-4 bg-dark text-white rounded-3">
        <div className="container-fluid py-3">
          <h1 className="display-5 fw-bold">
            Bienvenue dans votre Magasin de Voitures
          </h1>
          <blockquote className="blockquote mb-0">
            <p>Le meilleur de nos voitures est exposé près de chez vous</p>
            <footer className="blockquote-footer text-muted">
              Master MIOLA
            </footer>
          </blockquote>
        </div>
      </div>
    );
  }
}

export default Bienvenue;