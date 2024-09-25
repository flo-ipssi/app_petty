import React, { useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useRouter } from "expo-router"; // Hook for navigation
import colors from "@/utils/colors";
import ConversationItem from "@/components/ConversationItem";
import client from "@/app/api/client";
import RessourceNotAvailable from "@/components/ui/RessourceNotAvailable";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSession } from "@/app/ctx";

interface Conversation {
    _id: string;
    petInfo: { name: string }[];
    petName: string;
    petUploads: { profil: boolean; file: { url: string } }[];
    newMessage?: boolean;
}

const ConversationList: React.FC = () => {
    const { session } = useSession();
    const [haveNewMessages, setHaveNewMessages] = useState<boolean>(false);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const router = useRouter();

    const handleNewPress = () => {
        setHaveNewMessages(true);
    };

    const handleConversationPress = (conversationId: string, petInfos: { name: string; photo: string }) => {
        router.push({
            pathname: `/chat/${conversationId}`,
            params: {
                petName: petInfos.name,
                petPhoto: petInfos.photo,
                conversationId: conversationId,
            },
        });
    };

    const renderItem = ({ item }: { item: Conversation }) => {
        if (item.newMessage) {
            handleNewPress();
        }

        const photo = item.petUploads
            .filter((upload) => upload.profil)
            .map((upload) => upload.file.url);

        const petInfos = {
            name: item.petInfo[0].name,
            photo: photo[0] || '',
        };
        
        return (
            <ConversationItem
                data={item}
                idChat={item._id}
                onClick={() => handleConversationPress(item._id, petInfos)}
            />
        );
    };

    async function getConversationList() {
        try {
            const response = await fetch(client + `conversation/match`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
            });

            const res = await response.json();

            if (res.conversations) {
                setConversations(res.conversations);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        }
    }

    useEffect(() => {
        getConversationList();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
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
                        />
                    ) : null}
                </TouchableOpacity>
            </View>

            {conversations?.length > 0 ? (
                <FlatList
                    data={conversations}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id.toString()}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <RessourceNotAvailable
                    title="Aucuns match"
                    icon={<MaterialCommunityIcons
                        name="emoticon-sad-outline"
                        size={45}
                        color={colors.DARK} />}
                    message="Lorsque tu matcheras avec les propriétaires, tes matchs seront affichés ici."
                />
            )}
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        flex: 1,
        fontFamily: "Poppins-Regular",
    },
    header: {
        borderBottomWidth: 1,
        borderBottomColor: colors.GRAY,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        marginHorizontal: 'auto',
        width: "80%",
        marginTop: 20,
    },
    boutons: {
        paddingHorizontal: 30,
        paddingVertical: 5,
        marginVertical: 10
    },
});

export default ConversationList;
