import React from "react";
import { FC } from "react";
import { Dimensions, Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    name: string;
    location: string;
    distance: number;
    age: number;
    image: ImageSourcePropType;
}


const { width, height } = Dimensions.get("screen")

const Card: FC<Props> = ({ name, location, distance, age, image }) => {
    return (
        <View style={styles.container}>
            <Image source={{
                uri: image,
            }} style={styles.image} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradient}
            />
            <View style={styles.petContainer}>
                <Text style={styles.name}>{name} , {age}</Text>
                <Text style={styles.location}>Live in {location}</Text>
                <Text style={styles.distance}>{distance} miles away</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 25,
    },
    image: {
        width: width * 0.9,
        height: height * 0.68,
        borderRadius: 20
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        height: 200
    },
    petContainer: {
        position: 'absolute',
        bottom: 34,
        left: 24
    },
    name: {
        fontSize: 30,
        color: "white",
        fontWeight: "400"
    },
    location: {
        fontSize: 18,
        color: "white",
        fontWeight: "300"
    },
    distance: {

        fontSize: 18,
        color: "white",
        fontWeight: "300"
    }
});

export default Card;
