import { PokemonDetails } from "@/types/pokemonDetails";
import { useEffect, useState } from "react";

export function usePokemonDetails(pokemonName: string) {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPokemonDetails() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}`,
        );
        const data = await response.json();
        const response2 = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`,
        );
        const speciesData = await response2.json();
        const refinedData = {
          name: data.name,
          height: data.height / 10,
          weight: data.weight / 10,
          crySound: data.cries.latest,
          abilities: data.abilities.map((el: any) => ({
            name: el.ability.name,
            hidden: el.is_hidden,
          })),
          image: data.sprites.front_default,
          types: data.types.map((el: any) => el.type.name),
          stats: data.stats.map((el: any) => ({
            name: el.stat.name,
            value: el.base_stat,
          })),
          moves: data.moves.map((el: any) => ({
            name: el.move.name,
            levelLearnedAt: el.version_group_details[0].level_learned_at,
            moveLearnMethod: el.version_group_details[0].move_learn_method.name,
          })),
          pokedexEntry:
            speciesData.flavor_text_entries[0].flavor_text.replaceAll(
              "\n",
              " ",
            ),
        };
        setPokemonDetails(refinedData);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPokemonDetails();
  }, [pokemonName]);

  return { pokemonDetails, isLoading };
}
