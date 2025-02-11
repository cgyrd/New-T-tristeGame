import { useEffect, useState } from "react";
import "./jeu.css";

function Jeu() {
  const largeur = 10;
  const hauteur = 20;

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
  };

  // Fonction pour créer une grille vide de taille hauteur x largeur
  const creerGrilleVide = () =>
    Array.from({ length: hauteur }, () => Array(largeur).fill(0)); // zéro pour les cases vides

  // Etat de la grille et de la pièce
  const [grille, setGrille] = useState(creerGrilleVide);
  const [piece, setPiece] = useState({
    x: 4,
    y: 0,
    forme: "I", // première pièce sera donc la forme I
  });

  // Fonction pour générer une nouvelle pièce aléatoire
  const nouvellePiece = () => {
    const nomsFormes = Object.keys(formes); // l'objet qui regroupe toutes les différentes formes de pièces
    return {
      x: 4,
      y: 0,
      forme: nomsFormes[Math.floor(Math.random() * nomsFormes.length)], // choisir aléatoirement parmi les différentes formes
    };
  };

  // Fonction pour obtenir la forme actuelle de la pièce :: plus simple pr réutilisation
  const getPieceForme = () => formes[piece.forme];

  // Vérifier si la pièce peut bouger à la nouvelle position
  const peutBouger = (x: number, y: number, forme: number[][]): boolean => {
    return forme.every((ligne: number[], dy: number) =>
      ligne.every(
        (val: number, dx: number) =>
          !val ||
          (y + dy < hauteur && // jz vérifie que la case ne dépasse pas le bas de la grille
            x + dx >= 0 &&
            x + dx < largeur && // je vérifie que case ne dépasse pas à gauche et à droite
            grille[y + dy]?.[x + dx] === 0) // est ce que la case est bien libre, et donc égale à zéro ?
      )
    );
  };

  // Type pour décrire la structure des formes (chaînes de caractères et matrices)
  type Formes = {
    [key: string]: number[][]; // toutes les clés de l'objet sont une chaîne de caractère et la valeur est une matrice de nombre
  };

  // Fonction pour fixer la pièce dans la grille
  const fixerPieceDansGrille = (): number[][] => {
    const nouvelleGrille: number[][] = grille.map((row: number[]) => [...row]); // c'est une copie de la grille, map pour parcourir chaque row, et créer une copie pour ne pas modifier la ligne originale

    getPieceForme().forEach((ligne: number[], dy: number) => {
      // parcourir chaque case de la ligne
      ligne.forEach((val: number, dx: number) => {
        if (val) nouvelleGrille[piece.y + dy][piece.x + dx] = 1; // placement de la pièce dans la case si val = 1 à la nouvelle position
      });
    });

    return nouvelleGrille;
  };

  // Fonction pour supprimer les lignes complètes
  const supprimerLignesCompletes = (grille: number[][]): number[][] => {
    const nouvellesLignes: number[][] = grille.filter(
      (row: number[]) => row.includes(0) // parcourir les rows et stocker que celles contenant des espaces vides (0)
    );
    while (nouvellesLignes.length < hauteur) {
      // tant que le nombre de lignes < hauteur de grille, on ajoute des lignes vides
      nouvellesLignes.unshift(Array(largeur).fill(0)); // ajout d'une ligne vide (remplie de 0)
    }
    return nouvellesLignes;
  };

  // Fonction pour déplacer la pièce
  const deplacerPiece = (dx: number, dy: number) => {
    const newX = piece.x + dx; // calcule la nouvelle position horizontale après déplacement
    const newY = piece.y + dy; // idem pour la position verticale
    const forme = getPieceForme(); // récupère la forme de la pièce

    if (peutBouger(newX, newY, forme)) {
      // vérifier si la place est libre et si la pièce peut être déplacée
      setPiece({ ...piece, x: newX, y: newY }); // mise à jour de la pièce avec la nouvelle position
    } else if (dy === 1) {
      // si la pièce ne peut pas bouger vers le bas (dy = 1)
      const grilleFixee = fixerPieceDansGrille(); // fixer la pièce dans la grille
      setGrille(supprimerLignesCompletes(grilleFixee)); // mettre à jour la grille en supprimant les lignes complètes
      setPiece(nouvellePiece()); // générer une nouvelle pièce
    }
  };

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
  }, [piece]);

  // Automatiser le déplacement de la pièce vers le bas toutes les 600ms
  useEffect(() => {
    const interval = setInterval(() => deplacerPiece(0, 1), 600); // déplace la pièce vers le bas toutes les 600ms
    return () => clearInterval(interval); // nettoyage de l'intervalle lors du démontage du composant
  }, [piece]);

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

  return (
    <>
      <section className="règles">
        <p>
          Pour gagner, il te faut juste être plus malin que les pièces.
          Attention aux pièges !
        </p>
      </section>
      <section className="grille-jeu">{afficherGrille()}</section>
    </>
  );
}

export default Jeu;
