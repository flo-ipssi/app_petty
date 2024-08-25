import React, { useEffect, useState } from "react";
import { useStorageState } from "./useStorageState";
import axios from 'axios';
import client from "@/app/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  firstname: string;
  fullname: string;
  email: string;
  phone: string;
  description: string;
  avatar: string;
};

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: string | null;
  errorMessage?: string | null;
  user?: User | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  errorMessage: null,
  user: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [user, setUser] = useState<User | null>(null); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      // console."Chargement de l'utilisateur depuis AsyncStorage:", storedUser);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          try {
            const response = await axios.post(client + "auth/sign-in", {
              email,
              password
            });

            setSession(response.data.token);
            const userData = response.data.profile;
            setUser(userData);
            await AsyncStorage.setItem('user', JSON.stringify(userData));

          } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Failed to sign in. Please check your credentials.');
          }
        },
        signOut: async () => {
          setUser(null);
          setSession(null);
          await AsyncStorage.removeItem('user');
        },
        session,
        errorMessage,
        user,
        isLoading
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
