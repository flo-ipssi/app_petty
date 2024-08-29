import { Stack } from 'expo-router';

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
                name="infos"
                options={{
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
