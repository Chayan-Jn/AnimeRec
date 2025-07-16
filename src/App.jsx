import { useState } from "react"
import './app.css'
const App = ()=>{
  const [anime,setAnime] = useState("")
  const [recom,setRecom] = useState(null)
  const [searched,setSearched] = useState(false)
  async function handleSubmit(e){
    e.preventDefault();
    setRecom(null) // set recom to null so that the searching for anime comes up
    setSearched(true) // set this to true so that i know when to show the searching block.. 
    if(anime.trim()){
      try{
        const response = await fetch(`https://animerecombackend.onrender.com/recommend?anime=${anime}`,{method:"GET"})
        const data = await response.json()
        setRecom(data)
      }
      catch(err){
        console.log("Error fetching recommendation ",err)
      }
    }
  }
  return <div className="main">
    <form onSubmit={handleSubmit}
    className="form">
      <input onChange={e=>{
        setSearched(false)
        setAnime(e.target.value)
      }} value={anime}/>
      <button type="submit">RECOMMEND</button>
    </form>
    {recom && 
      <div>
        <div className="to-recom">
          Recommendation for {anime} are
        </div>
        {Object.entries(recom).map(([key,value])=>{
          return <div className="recom-container" key={value}>
            <span className="key">{key} </span>
            <span className="value">{value}</span>

          </div>
        })}
      </div>}
      {anime && !recom && searched && 
      <div>
        <div className="searching">
          Searching for the best animes
        </div>
      </div>}
  </div>
}
export default App