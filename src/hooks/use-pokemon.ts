import type { Pokemon, PokemonUri } from "models";
import { useEffect, useState } from "react";

const cache = new Map<string, Pokemon>();

export function usePokemon(pokemonUri: PokemonUri) {
  const [isLoading, setIsLoading] = useState(true);
  const [pokemon, setPokemon] = useState<Pokemon>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [debilidades, setDebilidades]= useState<any>([]);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await fetch(pokemonUri.url);
        const data = await response.json();
        cache.set(pokemonUri.url, data);
        setPokemon(data);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const types = data.types.map((type: { type: { name: any; }; }) => type.type.name);        
        
        let weaknesses = [];
        for (const type of types) {          
            const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
            const typeData = await typeResponse.json();
            console.log(typeData);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const doubleDamageTo = typeData.damage_relations.double_damage_to.map((damage: { name: any; }) => damage.name);
            weaknesses = weaknesses.concat(doubleDamageTo);
        }
        
        weaknesses = [...new Set(weaknesses)];        

        setDebilidades(weaknesses);

      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!pokemonUri) return;

    if (cache.has(pokemonUri.url)) {
      setPokemon(cache.get(pokemonUri.url));
      setIsLoading(false);
    } else {
      fetchPokemonData();
    }
  }, [pokemonUri]);

  return { pokemon, isLoading, debilidades};
}
