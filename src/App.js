import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";
import { FaSearch } from "react-icons/fa";
import { FcSpeaker } from "react-icons/fc";

function App() {
  const [data, setData] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSidebar, setShowSidebar] = useState(false); // State to control sidebar visibility

  useEffect(() => {
    const storedRecentSearches = localStorage.getItem("recentSearches");
    if (storedRecentSearches) {
      setRecentSearches(JSON.parse(storedRecentSearches));
    }
  }, []);

  function getMeaning() {
    Axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${searchWord}`)
      .then((response) => {
        setData(response.data[0]);
        setRecentSearches((prevSearches) => {
          const updatedSearches = [searchWord, ...prevSearches.slice(0, 4)];
          localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
          return updatedSearches;
        });
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });
  }

  function playAudio() {
    if (data && data.phonetics && data.phonetics.length > 0) {
      let audio = new Audio(data.phonetics[0].audio);
      audio.play();
    }
  }

  return (
    <div className="App">
      <div className="navbar">
        <h1>Dictionary</h1>
        <button onClick={() => setShowSidebar(!showSidebar)}>Recently Searched</button>
      </div>
      {showSidebar && (
        <div className="sidebar">
          <div className="recentlySearched">
            <h3>Recently Searched:</h3>
            <ul>
              {recentSearches.map((word, index) => (
                <li key={index}>{word}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="main">
        <div className="searchBox">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              setSearchWord(e.target.value);
            }}
          />
          <button
            onClick={() => {
              getMeaning();
            }}
          >
            <FaSearch size="10px" />
          </button>
        </div>
        {data && (
          <div className="showResults">
            <h2>
              {data.word}{" "}
              <button
                onClick={() => {
                  playAudio();
                }}
              >
                <FcSpeaker size="26px" />
              </button>
            </h2>
            <h4>Parts of speech:</h4>
            <p>{data.meanings[0].partOfSpeech}</p>

            <h4>Definition:</h4>
            <p>{data.meanings[0].definitions[0].definition}</p>

            {/* Handle example data */}
            {data.meanings[0].definitions[0].example && (
              <>
                <h4>Example:</h4>
                <p>{data.meanings[0].definitions[0].example}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;