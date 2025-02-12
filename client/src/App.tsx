import { useUser } from "./Context/UserContext";
import  { useState } from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function App() {
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const navigate= useNavigate();

const handleStart = async () => {
  console.log("handleStart called with username:", username);

  try {
    const response = await axios.post("http://localhost:3310/api/user", {
      name: username,
    });

    console.log("Response received:", response.data);
    setUser({ name: username, id: response.data.id });

    // Redirige l'utilisateur vers une autre page (ex: "/game")
    navigate("/jeu");
  } catch (error) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
  }
};


  return (
    <>
      <div className="background"></div>
      <section className="introduction">
        <h1>Té-triste ou té-joyeux?</h1>
        <p>Tout dépendra de ton score</p>
      </section>
      <section className="inscris-toi">
        <input
          placeholder="Your Username"
          type="text"
          name="text"
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          type="submit"
          className="button-inscription"
          onClick={handleStart}
        >
          Start
        </button>
      </section>
    </>
  );
}

export default App;
