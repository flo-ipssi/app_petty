import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { FC, useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import _ from "lodash";
import AnimalCheckbox from "@/components/ui/AnimalCheckbox";
import { useSession } from "@/app/ctx";
import colors from "@/utils/colors";
import SwipeButton from "@/components/SwipeButton";
import { useRouter } from "expo-router";
import client from "@/app/api/client";
import { DataURIToBlob } from "@/app/helpers/uploadMedia";

type FilterKeys = "isCat" | "isDog" | "isBird" | "isOther";
interface Props { }

const cities = ["paris", "lyon", "marseille", "toulouse", "nice"];

const Account: FC<Props> = () => {
  const { session, user, filtersData, setFiltersData, setReloadPets, signOut } = useSession();
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(
    user?.avatar ? user.avatar : "https://via.placeholder.com/200"
  );

  const toggleFilter = (key: FilterKeys) => {
    setFiltersData((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const setDistance = (value: number) => {
    setFiltersData((prevState) => ({
      ...prevState,
      distance: value,
    }));
  };

  const setAgeMax = (value: number) => {
    setFiltersData((prevState) => ({
      ...prevState,
      ageMax: value,
    }));
  };

  const uploadFile = async (uploadImg: { canceled?: false; assets: { uri: string, base64: string }[] }) => {
    if (!uploadImg || uploadImg.canceled || !uploadImg.assets || uploadImg.assets.length === 0) {
      console.error("Aucune image n'a été sélectionnée.");
      return;
    }

    const assets = uploadImg.assets[0];
    let split = assets.uri.split("/");
    let type = split[1].split(";")[0];

    // Change data to blob
    const file = DataURIToBlob(assets.uri);

    const formData = new FormData();
    formData.append("upload", file);
    formData.append("type", type);
    formData.append("file", assets.uri);

    try {
      const response = await fetch(client + "upload/create/User", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + session,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.result);
      } else {
        console.error("Erreur lors de l'upload, code de statut :", response.status);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image :", error);
    }
  };



  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      await uploadFile(result);
    }
  };

  const handleCityToggle = (city: string) => {
    setFiltersData((prevFilters) => {
      const isSelected = prevFilters.location.includes(city);
      const updatedLocations = isSelected
        ? prevFilters.location.filter(selectedCity => selectedCity !== city)
        : [...prevFilters.location, city];

      return {
        ...prevFilters,
        location: updatedLocations,
      };
    });
  };

  const renderTags = (items: string[], selectedItems: string[], onToggle?: (city: string) => void) => {
    return items.map((item: string) => (
      <TouchableOpacity
        key={item}
        style={[styles.tag, selectedItems.includes(item) && styles.selectedTag]}
        onPress={() => onToggle && onToggle(item)}
        accessibilityRole="button"
        accessibilityState={{ selected: selectedItems.includes(item) }}
      >
        <Text
          style={[
            styles.tagLabel,
            selectedItems.includes(item) && styles.selectedTagLabel,
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ));
  };

  async function updateData() {
    try {
      if (!session) return;
      await fetch(client + "filter/update-filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify(filtersData),
      });
    } catch (error) {
      console.log("Filter error: " + error);
    }
    setReloadPets(true)
  }


  useEffect(() => {
    const timer = setTimeout(() => {
      updateData();
    }, 1500);

    return () => clearTimeout(timer);
  }, [filtersData]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: profileImage }}
          style={styles.profileImage}
          accessibilityLabel="Profile image"
        />
        <SwipeButton
          style={styles.editButton}
          name="camera-retro"
          size={24}
          color={colors.ERROR}
          onPress={selectImage}
        />
        <View style={{ alignSelf: "center", marginBottom: 15, marginTop: -40 }}>
          <Text style={styles.title}>{user?.name}</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.label}>Villes</Text>
        <View style={styles.checkboxContainer}>
          {renderTags(cities, filtersData.location, handleCityToggle)}
        </View>

        <Text style={styles.label}>Distance: {filtersData.distance} km</Text>
        <Slider
          maximumTrackTintColor={colors.SECONDARY}
          thumbTintColor={colors.SECONDARY}
          style={styles.slider}
          minimumValue={1}
          maximumValue={80}
          step={1}
          value={filtersData.distance}
          onValueChange={setDistance}
          accessibilityLabel={`Distance: ${filtersData.distance} km`}
        />

        <Text style={styles.label}>Age: {filtersData.ageMax} years</Text>
        <Slider
          maximumTrackTintColor={colors.SECONDARY}
          thumbTintColor={colors.SECONDARY}
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={filtersData.ageMax}
          onValueChange={setAgeMax}
          accessibilityLabel={`Select age: ${filtersData.ageMax} years`}
        />

        <Text style={styles.label}>Animaux</Text>
        <View style={styles.filterAnimalsContainer}>
          <AnimalCheckbox
            icon="cat"
            label="Chat"
            isChecked={filtersData.isCat}
            onPress={() => toggleFilter("isCat")}
          />
          <AnimalCheckbox
            icon="dog"
            label="Chien"
            isChecked={filtersData.isDog}
            onPress={() => toggleFilter("isDog")}
          />
          <AnimalCheckbox
            icon="crow"
            label="Oiseaux"
            isChecked={filtersData.isBird}
            onPress={() => toggleFilter("isBird")}
          />
          <AnimalCheckbox
            icon="paw"
            label="Autres"
            isChecked={filtersData.isOther}
            onPress={() => toggleFilter("isOther")}
          />
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.label}>Paramètres</Text>
        <TouchableOpacity
          onPress={() => router.navigate("infos")}
          style={[styles.button, { backgroundColor: "black" }]}
        >
          <Text style={styles.editButtonText}>Editer les infos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.ERROR }]}
          onPress={() => {
            signOut();
          }}
        >
          <Text style={styles.editButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  button: {
    textAlign: "center",
    alignItems: "center",
    marginHorizontal: "auto",
    marginVertical: 10,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    width: "80%",
    elevation: 3,
    color: "#FFF",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  title: {
    fontSize: 25,
    fontFamily: "Poppins-SemiBold",
  },
  photoIcon: {
    textAlign: "center",
    marginTop: 8,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImage: {
    marginTop: 20,
    borderWidth: 5,
    borderColor: colors.SECONDARY_BORDER,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  filterAnimalsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#FFF",
  },
  editButton: {
    backgroundColor: colors.CONTRAST,
    borderRadius: 50,
    position: "relative",
    bottom: 50,
    marginLeft: 120,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  filterContainer: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  checkboxContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 15,
    width: "100%"
  },
  tag: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.SECONDARY,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "white",
    alignSelf: "center"
  },
  selectedTag: {
    backgroundColor: colors.SECONDARY,
  },
  tagLabel: {
    color: colors.SECONDARY,
    textTransform: "capitalize",
  },
  selectedTagLabel: {
    color: "white",
  },
});
export default Account;
