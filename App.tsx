import AppContainer from '@/components/AppContainer';
import AppNavigator from '@/navigation';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "react-query";
import store from "@/store";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
export default function App() {
  const queryClient = new QueryClient()

  return (

    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container}>
            <AppContainer>
              <AppNavigator />
            </AppContainer>
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
