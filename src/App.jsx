import { useState, useEffect, useRef } from "react";
import "./app.css";

const App = () => {
  const [anime, setAnime] = useState("");
  const [recom, setRecom] = useState(null);
  const [searched, setSearched] = useState(false);

  // Control arrow visibility
  const [showArrow, setShowArrow] = useState(false);

  // Ref to the scrollable container to measure scroll heights
  const containerRef = useRef(null);

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
        // Arrow visibility will be set by useEffect below after render
      } catch (err) {
        console.log("Error fetching recommendation ", err);
      }
    }
  }

  // Update arrow visibility whenever recom changes and component updates
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Determine if scrolling is possible
    const canScroll = el.scrollHeight > el.clientHeight;
    setShowArrow(canScroll);
  }, [recom]);

  function handleScroll(e) {
    const target = e.currentTarget;

    // If no scroll overflow, hide arrow immediately
    if (target.scrollHeight <= target.clientHeight) {
      setShowArrow(false);
      return;
    }

    const distanceFromBottom = target.scrollHeight - (target.scrollTop + target.clientHeight);

    // Define threshold as 30% of total scroll height
    const threshold = target.scrollHeight * 0.30;

    // Show arrow only if scrolled more than threshold away from bottom
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
        <div
          className="results-wrapper"
          id="resultsWrapper"
          onScroll={handleScroll}
          ref={containerRef}
        >
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
