import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

export default class NavigationBar extends React.Component {
  render() {
    return (
      <Navbar bg="dark" variant="dark">

        {/* Logo / Brand → retour à l'accueil */}
        <Link to={""} className="navbar-brand">
          <img
            src={logo}
            width="40"
            height="40"
            alt="logo"
            style={{
              objectFit: 'cover',
              borderRadius: '8px',
              marginRight: '10px'
            }}
          />
          {' '}MIOLA Shop
        </Link>

        <Nav className="mr-auto">
          {/* Lien vers le formulaire d'ajout */}
          <Link to={"add"}  className="nav-link"> Ajouter une voiture </Link>
          {/* Lien vers la liste */}
          <Link to={"list"} className="nav-link"> Liste des Voitures  </Link>
          <Link to={"assistant"} className="nav-link"> Demander à l'assistant  </Link>
        </Nav>

      </Navbar>
    );
  }
}