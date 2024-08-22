import { FC } from 'react';
import { StyleSheet, View, Animated, Text, ImageBackground, Dimensions, ImageSourcePropType, Pressable } from 'react-native';
import colors from '@/utils/colors';
import { Fonts } from '@/utils/fonts';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PassewordVisibilityIcon from './PassewordVisibilityIcon';
import React from 'react';

interface Props {
    position?: Animated.ValueXY;
    onPress?(): void;
    infos?: any;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

const CardSwipe: FC<Props> = ({ position, onPress, infos }) => {

    const likeOpacity = position?.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
    });

    const dislikeOpacity = position?.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
    });

    const profil = infos.uploads
        .filter((upload: { profil: any; }) => upload.profil)
        .map((upload: { file: { url: any; }; }) => upload.file.url)[0]

    return (
        <View style={styles.imageContainer} data-attri={infos._id}>
            <ImageBackground
                source={profil}
                style={styles.imageBackground}>
                {position ? (
                    <><Animated.View
                        style={{
                            opacity: likeOpacity, transform: [{ rotate: '-30deg' }],
                            position: 'absolute', top: 50, left: 40, zIndex: 1000
                        }}>
                        <Text
                            style={{ borderWidth: 1, borderColor: 'green', color: 'green', fontSize: 32, fontWeight: '800', padding: 10 }}>
                            LIKE
                        </Text>
                    </Animated.View><Animated.View
                        style={{
                            opacity: dislikeOpacity,
                            transform: [{ rotate: '30deg' }], position: 'absolute',
                            top: 50, right: 40, zIndex: 1000
                        }}>
                            <Text
                                style={{
                                    borderWidth: 1, borderColor: 'red',
                                    color: 'red', fontSize: 32, fontWeight: '800', padding: 10
                                }}>
                                NOPE
                            </Text>
                        </Animated.View></>
                ) : null}

                {/* <Image
      style={{ flex: 1, height: null, width: null, resizeMode: 'cover', borderRadius: 20 }}
      source={item.url}
   /> */}

                <View style={styles.identity}>
                    <Pressable onPress={onPress} >

                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <Text style={styles.title}>{infos.name}, {infos.age} ans</Text>
                            <View style={{
                                position: "absolute",
                                right: 0
                            }}>
                                <PassewordVisibilityIcon privateIcon={true} isWhite={true} customSize={25} />
                            </View>
                        </View>
                        <View style={styles.identityContainer}>
                            <Text style={styles.text}>
                                <MaterialCommunityIcons name="gender-female" size={15} />
                                {infos.gender}
                            </Text>
                            <Text style={styles.text}>
                                <MaterialCommunityIcons name="map-marker" size={15} />
                                {infos.location}
                            </Text>
                            <Text style={styles.text}>
                                <MaterialCommunityIcons name="paw" size={15} />
                                {infos.breed}
                            </Text>
                        </View>
                    </Pressable>
                </View>
            </ImageBackground>
        </View>)
};

const styles = StyleSheet.create({

    imageBackground: {
        flex: 1,
        resizeMode: 'cover', // Pour couvrir toute la zone avec l'image
        justifyContent: 'center',
    },
    identity: {
        backgroundColor: colors.OVERLAY,
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingHorizontal: 30,
        paddingBottom: 20,
        paddingTop: 10
    },
    identityContainer: {
        flexDirection: 'row', // Pour afficher les éléments horizontalement
        justifyContent: 'space-between', // Pour espacer les éléments également sur la ligne
        alignItems: 'flex-start', // Pour aligner les éléments verticalement au centre
        paddingVertical: 5
    },
    title: {
        fontSize: 18,
        fontFamily: Fonts.regular,
        color: "#ffffff"
    },
    text: {
        textTransform: 'capitalize',
        fontSize: 17,
        fontFamily: Fonts.light,
        color: "#ffffff"
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        borderRadius: 20, // Pour arrondir les coins
    },
    poppins_medium: {
        fontSize: 20,
        fontFamily: "Poppins_500Medium",
    },
    poppins_light: {
        fontSize: 20,
        fontFamily: "Poppins_300Light",
    },
});

export default CardSwipe;