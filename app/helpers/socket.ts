import { io, Socket } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from "react-native";
import client from "../api/client";

let socket: Socket | null = null;
const SERVER_URL = client;

export const initSocket = async (): Promise<Socket | null> => {
  try {
    const token = await AsyncStorage.getItem('session');
    const userStringify = await AsyncStorage.getItem('user');

    
    if (!socket && token) {
      socket = io(SERVER_URL, {
        auth: {
          token: token,
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
      });

      socket.on("connect", () => {
        if(userStringify && socket) {
          const user = JSON.parse(userStringify);
          // socket.emit('user', user);
          console.log(user.id);
        }
        
        console.log("Connected to Socket.IO server");
      });

      socket.on("disconnect", () => {
        console.log("Disconnected from Socket.IO server");
      });

      // Écouter l'événement match_found et afficher une alerte
      socket.on("match_found", (data) => {
        console.log("Match found!", data);
        Alert.alert("Match!", "You have a new match!", [
          { text: "OK", style: "cancel" }
        ]);
      });

      // Gérer les erreurs de connexion
      socket.on("connect_error", (error) => {
        console.error("Connection error: ", error);
      });
    }

    return socket; // Retourner l'instance de socket
  } catch (error) {
    console.error("Error initializing socket:", error);
    return null;  // En cas d'échec, retourner null
  }
};

// Émettre un événement via le socket
export const emitEvent = (event: string, data: any) => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.error("Socket is not initialized");
  }
};

export const onEvent = (event: string, callback: (data: any) => void) => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.error("Socket is not initialized");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
