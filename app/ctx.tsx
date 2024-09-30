import React, { useEffect, useState } from "react";
import { useStorageState } from "./useStorageState";
import axios from 'axios';
import client from "@/app/api/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderPage from "@/components/LoaderPage";
import { disconnectSocket, initSocket } from "./helpers/socket";

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

  const [isAppReady, setIsAppReady] = useState(false);

  // Load session and user
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedSession = await AsyncStorage.getItem('session');
        const storedUser = await AsyncStorage.getItem('user');


        if (storedSession && storedUser) {
          setSession(storedSession);
          setUser(JSON.parse(storedUser));
          await verifySession(storedSession); // Nouvelle vérification de la session
        }

        setTimeout(() => {
          setIsAppReady(true);
        }, 1000);

      } catch (error) {
        console.error('Failed to load session or user from storage:', error);
      }
    };

    loadSession();
  }, []);

  // Check the session
  const verifySession = async (currentSession: string) => {
    try {
      const response = await fetch(client + "auth/is-auth", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentSession}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.profile;

        if (userData) {
          setUser(userData);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        signOut();
      }
    } catch (error) {
      console.error('Error verifying session:', error);
      signOut(); // En cas d'erreur, déconnectez l'utilisateur
    }
  };

  // Filters
  useEffect(() => {
    const loadFilters = async () => {
      if (user && session) {
        try {
          const response = await fetch(client + "filter/get", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${session}`,
            },
          });

          const data = await response.json();
          setFiltersData({
            ...data.filter,
            location: Array.isArray(data.filter.location) ? data.filter.location : [],
          });
        } catch (error) {
          console.error('Failed to load filters:', error);
        }
      }
    };
    loadFilters();
  }, [user, session]);

  const signOut = async () => {
    try {
      if (session) {
        await fetch(client + "auth/log-out?fromAll=yes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session}`,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }

    await AsyncStorage.removeItem('session');
    await AsyncStorage.removeItem('user');

    setUser(null);
    setSession(null);
  };

  if (!isAppReady) {
    return <LoaderPage />;
  }

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

            if (token && userData) {
              setSession(token);
              setUser(userData);

              await AsyncStorage.setItem('session', token);
              await AsyncStorage.setItem('user', JSON.stringify(userData));
            }
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

