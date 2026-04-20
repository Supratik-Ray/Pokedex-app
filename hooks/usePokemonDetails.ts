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

        const response3 = await fetch(speciesData.evolution_chain?.url);
        const evolutionData = await response3.json();

        let evolutionChain: any[] = [];
        let selectedStage = evolutionData?.chain;

        while (selectedStage) {
          const currentName = selectedStage?.species?.name || null;

          // 🔹 fetch image for this evolution
          let image = null;
          try {
            if (currentName) {
              const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${currentName}`,
              );
              const pokeData = await res.json();
              image = pokeData?.sprites?.front_default || null;
            }
          } catch (e) {
            image = null;
          }

          let method = "Base form";

          if (
            selectedStage?.evolves_to &&
            selectedStage.evolves_to.length > 0 &&
            selectedStage.evolves_to[0]?.evolution_details &&
            selectedStage.evolves_to[0].evolution_details.length > 0
          ) {
            const details = selectedStage.evolves_to[0].evolution_details[0];

            if (details.min_level !== null) {
              method = `Level ${details.min_level}`;
            } else if (details.min_happiness !== null) {
              method = `Happiness ${details.min_happiness}`;
            } else if (details.item !== null) {
              method = `Use ${details.item.name}`;
            } else if (details.trigger && details.trigger.name === "trade") {
              method = "Trade";
            } else if (details.time_of_day && details.time_of_day !== "") {
              method = `Time: ${details.time_of_day}`;
            } else if (details.known_move !== null) {
              method = `Learn ${details.known_move.name}`;
            } else if (details.held_item !== null) {
              method = `Hold ${details.held_item.name}`;
            } else {
              method = details.trigger?.name || "Special condition";
            }
          }

          evolutionChain.push({
            name: currentName,
            method,
            image,
          });

          // move forward safely
          if (
            selectedStage?.evolves_to &&
            selectedStage.evolves_to.length > 0
          ) {
            selectedStage = selectedStage.evolves_to[0];
          } else {
            break;
          }
        }

        const refinedData = {
          name: data?.name || "",
          height: data?.height ? data.height / 10 : null,
          weight: data?.weight ? data.weight / 10 : null,
          crySound: data?.cries?.latest || null,
          abilities:
            data?.abilities?.map((el: any) => ({
              name: el?.ability?.name || "",
              hidden: el?.is_hidden || false,
            })) || [],
          image: data?.sprites?.front_default || null,
          types: data?.types?.map((el: any) => el?.type?.name) || [],
          stats:
            data?.stats?.map((el: any) => ({
              name: el?.stat?.name || "",
              value: el?.base_stat || 0,
            })) || [],
          moves:
            data?.moves?.map((el: any) => ({
              name: el?.move?.name || "",
              levelLearnedAt:
                el?.version_group_details && el.version_group_details.length > 0
                  ? (el.version_group_details[0]?.level_learned_at ?? null)
                  : null,
              moveLearnMethod:
                el?.version_group_details && el.version_group_details.length > 0
                  ? (el.version_group_details[0]?.move_learn_method?.name ??
                    null)
                  : null,
            })) || [],
          pokedexEntry:
            speciesData?.flavor_text_entries &&
            speciesData.flavor_text_entries.length > 0
              ? speciesData.flavor_text_entries[0]?.flavor_text.replaceAll(
                  "\n",
                  " ",
                )
              : "",
          evolutionChain,
        };

        setPokemonDetails(refinedData as PokemonDetails);
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
