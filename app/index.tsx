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
import { colorsByType } from "@/constants/colors";

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
