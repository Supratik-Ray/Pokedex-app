import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

interface PokemonDetails {
  name: string;
  types: string[];
  image: string;
  height: number;
  weight: number;
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  crySound: string;
  moves: PokemonMove[];
}

interface PokemonAbility {
  name: string;
  hidden: boolean;
}

interface PokemonStat {
  name: string;
  value: number;
}

interface PokemonMove {
  name: string;
  levelLearnedAt: number;
  MoveLearnMethod: string;
}

const AboutRoute = () => (
  <View>
    <Text>About Content</Text>
  </View>
);

const StatsRoute = () => (
  <View>
    <Text>Stats Content</Text>
  </View>
);
const MovesRoute = () => (
  <View>
    <Text>Stats Content</Text>
  </View>
);
const EvolutionRoute = () => (
  <View>
    <Text>Stats Content</Text>
  </View>
);

export default function Details() {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const params = useLocalSearchParams<{ name: string }>();
  const layout = useWindowDimensions();

  //bottom-sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  //tab-view
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "about", title: "About" },
    { key: "stats", title: "Stats" },
    { key: "evolution", title: "Evolution" },
    { key: "moves", title: "Moves" },
  ]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "about":
        return <AboutRoute />;
      case "stats":
        return <StatsRoute />;
      case "evolution":
        return <EvolutionRoute />;
      case "moves":
        return <MovesRoute />;
      default:
        return null;
    }
  };

  useEffect(() => {
    async function fetchPokemonDetails() {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${params.name}`,
        );
        const data = await response.json();
        const pokemonDetails = {
          name: data.name,
          height: data.height,
          weight: data.weight,
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
        };

        console.log(JSON.stringify(pokemonDetails));
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
    fetchPokemonDetails();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View>
          <Text>{params.name}</Text>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["50%", "70%"]}
          index={1}
          enablePanDownToClose={false}
          handleIndicatorStyle={{ display: "none" }}
          backgroundStyle={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
          enableContentPanningGesture={false}
        >
          <BottomSheetView style={{ flex: 1, padding: 16 }}>
            <View style={{ flex: 1 }}>
              <TabView
                style={{ height: 400 }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                swipeEnabled={true}
                renderTabBar={(props) => (
                  <TabBar
                    {...props}
                    style={{
                      backgroundColor: "white",
                      elevation: 0,
                      shadowOpacity: 0,
                    }}
                    activeColor="black"
                    inactiveColor="gray"
                    indicatorStyle={{
                      backgroundColor: "purple",
                      height: 3,
                      borderRadius: 50,
                    }}
                  />
                )}
              />
            </View>
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});
