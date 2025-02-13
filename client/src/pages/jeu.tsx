import { useEffect, useState, useCallback  } from "react";
import { useNavigate } from "react-router-dom";
import "./jeu.css";
import { useUser } from "../Context/UserContext";
import "./jeu-deux"

function Jeu() {
  const largeur = 10;
  const hauteur = 20;
  const { user } = useUser();
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const navigate= useNavigate();

  // Définition des formes des pièces sous forme de matrice
  const formes: Formes = {
    I: [[1, 1, 1, 1]], // barre de 4 espaces
    O: [
      [1, 1], // carré 2 x 2
      [1, 1],
    ],
    L: [
      [0, 1, 0], // T à l'envers
      [1, 1, 1],
    ],
    Z: [
      [1, 1, 0], // forme Z
      [0, 1, 1],
    ],
    i: [
      [1], // forme petit i
      [1],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0], // forme  Z à lenvers
    ],
  };

  // Fonction pour créer une grille vide de taille hauteur x largeur
  const creerGrilleVide = () =>
    Array.from({ length: hauteur }, () => Array(largeur).fill(0)); // zéro pour les cases vides

  // États du jeu
  const [grille, setGrille] = useState(creerGrilleVide);
  const [piece, setPiece] = useState(nouvellePiece);
  const [score, setScore] = useState(0); // Stockage du score

  // Fonction pour générer une nouvelle pièce aléatoire
  function nouvellePiece() {
    const nomsFormes = Object.keys(formes);
    return {
      x: 4,
      y: 0,
      forme: nomsFormes[Math.floor(Math.random() * nomsFormes.length)], // choisir aléatoirement parmi les différentes formes
    };
  }

  // Fonction pour obtenir la forme actuelle de la pièce :: plus simple pr réutilisation
  const getPieceForme = () => formes[piece.forme];

  // Vérifier si la pièce peut bouger à la nouvelle position
  const peutBouger = (x: number, y: number, forme: number[][]): boolean => {
    return forme.every((ligne, dy) =>
      ligne.every(
        (val, dx) =>
          !val ||
          (y + dy < hauteur && // vérifie que la case ne dépasse pas le bas de la grille
            x + dx >= 0 &&
            x + dx < largeur && // vérifie que la case ne dépasse pas à gauche et à droite
            grille[y + dy]?.[x + dx] === 0) // est-ce que la case est bien libre, et donc égale à zéro ?
      )
    );
  };

  // Type pour décrire la structure des formes (chaînes de caractères et matrices)
  type Formes = {
    [key: string]: number[][]; // toutes les clés de l'objet sont une chaîne et la valeur est une matrice de nombres
  };

  // Fonction pour fixer la pièce dans la grille
  const fixerPieceDansGrille = (): number[][] => {
    const nouvelleGrille = grille.map((row) => [...row]); // c'est une copie de la grille, map pour parcourir chaque row, et créer une copie pour ne pas modifier la ligne originale

    getPieceForme().forEach((ligne, dy) => {
      ligne.forEach((val, dx) => {
        if (val) nouvelleGrille[piece.y + dy][piece.x + dx] = 1; // placement de la pièce dans la case si val = 1 à la nouvelle position
      });
    });

    return nouvelleGrille;
  };

  // Fonction pour supprimer les lignes complètes et mettre à jour le score
  const supprimerLignesCompletes = (grille: number[][]): number[][] => {
    const nouvellesLignes = grille.filter((row) => row.includes(0));
    const lignesSupprimees = hauteur - nouvellesLignes.length; // Calcul des lignes supprimées
    if (lignesSupprimees > 0) {
      setScore((prevScore) => {
        const newScore = prevScore + lignesSupprimees * 10; // +10 points par ligne
        if (newScore >= 20) {
          setGameOver(true); // Si le score atteint 20, on arrête le jeu
          setGameWon(true); // on arrête le jeu car victoire
        }
        return newScore;
      });
    }

    while (nouvellesLignes.length < hauteur) {
      // tant que le nombre de lignes < hauteur de grille, on ajoute des lignes vides
      nouvellesLignes.unshift(Array(largeur).fill(0)); // ajout de lignes vides en haut
    }

    return nouvellesLignes;
  };

  // Fonction pour déplacer la pièce
  const deplacerPiece = useCallback(
    (dx: number, dy: number) => {
      const newX = piece.x + dx; // calcule la nouvelle position horizontale après déplacement
      const newY = piece.y + dy; // idem pour la position verticale
      const forme = getPieceForme(); // récupère la forme de la pièce

      if (peutBouger(newX, newY, forme)) {
        // vérifier si la place est libre et si la pièce peut être déplacée
        setPiece((prev) => ({ ...prev, x: newX, y: newY }));
      } else if (dy === 1) {
        // Si la pièce ne peut plus descendre
        const grilleFixee = fixerPieceDansGrille(); // mise à jour de la pièce avec la nouvelle position
        setGrille(supprimerLignesCompletes(grilleFixee)); // mettre à jour la grille en supprimant les lignes complètes
        const nouvelle = nouvellePiece();
        if (!peutBouger(nouvelle.x, nouvelle.y, formes[nouvelle.forme])) {
          setGameOver(true); // si les poèces ne peuvent plus être insérées, game oveer
          return;
        }

        setPiece(nouvelle);
      }
    },
    [piece, grille, gameOver]
  );
  // Gestion des événements de clavier pour déplacer la pièce
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const directions: { [key: string]: [number, number] } = {
        ArrowDown: [0, 1], // flèche bas = déplacer vers le bas
        ArrowLeft: [-1, 0], // flèche gauche = déplacer vers la gauche
        ArrowRight: [1, 0], // flèche droite = déplacer vers la droite
      };

      const direction = directions[event.key];
      if (direction) {
        deplacerPiece(...direction); // déplace la pièce selon la touche appuyée
      }
    };

    window.addEventListener("keydown", handleKeyDown); // écoute les événements de touche enfoncée
    return () => window.removeEventListener("keydown", handleKeyDown); // nettoyage de l'écouteur lors du démontage du composant
  }, [deplacerPiece]);

  // Automatiser le déplacement de la pièce vers le bas toutes les 600ms
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => deplacerPiece(0, 1), 600); // déplace la pièce vers le bas toutes les 600ms
    return () => clearInterval(interval); // nettoyage de l'intervalle lors du démontage du composant
  }, [deplacerPiece]);

  // Fonction pour afficher la grille
  const afficherGrille = () => {
    const grilleAffichee = grille.map((ligne) => [...ligne]);

    getPieceForme().forEach((ligne, dy) =>
      ligne.forEach((val, dx) => {
        if (val) {
          grilleAffichee[piece.y + dy][piece.x + dx] = 1;
        }
      })
    );

    return grilleAffichee.map((ligne, i) => (
      <div key={i} className="ligne">
        {ligne.map((cell, j) => (
          <div key={j} className={`case ${cell ? "remplie" : ""}`} />
        ))}
      </div>
    ));
  };

  // proposer de rejouer quand "tu as perduuu"
  const startOver = () => {
    setGrille(creerGrilleVide());
    setPiece(nouvellePiece());
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

    const handleStart = () => {
      // Naviguer vers l'étape 2
      navigate("/jeu-deux");
    };

  return (
    <>
      <div className="background"></div>
      <section className="jeu-et-point">
        <section className="profil-joueur">
          <section className="règles">
            <p>
              Pour gagner, il te faut juste être plus malin que les pièces.
              Attention aux pièges !
            </p>
          </section>
          <section className="user">
            <p>User: {user?.name || "Anonyme"}</p>
            <p>Score : {score}</p>
          </section>
          {gameOver ? (
            gameWon ? (
              <button className="win-button" onClick={handleStart}>
                C'était trop simple, continue !
              </button>
            ) : (
              <button className="start-over" onClick={startOver}>
                Rejouer
              </button>
            )
          ) : null}
        </section>
        <section className="grille-jeu">{afficherGrille()}</section>
      </section>
    </>
  );
}
export default Jeu;
