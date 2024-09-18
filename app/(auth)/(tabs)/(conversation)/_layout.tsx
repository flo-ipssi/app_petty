import { Stack, useGlobalSearchParams } from 'expo-router';

export default function Layout() {
    const { petName } = useGlobalSearchParams();
    
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="chat/[id]"
                options={{
                    title: petName as string || "Conversation"
                }}
            />
        </Stack>
    );
}
