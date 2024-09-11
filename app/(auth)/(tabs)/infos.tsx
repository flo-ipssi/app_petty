import React, { FC, useCallback, useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import colors from "@/utils/colors";
import {
  Keys,
  getFromAsyncStorage,
  removeFromAsyncStorage,
} from "@/utils/asyncStorage";
import _ from "lodash";
import { useSession } from "@/app/ctx";
import client from "@/app/api/client";
import { User } from "@/@types/user";
import AvatarField from "@/components/ui/AvatarField";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";

interface Props { }
const Infos: FC<Props> = () => {
  const { signOut, session, user } = useSession();
  const [userInfo, setUserInfo] = useState<User | null | undefined>(user);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');


  const handleLogout = async (fromAll?: boolean) => {
    try {
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      if (!token) return;
      await fetch(
        client + "auth/log-out?fromAll=" + (fromAll ? "yes" : ""),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await removeFromAsyncStorage(Keys.AUTH_TOKEN);
    } catch (error) {
      console.log(error); 
    }
  };

  const handleDeleteAccount = () => {
    // Code pour supprimer le compte de l'utilisateur
  };



  const handleImageSelect = async () => {
    // try {
    //     await getPermissionToReadImages();
    //     const { path } = await ImagePicker.openPicker({
    //         cropping: true,
    //         width: 300,
    //         height: 300,
    //     });
    //     setUserInfo({ ...userInfo, avatar: path });
    // } catch (error) {
    //     console.log(error);
    // }
  };

  const handleTextChange = (inputText: React.SetStateAction<string>) => {
    setName(inputText);
    saveName(inputText);
  };
  const saveName = useCallback(
    _.debounce(async (newName) => {
      // Exemple d'appel API avec un token
      const token = await getFromAsyncStorage(Keys.AUTH_TOKEN);
      if (!token) return;

      try {
        const res = await fetch(client + `profile/save/infos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newName: newName }),
        });
        const data = await res.json();
        console.log("Name saved:", data);
        return data;
      } catch (error) {
        console.error("Error saving description", error);
      }
    }, 1000),
    []
  );
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name)
      setAvatar(userInfo.avatar)
    }
  }, [userInfo]);

  return (
    <View style={styles.container}>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Settings</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        <View style={styles.avatarContainer}>
          {/* <AvatarField source={userInfo.avatar} /> */}
          <AvatarField source={avatar} />
          <Pressable onPress={handleImageSelect} style={styles.paddingLeft}>
            <Text style={styles.linkText}>Profil</Text>
            <View style={styles.emailConainer}>
              <Text style={styles.email}>{userInfo?.email}</Text>
              <MaterialIcons
                name="verified"
                size={15}
                color={colors.SECONDARY}
              />
            </View>
          </Pressable>
        </View>
        <TextInput
          onChangeText={handleTextChange}
          style={styles.nameInput}
          value={name}
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Logout</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        {/* <TouchableOpacity
                  onPress={() => handleLogout}
                  style={[styles.button, styles.buttonColor, styles.logoutBtn]}
              >
                  <AntDesign name="logout" size={20} color={colors.INACTIVE_CONTRAST} />
                  <Text style={styles.logoutBtnTitle}>Se déconnecter</Text>
              </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => handleLogout(true)}
          style={[styles.button, styles.buttonColor, styles.logoutBtn]}
        >
          <AntDesign name="logout" size={20} color={colors.INACTIVE_CONTRAST} />
          <Text style={styles.logoutBtnTitle}>
            Se déconnecter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteAccount}
          style={[styles.button, styles.buttonColor, styles.deleteAccount, styles.logoutBtn]}
        >
          <Entypo name="trash" size={20} color={colors.INACTIVE_CONTRAST} />
          <Text style={styles.logoutBtnTitle}>Supprimer le compte</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    marginTop: 15,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    color: colors.SECONDARY,
  },
  settingOptionsContainer: {
    marginTop: 15,
    paddingLeft: 15,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: colors.SECONDARY,
    fontStyle: "normal",
    fontFamily: "Poppins-Regular",
  },
  paddingLeft: {
    paddingLeft: 15,
  },
  nameInput: {
    color: colors.DARK,
    fontWeight: "bold",
    fontSize: 18,
    padding: 10,
    borderWidth: 0.5,
    borderColor: colors.DARK,
    borderRadius: 7,
    marginTop: 15,
  },
  emailConainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  email: {
    color: colors.DARK,
    marginRight: 10,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
  deleteAccount: {
    backgroundColor: colors.ERROR
  },
  logoutBtnTitle: {
    color: "#FFF",
    fontSize: 15,
    marginLeft: 5,
    marginRight: 5,
    fontFamily: "Poppins-SemiBold"
  },
  marginTop: {
    marginTop: 15,
  },
  buttonColor: {
    backgroundColor: colors.SECONDARY,
  },
  invisible: {
    color: colors.DARK,
    backgroundColor: colors.GRAY,
    borderWidth: 1,
    borderColor: colors.DARK,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
export default Infos;
