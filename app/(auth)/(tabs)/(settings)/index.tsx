import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Button,
  Pressable,
} from "react-native";
import { FC, SetStateAction, useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import Slider from "@react-native-community/slider";
import _ from "lodash";
import AnimalCheckbox from "@/components/ui/AnimalCheckbox";
import { useSession } from "@/app/ctx";
import colors from "@/utils/colors";
import SwipeButton from "@/components/SwipeButton";
import { User } from "@/@types/user";
import { Link, useRouter } from "expo-router";

type FilterKeys = "cat" | "dog" | "bird" | "other";
interface Props {}

const cities = ["paris", "lyon", "marseille"];

const Account: FC<Props> = () => {
  const { session, user, signOut } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null | undefined>(user);
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/200"
  );
  const [selectedCities, setSelectedCities] = useState([]);
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const [filter, setFilter] = useState<{
    cat: boolean;
    dog: boolean;
    bird: boolean;
    other: boolean;
    age: number;
    distance: number;
  }>({
    cat: false,
    dog: false,
    bird: false,
    other: false,
    age: 1,
    distance: 1,
  });

  const toggleFilter = (key: FilterKeys) => {
    setFilter((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  const setDistance = (value: number) => {
    setFilter((prevState) => ({
      ...prevState,
      distance: value,
    }));
  };

  const setAge = (value: number) => {
    setFilter((prevState) => ({
      ...prevState,
      age: value,
    }));
  };

  // const uploadFile = async (uploadImg: { canceled?: false; assets: any; }) => {
  //   const assets = uploadImg.assets[0];
  //   let split = assets.uri.split("/");
  //   let type = split[1].split(";")[0];

  //   // Change data to blob
  //   const file = DataURIToBlob(assets.uri);

  //   const formData = new FormData();
  //   formData.append("upload", file);
  //   formData.append("type", type);
  //   formData.append("file", assets.uri);

  //   try {
  //     const response = await fetch(client + "upload/create/User", {
  //       method: "POST",
  //       body: formData,
  //       headers: {
  //         Authorization: "Bearer " + session,
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);

  //       setProfileImage(data.result);
  //     }
  //   } catch (error) {
  //     let errorResponse = await error;
  //     console.log(errorResponse);

  //   }
  // };
  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      debouncedSaveProfile(); // Save immediately after image is selected
    }
  };

  const toggleSelection = (
    item: any,
    selectedItems: never[],
    setSelectedItems: {
      (value: SetStateAction<never[]>): void;
      (value: SetStateAction<never[]>): void;
      (arg0: (prevItems: any) => any): void;
    }
  ) => {
    setSelectedItems((prevItems: any[]) => {
      const newSelection = prevItems.includes(item)
        ? prevItems.filter((i: any) => i !== item)
        : [...prevItems, item];
      debouncedSaveProfile(); // Save profile after selection change
      return newSelection;
    });
  };

  const renderTags = (
    items: any[],
    selectedItems: string | any[],
    onToggle: { (city: any): void; (breed: any): void; (arg0: any): void }
  ) => {
    return items.map((item: any) => (
      <TouchableOpacity
        key={item}
        style={[styles.tag, selectedItems.includes(item) && styles.selectedTag]}
        onPress={() => onToggle(item)}
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

  // Function to save the profile
  const saveProfile = () => {
    console.log("Profile saved:", { profileImage, selectedCities, filter });
  };

  // Debounced version of saveProfile to prevent excessive saves
  const debouncedSaveProfile = useCallback(_.debounce(saveProfile, 1000), [
    profileImage,
    selectedCities,
    filter,
  ]);

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
          <Text style={styles.title}>{userData?.name}</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.label}>Cities</Text>
        <View style={styles.checkboxContainer}>
          {renderTags(cities, selectedCities, (city: any) =>
            toggleSelection(city, selectedCities, setSelectedCities)
          )}
        </View>

        <Text style={styles.label}>Distance: {filter.distance} km</Text>
        <Slider
          maximumTrackTintColor={colors.SECONDARY}
          thumbTintColor={colors.SECONDARY}
          style={styles.slider}
          minimumValue={1}
          maximumValue={80}
          step={1}
          value={filter.distance}
          onValueChange={setDistance}
          accessibilityLabel={`Distance: ${filter.distance} km`}
        />

        <Text style={styles.label}>Age: {filter.age} years</Text>
        <Slider
          maximumTrackTintColor={colors.SECONDARY}
          thumbTintColor={colors.SECONDARY}
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={filter.age}
          onValueChange={setAge}
          accessibilityLabel={`Select age: ${filter.age} years`}
        />

        <Text style={styles.label}>Animaux</Text>
        <View style={styles.filterAnimalsContainer}>
          <AnimalCheckbox
            icon="cat"
            label="Chat"
            isChecked={filter.cat}
            onPress={() => toggleFilter("cat")}
          />
          <AnimalCheckbox
            icon="dog"
            label="Chien"
            isChecked={filter.dog}
            onPress={() => toggleFilter("dog")}
          />
          <AnimalCheckbox
            icon="crow"
            label="Oiseaux"
            isChecked={filter.bird}
            onPress={() => toggleFilter("bird")}
          />
          <AnimalCheckbox
            icon="paw"
            label="Autres"
            isChecked={filter.other}
            onPress={() => toggleFilter("other")}
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
    alignItems: "center",
    flexDirection: "row",
    marginVertical: 15,
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
