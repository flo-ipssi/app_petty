import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Button, TextInput, FlatList } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSession } from "@/app/ctx";
import client from "@/app/api/client";
import moment from 'moment';
type Message = {
    owner: string;
    text: string;
    createdAt: string;
};

const Chat: React.FC = () => {
    const { session, user } = useSession();
    const { conversationId, petName, petPhoto } = useLocalSearchParams<{
        id: string;
        conversationId: string;
        petName: string;
        petPhoto?: string;
    }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");

    async function fetchMessages() {
        try {
            if (!session) return;
            const data = await fetch(client + `message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify({
                    conversationId: conversationId,
                }),
            });

            const res = await data.json();

            if (res.messages) {
                setMessages(res.messages);
            }
        } catch (error) {
        }
    }

    async function sendMessage(message: string) {
        
        try {
            if (!session || !user) return;
            const response = await fetch(client + `message/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${session}`,
                },
                body: JSON.stringify({
                    messageText: message,
                    ownerId: user._id,
                    conversationId: conversationId,
                }),
            });
            return response;
        } catch (error) {
            console.error("Error sending message:", error);
            throw error;
        }
    }

    const handleSendMessage = async () => {
        if (!user || newMessage.trim() === "") return;
    
        const tempMessage = { text: newMessage, owner: user.id, createdAt: new Date().toISOString() };
        setMessages([tempMessage, ...messages]);
        setNewMessage("");
    
        try {
            const response = await sendMessage(newMessage);
    
            if (response && response.ok) {
                fetchMessages();
            } else {
                setMessages(messages);
            }
        } catch (error) {
            setMessages(messages);
        }
    };
    
    const formatMessageDate = (dateString: moment.MomentInput) => {
        const timestamp = moment(dateString);

        if (timestamp.isSame(moment(), "day")) {
            return timestamp.format("HH:mm");
        } else {
            return timestamp.format("dd MMMM yyyy à HH:mm");
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        if (!user) return null;
        const isMe = item.owner === user.id;

        return (
            <View
                style={{
                    flexDirection: isMe ? "row-reverse" : "row",
                    flex: 1,
                    marginVertical: 15,
                }}
            >
                {!isMe && (
                    <Image
                        source={{ uri: petPhoto }}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            marginRight: 10,
                            marginTop: 10,
                        }}
                    />
                )}
                <View
                    style={{
                        backgroundColor: isMe ? "#DCF8C6" : "#F0F0F0",
                        alignSelf: isMe ? "flex-end" : "flex-start",
                        borderRadius: 20,
                        padding: 10,
                        maxWidth: "100%",
                    }}
                >
                    <Text style={{ fontSize: 16 }}>{item.text}</Text>
                    <Text style={{ fontSize: 12, marginTop: 5, color: "#666" }}>
                        {formatMessageDate(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };


    useEffect(() => {
        fetchMessages();
        if (conversationId) {
            const intervalId = setInterval(() => {
                fetchMessages();
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [conversationId]);
    return (

        <View style={{ flex: 1, padding: 20, backgroundColor: "#FAFAFA" }}>
            {renderItem ?
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                // inverted // show the messages from the bottom to the top
                /> : null}
            <View
                style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}
            >
                <TextInput
                    style={{
                        flex: 1,
                        borderWidth: 1,
                        borderColor: "#CCCCCC",
                        borderRadius: 30,
                        paddingHorizontal: 15,
                        paddingVertical: 10,
                        backgroundColor: "#FFFFFF",
                    }}
                    value={newMessage}
                    onChangeText={(text) => setNewMessage(text)}
                    placeholder="Saisissez votre message..."
                />
                <Button title="Envoyer" onPress={handleSendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    petImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    petName: {
        fontSize: 18,
        fontWeight: "bold",
    },
    chatContainer: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        padding: 20,
    },
});

export default Chat;
