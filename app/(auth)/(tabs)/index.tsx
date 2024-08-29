import {
   Animated,
   Dimensions,
   PanResponder,
   StyleSheet,
} from "react-native";
import { View } from "@/components/Themed";
import { useSession } from "../../ctx";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Card from "@/components/Card";
import SwipeButtonsContainer from "@/components/SwipeButtonsContainer";
import { fetchPets } from "@/app/api/apiService";

type Pet = {
   id: string | number;
   name: string;
   location: string;
   breed: string;
   distance: number;
   age: number;
   uploads: any;
};

const { height } = Dimensions.get("screen");

export default function Apartment() {
   const [pets, setPets] = useState<Pet[]>([]);
   const [page, setPage] = useState(1);
   const limit = 10;
   const swipe = useRef(new Animated.ValueXY()).current;
   const titleSign = useRef(new Animated.Value(1)).current;
   const { session } = useSession();

   // Remove the top card from the pets array
   const removeTopCard = useCallback(() => {
      setPets((prevState) => prevState.slice(1))
      swipe.setValue({ x: 0, y: 0 })
   }, [swipe])

   // handle user choice (left or rightt)
   const handleChoice = useCallback((direction: number) => {
      Animated.timing(swipe.x, {
         toValue: direction * 500,
         duration: 400,
         useNativeDriver: true
      }).start(removeTopCard)
   }, [removeTopCard, swipe.x]
   )


   useEffect(() => {
      const loadPets = async () => {
         try {
            if (session) {
               const newPets = await fetchPets(page, limit, session);
               setPets((prevPets) => [...prevPets, ...newPets]);
            }
         } catch (error) {
            console.error("Erreur lors du chargement des animaux :", error);
         }
      };

      loadPets();
   }, [page]);

   useEffect(() => {
      if (pets.length === 0) {
         setPage((prevPage) => prevPage + 1);
      }
   }, [pets.length]);
   return (
      <View style={styles.container}>
         <StatusBar hidden={true} />
         {pets.map(({ name, uploads, location, distance, age, breed }, index) => {
            const isFirst = index === 0;
            const panResponder = PanResponder.create({
               onMoveShouldSetPanResponder: () => isFirst,
               onPanResponderMove: (_, { dx, dy, y0 }) => {
                  swipe.setValue({ x: dx, y: dy });
                  titleSign.setValue(y0 > height / 2 ? 1 : -1);
               },
               onPanResponderRelease: (_, { dx, dy }) => {
                  const direction = Math.sign(dx);
                  const isActionActive = Math.abs(dx) > 100;

                  if (isActionActive) {
                     Animated.timing(swipe, {
                        duration: 200,
                        toValue: {
                           x: direction * 500,
                           y: dy,
                        },
                        useNativeDriver: true,
                     }).start(removeTopCard)
                  } else {
                     Animated.spring(swipe, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                        friction: 5,
                     }).start();
                  }
               },
            });

            const dragHandlers = isFirst ? panResponder.panHandlers : {};

            return (
               <Card
                  key={name}
                  name={name}
                  location={location}
                  breed={breed}
                  distance={distance}
                  age={age}
                  upload={uploads}
                  isFirst={isFirst}
                  swipe={swipe}
                  titleSign={titleSign}
                  {...dragHandlers}
               />
            );
         }).reverse()}
         <SwipeButtonsContainer handleChoice={(direction) => {
            handleChoice(direction);
         }} />
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
   },
});
