import { useCallback, useEffect, useState } from "react";
import "./plateau.css";

function Jeux() {
  // Création de la grille de jeu avec 20 lignes et 10 colonnes
  const [grille] = useState(
    Array.from({ length: 20 }, (_, rowIndex) =>
      Array.from({ length: 10 }, (_, colIndex) => ({
        id: `${rowIndex}-${colIndex}`,
        value: 0,
      })),
    ),
  );

  // Création de ma pièce
  const [piece, setPiece] = useState({
    x: 4,
    y: 0,
    forme: "I",
  });

  // Fonction pour déplacer ma pièce
  const deplacerPiece = useCallback((dx: number, dy: number) => {
    setPiece((prevPiece) => ({
      ...prevPiece,
      x: prevPiece.x + dx,
      y: prevPiece.y + dy,
    }));
  }, []);

  // Gérer les déplacements avec les touches
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        deplacerPiece(0, 1); // Descendre
      } else if (event.key === "ArrowLeft") {
        deplacerPiece(-1, 0); // Gauche
      } else if (event.key === "ArrowRight") {
        deplacerPiece(1, 0); // Droite
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deplacerPiece]);

  // Afficher ma grille sur l'écran
  const afficherGrille = () => {
    return grille.map((ligne) => (
      <div key={ligne[0].id.split("-")[0]} className="ligne">
        {ligne.map((caseElement) => (
          <div
            key={caseElement.id}
            className={`case ${
              caseElement.id === `${piece.y}-${piece.x}` ? "remplie" : ""
            }`}
          />
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

export default Jeux;
