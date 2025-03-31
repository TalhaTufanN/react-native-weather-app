import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([1, 2, 3]);
  const handleLocation = (loc) => {
    console.log("Konum:", loc);
  };

  return (
    <View className="flex-1 relative bg-neutral-900">
      <StatusBar style="light" />
      {/* <Image blurRadius={70} source={require()} className="absolute h-full w-full"/> */}
      <SafeAreaView className="flex flex-1">
        {/* Search section */}
        <View style={{ height: "8%" }} className="mx-4 p-1 my-8 relative z-50">
          <View
            className="flex-row justify-end items-center p-1 rounded-full"
            style={{ backgroundColor: showSearch ? "#343434" : "transparent" }}
          >
            {showSearch ? (
              <TextInput
                placeholder="Şehir ara"
                placeholderTextColor={"lightgray"}
                className="pl-6 h-10 flex-1 text-base text-white"
              />
            ) : null}

            <TouchableOpacity
              onPress={() => toggleSearch(!showSearch)}
              style={{ backgroundColor: "#242424" }}
              className="rounded-full p-2 m-1"
            >
              <MagnifyingGlassIcon size="25" color="white" />
            </TouchableOpacity>
          </View>

          {locations.length > 0 && showSearch ? (
            <View className="absolute w-full bg-neutral-700 top-16 rounded-3xl">
              {locations.map((loc, index) => {
                let showB = index + 1 != locations.length;
                let bClass = showB ? "border-b-2 border-neutral-600" : "";
                return (
                  <TouchableOpacity
                    onPress={() => handleLocation(loc)}
                    key={index}
                    className={
                      "flex-row items-center border-0 p-3 px-4 mb-1 " + bClass
                    }
                  >
                    <MapPinIcon size="24" color="lightgrey" />
                    <Text className="text-neutral-200 ml-2">
                      İstanbul,Türkiye
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : null}
        </View>
        {/* Hava Durumuyla ilgili bilgilerin olduğu bölüm */}
        <View className="flex-1 flex justify-around mx-4 mb-36">
          <Text className="text-2xl text-center font-bold text-white">
            İstanbul,
            <Text className="text-lg font-semibold text-gray-300">Türkiye</Text>
          </Text>
          {/* Hava durumu resmi */}
          <View className="flex-row justify-center">
            <Image
              source={require("../assets/weather/sunny.png")}
              className="w-52 h-52"
            />
          </View>
          {/* Derece */}
          <View className="space-y-1 border-y-2 mx-24 border-neutral-800 py-4">
            <Text className="text-center font-bold text-white text-6xl ml-5">
              20&#176;
            </Text>
            <Text className="text-center text-white text-xl">
              Güneşli
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
