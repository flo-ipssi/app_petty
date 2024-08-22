import React from "react";
import { FC, ReactNode } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

import colors from "@/utils/colors";
import AppLink from "./ui/AppLink";
import image from "@/assets/background.png";
interface Props {
    children?: ReactNode;
    heading?: string;
    subHeading?: string;
    // linkSubHeading?(): void;
}
const AuthFormConainer: FC<Props> = (props) => {
    return (
        // <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Image
                    style={{ width: 230, height: 230 }}
                    source={require("../assets/logos/original.png")}
                />
                <Text style={styles.heading}>{props.heading}</Text>
                {/* <View style={styles.subHeading}>
                    <AppLink title={props.subHeading} onPress={props.linkSubHeading} />
                </View> */}
            </View>

            {props.children}
        </View>
        // </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.INACTIVE_CONTRAST,
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        flex: 1,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    heading: {
        color: colors.SECONDARY,
        marginBottom: 20,
        fontSize: 30,
        fontWeight: "800",
        width: "70%",
        textAlign: "center",
    },
    subHeading: {
        marginHorizontal: 30,
        marginBottom: 35,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 4,
    },
});

export default AuthFormConainer;
