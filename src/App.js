import "./App.css";
import { getAllPokemon } from "./utils/pokemon";
import { useEffect, useState } from "react";
import { getPokemon } from "./utils/pokemon";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon/ ";

  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
  const [nextURL, setNextURL] = useState("")
  const [prevURL, setPrevURL] = useState("")

  useEffect(() => {
    const fetchPokemonDate = async () => {
      //全てのぽけもんでーたを取得
      const res = await getAllPokemon(initialURL);
      //各ポケモンの詳細なデータを取得
      loadPokemon(res.results);
      console.log(res.next)
      setNextURL(res.next)
      setLoading(false);
    };
    fetchPokemonDate();
  }, []);

  const loadPokemon = async (data) => {
    const _pokemonData = await Promise.all(
      data.map((pokemon) => {
        const pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };


  const handleNextPage = async () => {
    if (!nextURL) return
    setLoading(true)
    const data = await getAllPokemon(nextURL)
    console.log(data)
    await loadPokemon(data.results)
    setLoading(false)
    setNextURL(data.next)
    setPrevURL(data.previous)
  }
  const handlePrevPage = async () => {
    if (!prevURL) return
    setLoading(true)
    const data = await getAllPokemon(prevURL)
    await loadPokemon(data.results)
    setLoading(false)
    setNextURL(data.next)
    setPrevURL(data.previous)
  }


  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ロード中・・・</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;
