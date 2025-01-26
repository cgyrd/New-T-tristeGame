import "./App.css";
import Jeux from "./components/plateau";

function App() {
  return (
    <>
      <section className="introduction">
        <h1> Té-triste ou té-joyeux? </h1>
        <p> Tout dépendra de ton score</p>
      </section>
      <section className="plateau-jeu">
        <Jeux />
      </section>
    </>
  );
}

export default App;
