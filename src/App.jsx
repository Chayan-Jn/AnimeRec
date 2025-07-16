import { useState } from "react";
import "./app.css";

const App = () => {
  const [anime, setAnime] = useState("");
  const [recom, setRecom] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setRecom(null);
    setSearched(true);

    if (anime.trim()) {
      try {
        const response = await fetch(
          `https://animerecombackend.onrender.com/recommend?anime=${anime}`,
          { method: "GET" }
        );
        const data = await response.json();
        setRecom(data);
      } catch (err) {
        console.log("Error fetching recommendation ", err);
      }
    }
  }

  return (
    <div className="main">
      <form onSubmit={handleSubmit} className="form">
        <input
          onChange={(e) => {
            setSearched(false);
            setAnime(e.target.value);
          }}
          value={anime}
          placeholder="Anime "
        />
        <button type="submit">RECOMMEND</button>
      </form>

      {recom && (
        <div className="results-wrapper">
          <div className="to-recom">Recommendations for {anime} are</div>
          {Object.entries(recom).map(([key, value]) => (
            <div className="recom-container" key={value}>
              <span className="key">{key}</span>
              <span className="value">{value}</span>
            </div>
          ))}
        </div>
      )}

      {anime && !recom && searched && (
        <div>
          <div className="searching">Searching for the best animes</div>
        </div>
      )}
    </div>
  );
};

export default App;
