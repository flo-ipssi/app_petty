import React, { useEffect, useState } from "react";
import { useStorageState } from "./useStorageState";
import axios from 'axios';
import client from "@/app/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

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

type Filters = {
  _id: string;
  location: string[];
  gender: string[];
  ageMin: number;
  ageMax: number;

  isCat: boolean;
  isDog: boolean;
  isBird: boolean;
  isOther: boolean;
  age: number;
  distance: number;
};

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  session?: string | null;
  errorMessage?: string | null;
  user?: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setFiltersData: React.Dispatch<React.SetStateAction<Filters>>;
  reloadPets: boolean;
  setReloadPets: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  filtersData: Filters;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  errorMessage: null,
  user: null,
  setUser: () => null, 
  setFiltersData: () => null,
  reloadPets: false,
  setReloadPets: () => null,
  isLoading: false,
  filtersData: {
    _id: "",
    location: [],
    gender: [],
    ageMin: 1,
    ageMax: 1,
    isCat: false,
    isDog: false,
    isBird: false,
    isOther: false,
    age: 1,
    distance: 1,
  },
});

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
  const [reloadPets, setReloadPets] = useState(false);
  const [filtersData, setFiltersData] = useState<Filters>({
    _id: "",
    location: [],
    gender: [],
    ageMin: 1,
    ageMax: 1,
    isCat: false,
    isDog: false,
    isBird: false,
    isOther: false,
    age: 1,
    distance: 1,
  });

  // Load session and user
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem('session'); 
        const storedUser = await AsyncStorage.getItem('user');

        if (storedSession) {
          setSession(storedSession);
        }

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load session or user from storage:', error);
      }
    };

    loadSession();
  }, []);

  // Check the session
  useEffect(() => {
    const checkSession = async () => {
      if (session) {
        try {
          const response = await fetch(client + "auth/is-auth", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session}`,
            },
          });

          if (!response.ok) {
            signOut(); 
          } else {
            const data = await response.json();
            setUser(data.profile);
          }
        } catch (error) {
          console.error('Error verifying session:', error);
          signOut();
        }
      }else{
        signOut();
      }
    };

    checkSession();
  }, [session]);

  // Filters
  useEffect(() => {
    const loadFilters = async () => {
      if (user && session) {
        try {
          const reponse = await fetch(client + "filter/update-filters", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session}`,
            },
          });

          const data = await reponse.json();
          setFiltersData(data.filter);
        } catch (error) {
          console.error('Failed to load filters:', error);
        }
      }
    };
    loadFilters();
  }, [user, session]);

  const signOut = async () => {
    try {
      if (!session) return;
      await fetch(client + "auth/log-out?fromAll=yes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${session}`,
          },
        }
      )
    } catch (error) {
      console.log(error);
    }
    setUser(null);
    setSession(null);
    await AsyncStorage.removeItem('user');
    console.log('User logged out');
    // router.navigate("login")
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
          try {
            const response = await axios.post(client + "auth/sign-in", {
              email,
              password,
            });
            const token = response.data.token;
            const userData = response.data.profile;
            setSession(session);
            setUser(userData);

            await AsyncStorage.setItem('session', token);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
          } catch (error) {
            console.error("Login failed:", error);
            setErrorMessage("Failed to sign in. Please check your credentials.");
          }
        },
        signOut,
        session,
        errorMessage,
        user,
        setUser,
        isLoading,
        filtersData,
        setFiltersData,
        reloadPets,
        setReloadPets,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
