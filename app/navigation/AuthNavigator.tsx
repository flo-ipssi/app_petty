import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "@/@types/navigation";
import SignUp from "../SignUp";
import Login from "../login";
import LostPassword from "../LostPassword";
import Verification from "../Verification";

const Stack = createNativeStackNavigator<AuthStackParamList>()
 
const AuthNavigator = () => {
   return <Stack.Navigator screenOptions={{
      headerShown: false
   }}>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignIn" component={Login} />
      <Stack.Screen name="LostPassword" component={LostPassword} />
      <Stack.Screen name="Verification" component={Verification} />
   </Stack.Navigator>
};


export default AuthNavigator;