import { Alert, Button, ScrollView, StyleSheet, TextInput } from "react-native";
import _ from "lodash";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useSession } from "../../ctx";
import colors from "@/utils/colors";
import { Key, useCallback, useEffect, useState } from "react";
import client from "@/app/api/client";
import AppImagePicker from "@/components/ui/AppImagePicker";
import CustomModal from "@/components/CustomModal";
import * as ImagePicker from "expo-image-picker";
import { UploadData } from "@/@types/upload";
import { DataURIToBlob } from "@/app/helpers/uploadMedia";

export default function Apartment() {
  const { session, user } = useSession();
  const [description, setDescription] = useState("");
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const [modalDeletePhotoVisible, setModalDeletePhotoVisible] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [gallery, setGallery] = useState(Array(6).fill(''));
  const fetchLatestResidence = async (): Promise<UploadData[]> => {
    const res = await fetch(client + `upload/residence`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${session}`,
      },
    });
    const data = await res.json();
    const filledGallery = [...data?.uploads, ...Array(6 - data?.uploads.length).fill(null)];
    setGallery(filledGallery);

    return data;
  };

  const handleTextChange = (inputText: any) => {
    setDescription(inputText);
    saveDescription(inputText);
  };

  const saveDescription = useCallback(
    _.debounce(async (newDescription) => {
      try {
        const res = await fetch(client + `profile/save/infos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${session}`,
          },
          body: JSON.stringify({ newDescription: newDescription }),
        });
        const data = await res.json();
        return data;
      } catch (error) {
        console.error("Error saving description", error);
      }
    }, 1000),
    []
  );

  const handleTakePhoto = async () => {
    setModalPhotoVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Vous devez autoriser l'accès à la caméra pour prendre une photo."
      );
      return;
    }
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      uploadFile(result);
    }
  };

  const handleSelectFromGallery = async () => {
    setModalPhotoVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission refusée",
        "Vous devez autoriser l'accès à la galerie pour sélectionner une photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then((result) => {
      if (!result.canceled) {
        uploadFile(result);
      }
    });
  };

  const uploadFile = async (uploadImg: { assets: any[] }) => {
    const assets = uploadImg.assets[0];

    const filename = assets.uri.split("/").pop();

    const match = /\.(\w+)$/.exec(filename || '');
    const type = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("upload", {
      uri: assets.uri,
      name: filename,
      type: type,
    } as any);

    try {
      await fetch(client + `upload/create/Residence`, {
        method: "POST",
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data', 
          Authorization: "Bearer " + session,
        },
      }).then(() => {
        fetchLatestResidence();
      });
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
    }
  };


  const deleteFile = async () => {
    setModalDeletePhotoVisible(false);
    if (imageToDelete) {
      try {
        await fetch(client + "upload/delete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + session,
          },
          body: JSON.stringify(imageToDelete),
        }).then(() => {
          fetchLatestResidence();
        });
      } catch (error) { }
    }
  };

  useEffect(() => {
    if (user) {
      setDescription(user.description);
    }
    fetchLatestResidence();
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.divContainer}>
        <Text style={styles.intitule}>Photos</Text>
        <View style={styles.row}>
          {gallery.map((item: UploadData | null, index) => {
            console.log(item);

            return (
              <View key={index}>
                {item ? (
                  <View style={styles.cell}>
                    <AppImagePicker
                      key={item.id}
                      onClick={() => {
                        setModalDeletePhotoVisible(true);
                        setImageToDelete(item);
                      }}
                      imgSource={{ uri: item.file.url }}
                    />
                  </View>
                ) : (
                  <View style={styles.cell}>
                    <AppImagePicker onClick={() => setModalPhotoVisible(true)} />
                  </View>
                )}
              </View>
            );
          })}

          {/* Modal Photo */}
          <CustomModal
            visible={modalPhotoVisible}
            onSelectFromGallery={handleSelectFromGallery}
            onTakePhoto={handleTakePhoto}
            onClose={() => {
              setModalPhotoVisible(!modalPhotoVisible);
            }}
          />

          <CustomModal
            visible={modalDeletePhotoVisible}
            customMessage="Valider la suppression"
            onCustomPress={deleteFile}
            onClose={() => {
              setModalDeletePhotoVisible(!modalDeletePhotoVisible);
            }}
          />
        </View>

        <Text style={styles.intitule}>À propos</Text>

        <View style={styles.row}>
          <TextInput
            style={styles.textArea}
            multiline={true}
            numberOfLines={4}
            onChangeText={handleTextChange}
            value={description}
            placeholderTextColor={colors.OVERLAY}
            placeholder="Décrivez vous en quelques lignes ..."
          /></View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  divContainer: {
    margin: 10,
    padding: 20,
    borderRadius: 10,
  },
  row: {
    backgroundColor: "white",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 18,
    marginTop: 18,
    paddingStart: 0,
  },
  cell: {
    // aspectRatio: 1,
    padding: 135 / 76,
    marginBottom: 10,
  },
  intitule: {
    marginTop: 10,
    fontSize: 18,
    color: colors.DARK,
    fontFamily: "Poppins-SemiBold",
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textArea: {
    borderWidth: 1,
    textAlignVertical: 'top',
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    borderRadius: 4,
    padding: 15,
    minHeight: 150,
    fontFamily: "Poppins-Regular",
    width: "90%",
  },
});
