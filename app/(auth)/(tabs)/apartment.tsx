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

export default function TabOneScreen() {
  const { signOut, session, user } = useSession();
  const [description, setDescription] = useState("");
  const [modalPhotoVisible, setModalPhotoVisible] = useState(false);
  const [modalDeletePhotoVisible, setModalDeletePhotoVisible] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Query
  // const { data, isLoading, refetch,isSuccess } = useFetchLatestResidence();

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
    setGallery(data?.uploads);

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
      // Faire quelque chose avec la photo prise
      console.log("Photo prise:", result);
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
    }).then((result: { canceled: any }) => {
      if (!result.canceled) {
        uploadFile(result);
      }
    });
  };

  const DataURIToBlob = (dataURI: string) => {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  };

  const uploadFile = async (uploadImg: { assets: any[] }) => {
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
      const response = await fetch(client + `upload/create/Residence`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + session,
          // 'Content-Type': 'multipart/form-data;',
          // 'Access-Control-Allow-Origin': '*',
        },
      }).then(() => {
        fetchLatestResidence();
      });

      if (!response.ok) {
      } else {
      }
    } catch (error) {
      let errorResponse = await error;
    }
  };

  const deleteFile = async () => {
    setModalDeletePhotoVisible(false);
    if (imageToDelete) {
      try {
        const response = await fetch(client + "upload/delete", {
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
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.intitule}>Photos</Text>
        <View style={styles.row}>
          {gallery.map(
            (
              item: any,
              index
            ) => {
              return (
                <View key={item.id} style={styles.cell}>
                  <AppImagePicker
                    key={item.id}
                    onClick={() => {
                      setModalDeletePhotoVisible(true);
                      setImageToDelete(item);
                    }}
                    imgSource={{ uri: item.file.url }}
                  />
                </View>
              );
            }
          )}

          {gallery.length < 9 ? (
            <><View style={styles.cell}>
              <AppImagePicker onClick={() => setModalPhotoVisible(true)} />
            </View><View style={styles.cell}>
                <AppImagePicker onClick={() => setModalPhotoVisible(true)} />
              </View><View style={styles.cell}>
                <AppImagePicker onClick={() => setModalPhotoVisible(true)} />
              </View><View style={styles.cell}>
                <AppImagePicker onClick={() => setModalPhotoVisible(true)} />
              </View><View style={styles.cell}>
                <AppImagePicker onClick={() => setModalPhotoVisible(true)} />
              </View></>
          ) : null}

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

        <TextInput
          style={styles.textArea}
          multiline={true}
          onChangeText={handleTextChange}
          value={description}
          placeholderTextColor={colors.OVERLAY}
          placeholder="Décrivez vous en quelques lignes ..."
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height:"100%",
    alignItems: "center"
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginBottom: 18,
    paddingStart: 25,
  },
  cell: {
    // aspectRatio: 1,
    padding: 135 / 76,
    marginBottom: 10,
  },
  intitule: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.DARK,
    fontFamily: "Poppins-Regular",
    alignSelf: "flex-start",
    paddingHorizontal: 25,
    paddingVertical: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#FFF",
    borderRadius: 4,
    padding: 10,
    minHeight: 150,
    width: "90%",
  },
});
