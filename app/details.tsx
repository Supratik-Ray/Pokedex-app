import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Details() {
  const params = useLocalSearchParams();
  return (
    <View>
      <Text>{params.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
