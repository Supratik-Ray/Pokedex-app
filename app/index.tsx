import { Link } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Pokemon {
  name: string;
  image: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType {
  type: {
    name: string;
    url: string;
  };
}

const colorsByType: Record<string, string> = {
  normal: "#CFCFC4", // soft gray-beige
  fire: "#F6A07A", // soft coral orange
  water: "#86BBD8", // soft sky blue
  electric: "#F7E08B", // soft pastel yellow
  grass: "#9ED9A0", // soft mint green
  ice: "#BFE8E6", // soft icy aqua
  fighting: "#D18C7E", // muted warm red-brown
  poison: "#C3A3D8", // soft lavender purple
  ground: "#D8C3A5", // soft sandy beige
  flying: "#B9D6F2", // airy light blue
  psychic: "#F7A7C1", // soft pink
  bug: "#C9D98E", // soft lime olive
  rock: "#C7B8A5", // soft stone tan
  ghost: "#9B89B3", // muted purple
  dragon: "#8FA7E0", // soft royal blue
  dark: "#7A7A7A", // softened charcoal gray
  steel: "#B5B8C0", // soft metallic gray
  fairy: "#F3B7E6", // soft pastel pink-lilac
};

export default function Index() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const offsetRef = useRef(0);

  async function getPokemons() {
    if (loading) return;
    try {
      setLoading(true);
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offsetRef.current}`,
      );
      const data = await res.json();
      //get pokemon image info
      const detailedData: Pokemon[] = await Promise.all(
        data.results.map(async (pokemon: any) => {
          const res2 = await fetch(pokemon.url);
          const data2 = await res2.json();
          return {
            name: pokemon.name,
            image: data2.sprites.front_default,
            imageBack: data2.sprites.back_default,
            types: data2.types,
          };
        }),
      );
      if (offsetRef.current === 0) {
        setPokemons(detailedData);
      } else {
        setPokemons((existingPokemons) => [
          ...existingPokemons,
          ...detailedData,
        ]);
      }

      offsetRef.current = offsetRef.current + 20;
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FlatList
      contentContainerStyle={{ gap: 16, padding: 16 }}
      data={pokemons}
      keyExtractor={(item) => item.name}
      onEndReached={getPokemons}
      onEndReachedThreshold={0.5}
      ListFooterComponent={loading ? <ActivityIndicator size="large" /> : null}
      renderItem={({ item: pokemon }) => {
        return (
          <Link
            key={pokemon.name}
            href={{ pathname: "/details", params: { name: pokemon.name } }}
          >
            <View
              style={{
                backgroundColor: colorsByType[pokemon.types[0].type.name],
                padding: 20,
                borderRadius: 20,
                width: "100%",
              }}
            >
              <Text style={styles.name}>{pokemon.name}</Text>
              <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Image
                  source={{ uri: pokemon.image }}
                  style={{ width: 150, height: 150 }}
                />
                <Image
                  source={{ uri: pokemon.imageBack }}
                  style={{ width: 150, height: 150 }}
                />
              </View>
            </View>
          </Link>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    color: "gray",
    textAlign: "center",
  },
});
