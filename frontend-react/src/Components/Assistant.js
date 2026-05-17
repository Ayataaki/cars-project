import React, { useState, useEffect } from 'react';
import API from '../Api';

function AssistantCar() {
  // ─── État ────────────────────────────────────────────────────────────────
  const [question,        setQuestion]        = useState('');
  const [reponse,         setReponse]         = useState('');
  const [loadingConseil,  setLoadingConseil]  = useState(false);

  // Pour la fiche marketing par voiture
  const [voitures,        setVoitures]        = useState([]);
  const [selectedId,      setSelectedId]      = useState('');
  const [marketing,       setMarketing]       = useState('');
  const [loadingMkt,      setLoadingMkt]      = useState(false);

  const [erreur,          setErreur]          = useState('');

  // ─── Charger la liste des voitures au montage (pour le sélecteur) ───────
  useEffect(() => {
    API.get('/voitures',
          {auth: { username: 'admin', password: '1234' }}
    )
      .then(res => setVoitures(res.data))
      .catch(() => setErreur('Impossible de charger la liste des voitures.'));
  }, []);

  // ─── Appel assistant : POST /api/voitures/assistant ─────────────────────
  const poserQuestion = () => {
    if (!question.trim()) return;
    setLoadingConseil(true);
    setReponse('');
    setErreur('');

    API.post('/voitures/assistant', question, {
      headers: { 'Content-Type': 'text/plain' },
      auth: { username: 'admin', password: '1234' }
    })
      .then(res => {
        setReponse(res.data);
        setLoadingConseil(false);
      })
      .catch(err => {
        setErreur("L'assistant n'a pas pu répondre. Vérifiez qu'Ollama tourne.");
        console.error(err);
        setLoadingConseil(false);
      });
  };

  // ─── Appel marketing : GET /api/voitures/{id}/marketing ─────────────────
  const genererMarketing = () => {
    if (!selectedId) return;
    setLoadingMkt(true);
    setMarketing('');
    setErreur('');

    API.get(`/voitures/${selectedId}/marketing`,
      {auth: { username: 'admin', password: '1234' }}
    )
      .then(res => {
        setMarketing(res.data);
        setLoadingMkt(false);
      })
      .catch(err => {
        setErreur("Impossible de générer la description marketing.");
        console.error(err);
        setLoadingMkt(false);
      });
  };

  // ─── Rendu ────────────────────────────────────────────────────────────────
  return (
    <div className="mt-4">

      {/* Message d'erreur global */}
      {erreur && (
        <div className="alert alert-danger">{erreur}</div>
      )}

      {/* ══ Section 1 : Conseiller IA ════════════════════════════════════ */}
      <div className="card border-dark bg-dark text-white mb-4">
        <div className="card-header">
          🤖 Conseiller Automobile Intelligent (IA)
        </div>
        <div className="card-body">
          <p className="text-muted small">
            Décrivez ce que vous recherchez et l'IA vous recommande
            les voitures disponibles dans notre stock.
          </p>

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control bg-dark text-white border-secondary"
              placeholder="Ex: Je cherche une voiture rouge, budget 100 000 DH..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && poserQuestion()}
            />
            <button
              className="btn btn-primary"
              onClick={poserQuestion}
              disabled={loadingConseil || !question.trim()}
            >
              {loadingConseil
                ? <><span className="spinner-border spinner-border-sm me-2" />L'IA réfléchit...</>
                : '💬 Demander conseil'
              }
            </button>
          </div>

          {/* Réponse de l'IA */}
          {reponse && (
            <div className="alert alert-info mt-3" style={{ whiteSpace: 'pre-line' }}>
              <strong>🚗 Recommandation de l'IA :</strong>
              <hr />
              {reponse}
            </div>
          )}
        </div>
      </div>

      {/* ══ Section 2 : Description Marketing par voiture ════════════════ */}
      <div className="card border-dark bg-dark text-white">
        <div className="card-header">
          📣 Générateur de Description Marketing
        </div>
        <div className="card-body">
          <p className="text-muted small">
            Sélectionnez une voiture et l'IA génère une annonce publicitaire
            professionnelle pour elle.
          </p>

          <div className="input-group mb-3">
            <select
              className="form-select bg-dark text-white border-secondary"
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">-- Choisir une voiture --</option>
              {voitures.map(v => (
                <option key={v.id} value={v.id}>
                  {v.marque} {v.modele} — {v.couleur} ({v.annee}) — {v.prix} DH
                </option>
              ))}
            </select>
            <button
              className="btn btn-warning text-dark"
              onClick={genererMarketing}
              disabled={loadingMkt || !selectedId}
            >
              {loadingMkt
                ? <><span className="spinner-border spinner-border-sm me-2" />Génération...</>
                : '✨ Générer l\'annonce'
              }
            </button>
          </div>

          {/* Annonce générée */}
          {marketing && (
            <div className="alert alert-warning mt-3" style={{ whiteSpace: 'pre-line' }}>
              <strong>📝 Annonce publicitaire :</strong>
              <hr />
              {marketing}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

export default AssistantCar;