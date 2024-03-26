/* eslint-disable @typescript-eslint/no-explicit-any */
import c from "classnames";
import { useTheme } from "contexts/use-theme";
import { usePokemon, usePokemonList, useTextTransition } from "hooks";
import { useState } from "react";
import { randomMode } from "utils/random";
import { Button } from "./button";
import { LedDisplay } from "./led-display";

import "./pokedex.css";

export function Pokedex() {
  const { theme } = useTheme();
  const { ready, resetTransition } = useTextTransition();
  const { pokemonList } = usePokemonList();
  const [i, setI] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [displayMsj, setDisplayMsj] = useState(false);
  const { pokemon: selectedPokemon, debilidades } = usePokemon(pokemonList[i]);
  const { pokemon: nextPokemon } = usePokemon(pokemonList[i + 1]);

  const prev = () => {
    resetTransition();
    if (i === 0) {
      setI(pokemonList.length - 1);
    }
    setI((i) => i - 1);
  };

  const next = () => {
    resetTransition();
    if (i === pokemonList.length - 1) {
      setI(0);
    }
    setI((i) => i + 1);
  };

  const addToFavorites = (event: any) => {
    event.preventDefault();
    if (favorites.length <= 5) {
      const newFavorites = [...favorites];
      newFavorites.push(selectedPokemon);
      setFavorites(newFavorites);
      console.log(newFavorites);
    } else {
      setDisplayMsj(true);
    }
  };

  return (
    <div>
      <div className={c("pokedex", `pokedex-${theme}`)}>
        <div className="panel left-panel">
          <div className="pokemon-info-container">
            <div
              style={{
                padding: 20,
                background: "#fff",
                borderRadius: 10,
                margin: 2,
                marginRight: 8,

                border: "solid 4px #000",
              }}
            >
              <h4 style={{ margin: 0 }}>WEAKNESS:</h4>
              <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                {debilidades.map((debilidad: any, i: number) => {
                  return <li key={`Debilidad-` + i}>{debilidad}</li>;
                })}
              </ul>
            </div>
            <div className="screen main-screen">
              {selectedPokemon && (
                <img
                  className={c(
                    "sprite",
                    "obfuscated",
                    ready && "ready",
                    ready && `ready--${randomMode()}`
                  )}
                  src={selectedPokemon.sprites.front_default}
                  alt={selectedPokemon.name}
                />
              )}
            </div>
            <div
              style={{
                padding: 20,
                background: "#fff",
                borderRadius: 10,
                margin: 2,
                marginLeft: 8,
                border: "solid 4px #000",
              }}
            >
              <h4 style={{ margin: 0 }}>TYPE</h4>
              <ul style={{ margin: 0, padding: 0, listStyleType: "none" }}>
                {selectedPokemon?.types.map((slot, i) => {
                  return <li key={`type-` + i}>{slot.type.name}</li>;
                })}
              </ul>
            </div>
          </div>
          <div className="screen name-display">
            <div
              className={c(
                "name",
                "obfuscated",
                ready && "ready",
                ready && `ready--${randomMode()}`
              )}
            >
              {selectedPokemon?.name}
            </div>
          </div>
          <button
            type="button"
            style={{
              fontSize: 25,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={addToFavorites}
          >
            ⭐
          </button>
          <div
            style={{
              background: "#fff",
              color: "red",
              border: "solid 3px #000",
              padding: 10,
              display: displayMsj ? "block" : "none",
            }}
          >
            All Your Team is completed
          </div>
        </div>
        <div className="panel right-panel">
          <div className="controls leds">
            <LedDisplay color="blue" />
            <LedDisplay color="red" />
            <LedDisplay color="yellow" />
          </div>
          <div className="screen second-screen">
            {nextPokemon && (
              <img
                className={c(
                  "sprite",
                  "obfuscated",
                  ready && "ready",
                  ready && `ready--${randomMode()}`
                )}
                src={nextPokemon.sprites.front_default}
                alt={nextPokemon.name}
              />
            )}
          </div>
          <div className="controls">
            <Button label="prev" onClick={prev} />
            <Button label="next" onClick={next} />
          </div>
        </div>
      </div>
      <div className={c("myTeam", `myTeam-gray`)}>
        <h2 style={{ margin: 0 }}>
          MY TEAM
          <span style={{ fontSize: 14 }}>
            ({favorites.length} Pokemons in your team)
          </span>
        </h2>
        <ul className="teamList">
          {favorites.map((f, i) => {
            return (
              <li key={`favorite-${i}`}>
                <img
                  className={c(
                    "sprite",
                    "obfuscated",
                    ready && "ready",
                    ready && `ready--${randomMode()}`
                  )}
                  src={f.sprites.front_default}
                  alt={f.name}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
