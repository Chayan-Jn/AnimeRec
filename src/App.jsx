import { useState } from "react";
import "./app.css";

const App = () => {
  const [anime, setAnime] = useState("");
  const [recom, setRecom] = useState(null);
  const [searched, setSearched] = useState(false);

  // Add this state to control arrow visibility
  const [showArrow, setShowArrow] = useState(true);

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
        setShowArrow(true); // Reset arrow visibility on new data
      } catch (err) {
        console.log("Error fetching recommendation ", err);
      }
    }
  }
  function handleScroll(e) {
    const target = e.currentTarget;
      // If no scrollable overflow, hide arrow immediately
      if (target.scrollHeight <= target.clientHeight) {
          setShowArrow(false);
          return;
      }

    const distanceFromBottom = target.scrollHeight - (target.scrollTop + target.clientHeight);
  
    // Define threshold as a % of total scroll height, e.g., 10%
    const threshold = target.scrollHeight * 0.30;
  
    // Hide arrow when scrolled within `threshold` distance of bottom
    setShowArrow(distanceFromBottom > threshold);
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
        <div className="results-wrapper" id="resultsWrapper" onScroll={handleScroll}>
          <div className="to-recom">Recommendations for {anime} are</div>
          {Object.entries(recom).map(([key, value]) => (
            <div className="recom-container" key={value}>
              <span className="key">{key}</span>
              <span className="value">{value}</span>
            </div>
          ))}

          {/* Conditionally render the arrow based on showArrow state */}
          {showArrow && <div className="scroll-arrow">&#x25BC;</div>}
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
