import "./App.css";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <section className="introduction">
        <h1> Té-triste ou té-joyeux? </h1>
        <p> Tout dépendra de ton score</p>
      </section>
      <section className="inscris-toi">
        <input
          placeholder="Your Username"
          type="text"
          name="text"
          className="input"
        />
        <Link to="/jeu">
          <button type="button" className="button-inscription">
            Start
          </button>
        </Link>
      </section>
    </>
  );
}

export default App;
