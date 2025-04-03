import {
  View,
  Text,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { CalendarDaysIcon, MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants/constants";
import * as Progress from "react-native-progress";
import { storeData, getData } from "../utils/asyncStorage";

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (loc) => {
    // console.log("Konum:", loc);
    setLocations([]);
    toggleSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
      storeData("city", loc.name);
      // console.log("Data bulundu: ", data);
    });
  };

  const handleSearch = (value) => {
    // console.log("Value: ",value)
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);

        // console.log("got locations: ",data);
      });
    }
  };
  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    let myCity = await getData("city");
    let cityName = "Ankara";
    if (myCity) cityName = myCity;

    fetchWeatherForecast({
      cityName,
      days: "7",
    }).then((data) => {
      setWeather(data);
      setLoading(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);
  const { current, location } = weather;

  return (
    <View className="flex-1 relative bg-neutral-900">
      <StatusBar style="light" />

      {loading ? (
        <View className="flex-1 flex-row justify-center items-center">
          <Progress.CircleSnail thickness={10} size={140} color="white" />
        </View>
      ) : (
        <SafeAreaView className="flex flex-1">
          {/* Search section */}
          <View
            style={{ height: "8%" }}
            className="mx-4 p-1 my-8 relative z-50"
          >
            <View
              className="flex-row justify-end items-center p-1 rounded-full"
              style={{
                backgroundColor: showSearch ? "#343434" : "transparent",
              }}
            >
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
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
                        {loc?.name},{loc?.country}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : null}
          </View>
          {/* Hava Durumuyla ilgili bilgilerin olduğu bölüm */}
          <View className="flex-1 flex justify-around mx-4 mb-4">
            <Text className="text-2xl text-center font-bold text-white">
              {location?.name},
              <Text className="text-lg font-semibold text-gray-300">
                {" " + location?.country}
              </Text>
            </Text>
            {/* Hava durumu resmi */}
            <View className="flex-row justify-center">
              <Image
                source={weatherImages[current?.condition?.text]}
                // source={require("../assets/weather/sunny.png")}
                className="w-52 h-52"
              />
            </View>
            {/* Derece */}
            <View className="space-y-1 border-y-2 mx-24 border-neutral-800 py-4">
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {current?.temp_c}&#176;
              </Text>
              <Text className="text-center text-white text-xl tracking-widest">
                {current?.condition?.text}
              </Text>
            </View>
            {/* Detaylı bilgiler */}
            <View className="flex-row justify-between mx-4 ">
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/weather/wind.png")}
                  className="h-6 w-6"
                  style={{ tintColor: "white" }}
                />
                <Text className="text-white font-semibold text-base">
                  {current?.wind_kph}km
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/weather/drop.png")}
                  className="h-6 w-6"
                  style={{ tintColor: "white" }}
                />
                <Text className="text-white font-semibold text-base">
                  {current?.humidity}%
                </Text>
              </View>
              <View className="flex-row space-x-2 items-center">
                <Image
                  source={require("../assets/weather/sun.png")}
                  className="h-6 w-6"
                  style={{ tintColor: "white" }}
                />
                <Text className="text-white font-semibold text-base">
                  {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>

            {/* Diğer günler */}
            <View className="mb-2 space-y-3">
              <View className="flex-row items-center mx-5 space-x-2">
                <CalendarDaysIcon size="24" color="white" />
                <Text className="text-white text-base">
                  Haftalık hava durumu
                </Text>
              </View>
              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}
              >
                {weather?.forecast?.forecastday?.map((item, index) => {
                  let date = new Date(item.date);
                  let options = { weekday: "long" };
                  let dayName = date.toLocaleDateString("tr-TR", options);

                  return (
                    <View
                      key={index}
                      className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                      style={{ backgroundColor: "#343434" }}
                    >
                      <Image
                        source={weatherImages[item?.day?.condition?.text]}
                        className="h-11 w-11"
                      />
                      <Text className="text-white">{dayName}</Text>
                      <Text className="text-white text-xl font-semibold">
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                      <Text className="text-white text-xs font-semibold">
                        {item?.day?.condition?.text};
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
