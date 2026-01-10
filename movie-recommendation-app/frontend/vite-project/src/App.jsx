import { useState } from "react";
import { getRecommendations } from "./api";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [movies, setMovies] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await getRecommendations(input);
    setMovies(result);
  };

  return (
    <div className="container">
      <h2>🎬 Movie Recommendation App</h2>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. action movies with strong female lead"
        />
        <button type="submit">Recommend</button>
      </form>

      <ul>
        {movies.map((movie, i) => (
          <li key={i}>{movie}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
