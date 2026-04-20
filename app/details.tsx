import { colorsByType, statColors } from "@/constants/colors";
import { statNameMap } from "@/constants/mappings";
import { usePokemonDetails } from "@/hooks/usePokemonDetails";
import { PokemonDetails } from "@/types/pokemonDetails";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

const AboutRoute = ({ pokemonDetails }: { pokemonDetails: PokemonDetails }) => (
  <View style={styles.aboutContainer}>
    <View>
      <Text style={styles.heading}>Pokedex Entry</Text>
      <Text style={styles.bodyText}>{pokemonDetails.pokedexEntry}</Text>
    </View>
    <View>
      <Text style={styles.heading}>Type</Text>
      <View style={{ flexDirection: "row", gap: 6 }}>
        {pokemonDetails.types.map((type) => (
          <Text
            style={[styles.typeLabel, { backgroundColor: colorsByType[type] }]}
            key={type}
          >
            {type}
          </Text>
        ))}
      </View>
    </View>
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View>
        <Text style={styles.heading}>Weight</Text>
        <Text style={styles.bodyText}>{pokemonDetails.weight} kg</Text>
      </View>
      <View>
        <Text style={styles.heading}>Height</Text>
        <Text style={styles.bodyText}>{pokemonDetails.height} m</Text>
      </View>
    </View>
    <View>
      <Text style={styles.heading}>Abilities</Text>
      {pokemonDetails.abilities.map((ability, index) => (
        <Text
          style={styles.bodyText}
          key={ability.name}
        >{`${index + 1}. ${ability.name} ${ability.hidden ? "(hidden)" : ""}`}</Text>
      ))}
    </View>
  </View>
);

const StatsRoute = ({ pokemonDetails }: { pokemonDetails: PokemonDetails }) => {
  const { width } = useWindowDimensions();
  const BAR_MAX_WIDTH = width - 180; // space for label + value

  return (
    <View style={{ padding: 16, gap: 10 }}>
      <Text style={styles.heading}>Base Stats</Text>
      {pokemonDetails.stats.map((stat, i) => {
        const barWidth = (stat.value / 255) * BAR_MAX_WIDTH;
        const color = statColors[i]?.frontColor ?? "#888";

        return (
          <View
            key={stat.name}
            style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
          >
            {/* Stat name */}
            <Text
              style={{
                width: 80,
                fontSize: 12,
                color: "#888",
                textAlign: "right",
              }}
            >
              {statNameMap[stat.name]}
            </Text>
            {/* Bar */}
            <View
              style={{
                width: BAR_MAX_WIDTH,
                backgroundColor: "#eee",
                borderRadius: 10,
                height: 10,
              }}
            >
              <View
                style={{
                  width: barWidth,
                  backgroundColor: color,
                  borderRadius: 10,
                  height: 10,
                }}
              />
            </View>
            {/* Value */}
            <Text style={{ fontSize: 12, color: "#888", width: 30 }}>
              {stat.value}
            </Text>
          </View>
        );
      })}
    </View>
  );
};
const MovesRoute = ({ pokemonDetails }: { pokemonDetails: PokemonDetails }) => (
  <View style={styles.container}>
    <Text style={styles.heading}>Moves learned</Text>
    <FlatList
      data={pokemonDetails.moves}
      keyExtractor={(item) => item.name}
      contentContainerStyle={{ gap: 12, marginTop: 16, padding: 8 }}
      renderItem={({ item: move }) => {
        return (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",

              backgroundColor: "#fff",
              elevation: 3,
              padding: 16,
              borderRadius: 20,
            }}
          >
            <Text style={styles.bodyText}>{move.name}</Text>
            {/* <Text>{move.levelLearnedAt}</Text> */}
            {/* <Text>{move.MoveLearnMethod}</Text> */}
          </View>
        );
      }}
    />
  </View>
);
const EvolutionRoute = ({
  pokemonDetails,
}: {
  pokemonDetails: PokemonDetails;
}) => (
  <View style={styles.container}>
    <Text style={styles.heading}>Evolution chain</Text>
    {pokemonDetails.evolutionChain.map((stage) => (
      <View
        key={stage.name}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image source={{ uri: stage.image }} height={100} width={100} />
        <Text>
          {stage.method === "Base form"
            ? "Doesn't evolve further"
            : stage.method.startsWith("Level")
              ? `Evolves at ${stage.method}`
              : stage.method}
        </Text>
      </View>
    ))}
  </View>
);

export default function Details() {
  const params = useLocalSearchParams<{ name: string }>();
  const { isLoading, pokemonDetails } = usePokemonDetails(params.name);

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
        return <AboutRoute pokemonDetails={pokemonDetails!} />;
      case "stats":
        return <StatsRoute pokemonDetails={pokemonDetails!} />;
      case "evolution":
        return <EvolutionRoute pokemonDetails={pokemonDetails!} />;
      case "moves":
        return <MovesRoute pokemonDetails={pokemonDetails!} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colorsByType[pokemonDetails?.types[0] as string],
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              marginTop: 16,
            }}
          >
            {params.name}
          </Text>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["60%", "65%"]}
          index={0}
          enableOverDrag={false}
          enableDynamicSizing={false}
          enableHandlePanningGesture={false}
          enablePanDownToClose={false}
          handleIndicatorStyle={{ display: "none" }}
          backgroundStyle={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
          detached={true}
          enableContentPanningGesture={false}
        >
          <BottomSheetView
            style={{ flex: 1, padding: 16, position: "relative" }}
          >
            <View
              style={{
                position: "absolute",
                top: -200,
                alignSelf: "center",
                zIndex: 50,
              }}
            >
              <Image
                source={{ uri: pokemonDetails?.image }}
                height={250}
                width={250}
              />
            </View>
            <TabView
              style={{ height: 500 }}
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
          </BottomSheetView>
        </BottomSheet>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  spinnerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  aboutContainer: { flex: 1, padding: 16, gap: 16 },
  heading: { fontSize: 22, fontWeight: "bold" },
  bodyText: { fontSize: 17, color: "gray" },
  typeLabel: {
    width: 75,
    borderRadius: 50,
    padding: 2,
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    flexDirection: "row",
    textAlign: "center",
    marginTop: 8,
    elevation: 3,
  },
});
