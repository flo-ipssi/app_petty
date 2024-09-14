import React, { Fragment, useCallback, useState } from "react";
import { FC } from "react";
import {
    Animated,
    Button,
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ChoiceLabel from "./ChoiceLabel";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Props {
    handlePress?(): void;
    name: string;
    location: string;
    breed: string;
    distance: number;
    age: number;
    upload: any;
    isFirst: boolean;
    swipe: Animated.ValueXY;
    titleSign: Animated.Value;
    [key: string]: any;
}

const { width, height } = Dimensions.get("screen");

const Card: FC<Props> = ({
    handlePress,
    name,
    distance,
    location,
    breed,
    age,
    upload,
    isFirst,
    swipe,
    titleSign,
    ...rest
}) => {
    const [isButtonPressed, setIsButtonPressed] = useState(false);

    const rotate = Animated.multiply(swipe.x, titleSign).interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ["8deg", "0deg", "-8deg"],
    });

    const animatedCardStyle = {
        transform: [...swipe.getTranslateTransform(), { rotate }],
    };

    const likeOpacity = swipe.x.interpolate({
        inputRange: [25, 100],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    const nopeOpacity = swipe.x.interpolate({
        inputRange: [-100, -25],
        outputRange: [1, 0],
        extrapolate: "clamp",
    });

    const profilImage = upload.filter((upload: { profil: any; }) => upload.profil)
        .map((upload: { file: { url: any; }; }) => upload.file.url)[0]

    const renderChoice = useCallback(() => {
        return (
            <Fragment>
                <Animated.View
                    style={[
                        styles.choiceContainer,
                        styles.nopeContainer,
                        {
                            opacity: nopeOpacity,
                        },
                    ]}
                >
                    <ChoiceLabel type="nope" />
                </Animated.View>
                <Animated.View
                    style={[
                        styles.choiceContainer,
                        styles.likeContainer,
                        {
                            opacity: likeOpacity,
                        },
                    ]}
                >
                    <ChoiceLabel type="like" />
                </Animated.View>
            </Fragment>
        );
    }, [likeOpacity, nopeOpacity]);

    return (
        <Fragment>
            <Animated.View pointerEvents="box-none" style={[styles.container, isFirst && animatedCardStyle]} {...rest}>

                <Image
                    source={{
                        uri: profilImage as string,
                    }}
                    style={styles.upload}
                />
                <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    style={styles.gradient}
                >
                    <View style={styles.petContainer} 
                            pointerEvents="box-none">
                        <Text style={styles.name}>
                            {name} , {age}
                        </Text>
                        <Text style={styles.text}>
                            <MaterialCommunityIcons name="map-marker" size={15} style={{ paddingRight: 5 }} />
                            Live in {location}
                        </Text>
                        <Text style={styles.text}>
                            <MaterialCommunityIcons name="paw" size={15} style={{ paddingRight: 5 }} />
                            {breed}
                        </Text>
                        {/* <Text style={styles.text}>{distance} miles away</Text> */}

                        {/* Bouton pour naviguer vers la page de détails */}
                        <TouchableOpacity
                            style={styles.detailButton}
                            onPress={handlePress}
                            disabled={isButtonPressed}
                        >
                            <Text style={styles.detailButtonText}>Voir Détails</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
                {isFirst && renderChoice()}
            </Animated.View>
        </Fragment>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 25,
        zIndex: 99999,
    },
    detailButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#ff7f50',
        borderRadius: 10,
    },
    detailButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    upload: {
        width: width * 0.9,
        height: height * 0.68,
        borderRadius: 20,
        marginTop: height * 0.02
    },
    gradient: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        height: 200,
    },
    petContainer: {
        position: "absolute",
        bottom: 34,
        left: 24,
    },
    name: {
        fontSize: 30,
        color: "white",
        fontWeight: "400",
    },
    text: {
        fontSize: 18,
        color: "white",
        fontWeight: "300",
    },
    choiceContainer: {
        position: "absolute",
        top: 100,
        zIndex: 999,
    },
    likeContainer: {
        left: 45,
        transform: [{ rotate: "-30deg" }],
    },
    nopeContainer: {
        right: 45,
        transform: [{ rotate: "30deg" }],
    },
});

export default Card;
