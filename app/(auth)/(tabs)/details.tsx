import CarrouselComponent from "@/components/CarrouselComponent";
import colors from "@/utils/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function Details() {
  const {
    name,
    age,
    gender,
    weight,
    infosUser,
    breed,
    images,
    location,
    description,
  } = useLocalSearchParams();

  const uploadImages = Array.isArray(images)
    ? images
    : JSON.parse(images || "[]");
  const infosOwner = Array.isArray(infosUser)
    ? infosUser[0]
    : JSON.parse(infosUser || "{}");

  const userHasUploads = infosOwner.uploads.length > 0;
  const imageSource = userHasUploads
    ? { uri: infosOwner.uploads[0].file.url }
    : require("../../../assets/error.jpg");

  return (
    <View style={{ flex: 1, backgroundColor:'#FFF' }}>
      <ScrollView style={styles.container}>
        <CarrouselComponent slideList={uploadImages} />
        <View style={styles.infoContainer}>
          <View style={styles.leftTextContainer}>
            <Text style={styles.leftText}>{name}</Text>
          </View>

          <View style={styles.rightTextContainer}>
            <Text style={styles.rightText}>
              <MaterialCommunityIcons
                name="map-marker"
                size={18}
                color={colors.DARK}
              />
              {location}
            </Text>
          </View>
        </View>
        <View style={styles.infoPetContainer}>
          <View style={styles.box}>
            <Text style={styles.titleBox}>Sexe</Text>
            <Text style={styles.responseBox}>{gender}</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.titleBox}>Age</Text>
            <Text style={styles.responseBox}>{age} ans</Text>
          </View>

          <View style={styles.box}>
            <Text style={styles.titleBox}>Poids</Text>
            <Text style={styles.responseBox}>{weight} kg</Text>
          </View>
        </View>
        <View style={styles.infoPetContainer}>
          <Text style={{ marginVertical: 25 }}>{description}</Text>
        </View>
        <View
          style={{ flexDirection: "row", padding: 10, marginHorizontal: 30 }}
        >
          <Image
            source={imageSource}
            style={{ width: 45, height: 45, borderRadius: 25 }}
          />
          <View style={{ marginLeft: 15 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "Poppins-SemiBold",
                textTransform: "capitalize",
              }}
            >
              {infosOwner.name || "Nom non disponible"}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                color: "rgba(84, 84, 84, 0.6)",
              }}
            >
              Pet owner | {infosOwner.company ? "Association" : "Particulier"}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 100,
  },
  item: {
    width: screenWidth,
    height: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    fontSize: 24,
    marginTop: 10,
  },
  titleBox: {
    color: colors.DARK,
    alignSelf: "center",
    fontFamily: "Poppins-Thin",
  },
  responseBox: {
    color: colors.SECONDARY,
    fontFamily: "Poppins-Regular",
  },
  box: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    textAlign: "center",
    borderRadius: 5,
    justifyContent: "center",
    backgroundColor: "rgba(57, 254, 226, 0.1)",
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  navItem: {
    paddingHorizontal: 10,
    fontSize: 20,
    color: "blue",
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    position: "absolute",
    bottom: 25,
    left: "25%",
  },
  itemButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 20,
  },
  infoContainer: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 50,
    fontFamily: "Poppins-Regular",
  },
  infoPetContainer: {
    paddingHorizontal: 50,
    flexDirection: "row",
    width: "100%",
    fontFamily: "Poppins-Regular",
  },
  leftTextContainer: {
    flex: 1,
    alignItems: "flex-start",
  },
  leftText: {
    fontSize: 20,
    fontFamily: "Poppins-SemiBold",
  },
  rightTextContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  rightText: {
    textTransform: "capitalize",
    fontSize: 17,
  },
});
