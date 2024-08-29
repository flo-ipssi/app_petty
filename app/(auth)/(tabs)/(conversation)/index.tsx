import React, { useEffect, useState } from "react";
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import colors from "@/utils/colors";
import { Fonts } from "@/utils/fonts";
import { Keys, getFromAsyncStorage } from "@/utils/asyncStorage";
import ConversationItem from "@/components/ConversationItem";
import client from "@/app/api/client";
import RessourceNotAvailable from "@/components/ui/RessourceNotAvailable";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ConversationList = ({ }) => {
    const [haveNewMessages, setHaveNewMessages] = useState(false);
    const [conversations, setConversations] = useState([]);

    const handleNewPress = () => {
        setHaveNewMessages(true);
    };

    const renderItem = ({ item }) => {
        if (item.newMessage) {
            handleNewPress();
        }

        const photo = item.petUploads
            .filter((item: { profil: boolean }) => item.profil == true)
            .map((item: { file: { url: any; }; }) => item.file.url);

        const petInfos = { infos: item.petInfo[0], photo }
        return (
            <ConversationItem
                data={item}
                idChat={item._id}
                onClick={() => console.log('ok')
                
                    // navigation.navigate("Conversation", { conversationId: item._id, petInfos })
                }
            />
        );
    };

    async function getConversationList() {
        try {
            const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
            if (!token) return;
            const data = await fetch(client + `conversation/match`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${token}`,
                },
            });

            const res = await data.json();

            if (res.conversations) {
                setConversations(res.conversations);
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        getConversationList();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.boutons}>
                    <Text>Tous les messages</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.boutons}>
                    <Text>Non lus</Text>
                    {haveNewMessages ? (
                        <View
                            style={{
                                backgroundColor: colors.DARK,
                                width: 10,
                                height: 10,
                                borderRadius: 5,
                                position: "absolute",
                                top: 15,
                                left: 20,
                            }}
                        ></View>
                    ) : null}
                </TouchableOpacity>
            </View>
            <ScrollView showsHorizontalScrollIndicator={false}>
                {conversations?.length > 0 ? (
                    <FlatList
                        data={conversations}
                        renderItem={renderItem}
                        keyExtractor={(item) => item._id.toString()}
                    />
                ) : <RessourceNotAvailable
                    title="Aucuns match"
                    icon={<MaterialCommunityIcons 
                        name="emoticon-sad-outline"
                        size={45}
                        color={colors.DARK} />}
                    message="Lorsque tu matcheras avec les propriétaires, tes matchs seront affichés ici."
                />}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flex: 1,
        fontFamily: "Poppins-Regular",
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        width: "100%",
    },
    boutons: {
        paddingHorizontal: 30,
        paddingVertical: 15,
    },
});

export default ConversationList;
