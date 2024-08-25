import { Redirect, Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSession } from '../ctx';
import { Text } from '@/components/Themed';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/login" />;
  }

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
      </Stack>
    </QueryClientProvider>
  )
}
