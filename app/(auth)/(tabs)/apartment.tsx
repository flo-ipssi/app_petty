import { Button, ImageSourcePropType, StyleSheet } from "react-native";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../ctx";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Card from "@/components/Card";


type Pet = {
   name: string;
   location: string;
   distance: number;
   age: number;
   image: ImageSourcePropType;
};
const data = [
   {
      id: 1,
      name: "test 1",
      location: "Paris",
      distance: 10,
      age: 5,
      image: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
   },
   {
      id: 2,
      name: "test 2",
      location: "Montpellier",
      distance: 10,
      age: 10,
      image: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
   },
   {
      id: 3,
      name: "test 3",
      location: "Lyon",
      distance: 10,
      age: 10,
      image: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg"
   }
];

export default function Apartment() {
   const [users, setUsers] = useState(data);
   const { signOut, user } = useSession();

   useEffect(() => {
      if (!users.length) {
         setUsers(users)
      }
   }, [users.length])

   return (
      <View style={styles.container}>
         <StatusBar hidden={true} />
         {
            users.map(({ name, image, location, distance, age }, index) => {
               const isFirst = index == 0;
               return (
                  <Card
                     key={name}
                     name={name}
                     location={location}
                     distance={distance}
                     age={age}
                     image={image}
                     isFirst={isFirst}
                  />
               )
            })
         }
      </View>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white"
   },
   title: {
      fontSize: 20,
      fontWeight: "bold",
   },
   separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
   },
});
