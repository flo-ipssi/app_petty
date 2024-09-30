import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs, useRouter } from "expo-router";
import { TouchableOpacity, View, Text, Modal, Image, Button, StyleSheet, Dimensions } from "react-native";
import { BlurView } from 'expo-blur';
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "@/utils/colors";
import { disconnectSocket, initSocket } from "@/app/helpers/socket";
import AppButton from "@/components/ui/AppButton";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [matchData, setMatchData] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const onMatchFound = (results: any) => {
    console.log("Match found!", results);
    
    setMatchData(results.data);
    setIsModalVisible(true);
  };

  useEffect(() => {
    const initializeSocket = async () => {
      await initSocket(onMatchFound);
    };

    initializeSocket();

    return () => {
      // Déconnexion du socket à la fermeture
      disconnectSocket();
    };
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: useClientOnlyValue(false, true),
          tabBarShowLabel: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            tabBarShowLabel: false,
            title: "",
            tabBarIcon: () => (
              <MaterialCommunityIcons
                name="cards"
                size={30}
                color={colors.SECONDARY}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="details"
          options={{
            tabBarButton: () => null,
            title: "Détails",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.back()}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={30}
                  style={{ marginLeft: 10 }}
                  title="Update count"
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="(conversation)"
          options={{
            tabBarShowLabel: false,
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="message" size={25} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(settings)/index"
          options={{
            headerShown: false,
            title: "",
            tabBarShowLabel: false,
            tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          }}
        />
        <Tabs.Screen
          name="infos"
          options={{
            tabBarButton: () => null,
            title: "Informations",
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.navigate("(settings)")}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={30}
                  style={{ marginLeft: 10 }}
                />
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="apartment"
          options={{
            tabBarShowLabel: false,
            title: "Logement",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
      </Tabs>

      {/* Modal style Tinder */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <BlurView intensity={70} tint="dark" style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>It's a Match!</Text>
            {matchData && (
              <>
                <Image
                  source={{ uri: matchData.profileImage.url }}
                  style={styles.petImage}
                />
                <Text style={styles.matchText}>Vous pouvez dès à présent discuter avec {matchData.pet.name}</Text>

                <AppButton
                  title={"Message".toLocaleUpperCase()}
                  styleCustomContainer={styles.customButton2}
                  styleCustomTitle={styles.customTitleButton}
                  onPress={() => {
                    setIsModalVisible(false);
                    router.navigate("(conversation)");
                  }}
                />
                <AppButton
                  title={"Fermer".toLocaleUpperCase()}
                  styleCustomContainer={styles.customButton}
                  styleCustomTitle={styles.customTitleButton}
                  onPress={() => setIsModalVisible(false)}
                />
              </>
            )}

          </View>
        </BlurView>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.8,
    padding: 20,
    // backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    alignItems: "center",

  },
  modalTitle: {
    fontFamily: "Brusher",
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  customButton: {
    borderWidth: 2,
    borderColor: colors.SECONDARY_BORDER,
    width: "80%",
    marginVertical: 10,
  },
  customButton2: {
    backgroundColor: colors.SECONDARY_TRANSPARENT,
    borderWidth: 2,
    borderColor: colors.SECONDARY_BORDER,
    width: "80%",
  },
  customTitleButton: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 5,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 150,
    marginVertical: 80,
    borderWidth:6,
    borderColor:"white",
  },
  matchText: {
    fontSize: 5,
    color: "white",
    textAlign: "center",
    marginBottom: 4,
    paddingHorizontal: 10,
  },
});

