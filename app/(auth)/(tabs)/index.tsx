import {
   Animated,
   Dimensions,
   ImageSourcePropType,
   PanResponder,
   StyleSheet,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../ctx";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Card from "@/components/Card";
import SwipeButtonsContainer from "@/components/SwipeButtonsContainer";

type Pet = {
   id: string | number;
   name: string;
   location: string;
   distance: number;
   age: number;
   image: ImageSourcePropType | string;
};

const data: Pet[] = [
   {
      id: 1,
      name: "test 1",
      location: "Paris",
      distance: 10,
      age: 5,
      image:
         "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
   },
   {
      id: 2,
      name: "test 2",
      location: "Montpellier",
      distance: 10,
      age: 10,
      image:
         "https://as2.ftcdn.net/v2/jpg/01/70/77/61/1000_F_170776141_DWQjn2F5zyWSUUH7tUBYELLycMJyXbxa.jpg",
   },
   {
      id: 3,
      name: "test 3",
      location: "Lyon",
      distance: 10,
      age: 10,
      image:
         "https://www.empara.fr/blog/wp-content/uploads/2020/08/photo-portrait-0062-1.jpg",
   },
];

const { height } = Dimensions.get("screen");

export default function Apartment() {
   const [users, setUsers] = useState(data);
   const { signOut, user } = useSession();

   const swipe = useRef(new Animated.ValueXY()).current;
   const titleSign = useRef(new Animated.Value(1)).current;

   // Remove the top card from the users array
   const removeTopCard = useCallback(() => {
      setUsers((prevState) => prevState.slice(1))
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
      console.log(users.length);
      
      if (users.length == 0) {
         setUsers(users)
      }
   }, [users.length])
   return (
      <View style={styles.container}>
         <StatusBar hidden={true} />
         {users.map(({ name, image, location, distance, age }, index) => {
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
                  distance={distance}
                  age={age}
                  image={image}
                  isFirst={isFirst}
                  swipe={swipe}
                  titleSign={titleSign}
                  {...dragHandlers}
               />
            );
         }).reverse()}
         <SwipeButtonsContainer handleChoice={handleChoice} />
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
