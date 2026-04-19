import { colorsByType } from "@/constants/colors";
import { usePokemonDetails } from "@/hooks/usePokemonDetails";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabBar, TabView } from "react-native-tab-view";

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
        <View>
          <Text>{params.name}</Text>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={["60%", "70%"]}
          index={1}
          enablePanDownToClose={false}
          handleIndicatorStyle={{ display: "none" }}
          backgroundStyle={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
          }}
          detached={true}
          // enableOverDrag={false}
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
  spinnerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
