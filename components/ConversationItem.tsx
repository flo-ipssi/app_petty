import React, { FC } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import colors from "@/utils/colors";
import { Fonts } from "@/utils/fonts";
import { Link } from "expo-router";

interface Props {
    data: any;
    idChat: any;
    onClick?(): void;
}

const ConversationItem: FC<Props> = ({ data, onClick, idChat }) => {
    const petProfil = data.petUploads
        .filter((item: { profil: boolean }) => item.profil == true)
        .map((item: { file: { url: any; }; }) => item.file.url);

    return (
        <Pressable style={styles.row} onPress={onClick}>
            <View style={{ flexDirection: "row", padding: 10 }}>
                <Image
                    source={petProfil[0]}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                />
                <View style={{ marginLeft: 25 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            fontFamily: !data.messages[0] ? Fonts.bold : Fonts.regular,
                        }}
                    >
                        {data.petInfo[0].name}
                        {!data.messages[0] ? (
                            <View
                                style={{
                                    backgroundColor: colors.DARK,
                                    width: 7,
                                    height: 7,
                                    borderRadius: 5,
                                    position: "absolute",
                                    top: 12,
                                    right: -15,
                                }}
                            ></View>
                        ) : null}
                    </Text>
                    <Text
                        style={{
                            fontFamily: data.newMessage ? Fonts.bold : Fonts.regular,
                            color: "rgba(84, 84, 84, 0.6)",
                        }}
                    >
                        {data.messages[0]?.message ?? null}
                    </Text>
                </View>
                {/* {!data.messages[0].is_Seen ? ( */}

            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {},
    row: {
        marginTop: 10,
        width: "80%",
        alignSelf: "center",
    },
});

export default ConversationItem;
