import { FontAwesome } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="modal"
                options={{
                    presentation: 'modal',
                    title: "Paramètres",
                    // headerLeft: () => {
                    //     return <Link href="../">
                    //         <Pressable>
                    //             {({ pressed }) => (
                    //                 <FontAwesome
                    //                     name="arrow-left"
                    //                     size={20}
                    //                     style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }} />
                    //             )}
                    //         </Pressable>
                    //     </Link>;
                    // }
                }}
            />
        </Stack>
    );
}
