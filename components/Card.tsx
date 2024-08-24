import React, { Fragment, useCallback } from "react";
import { FC } from "react";
import {
    Animated,
    Dimensions,
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ChoiceLabel from "./ChoiceLabel";

interface Props {
    name: string;
    location: string;
    distance: number;
    age: number;
    image: ImageSourcePropType | string;
    isFirst: boolean;
    swipe: Animated.ValueXY;
    titleSign: Animated.Value;
    [key: string]: any;
}

const { width, height } = Dimensions.get("screen");

const Card: FC<Props> = ({
    name,
    location,
    distance,
    age,
    image,
    isFirst,
    swipe,
    titleSign,
    ...rest
}) => {
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
        <Animated.View style={[styles.container, isFirst && animatedCardStyle]} {...rest}>
            <Image
                source={{
                    uri: image as string,
                }}
                style={styles.image}
            />
            <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={styles.gradient}
            >
                <View style={styles.petContainer}>
                    <Text style={styles.name}>
                        {name} , {age}
                    </Text>
                    <Text style={styles.location}>Live in {location}</Text>
                    <Text style={styles.distance}>{distance} miles away</Text>
                </View>
            </LinearGradient>
            {isFirst && renderChoice()}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 25,
        zIndex: 99999,
    },
    image: {
        width: width * 0.9,
        height: height * 0.68,
        borderRadius: 20,
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
    location: {
        fontSize: 18,
        color: "white",
        fontWeight: "300",
    },
    distance: {
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
