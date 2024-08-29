import React, { FC } from 'react';
import {Image, ImageSourcePropType, StyleSheet, TouchableOpacity, View } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import colors from '@/utils/colors';

interface Props {
    imgSource?: ImageSourcePropType,
    onClick?(): void
}

const AppImagePicker: FC<Props> = ({ imgSource, onClick }) => {

    return <>
        {imgSource ? (
        <View>
            <Image source={imgSource} style={styles.image} />
            <TouchableOpacity style={styles.deleteButton} onPress={onClick}>
                <AntDesign name="close"
                    size={27}
                    color={colors.ERROR} />
            </TouchableOpacity>
        </View>) :
            (<View style={[styles.image, styles.borderDot]} >
                <TouchableOpacity  style={styles.editButton} onPress={onClick}>
                    <AntDesign name="pluscircle"
                        size={30}
                        color={colors.DARK} />
                </TouchableOpacity>
            </View>)
        }
    </>

};

const styles = StyleSheet.create({
    image: {
        width: 90,
        height: 140,
        borderRadius: 10,
        margin: 5,
        borderColor: colors.OVERLAY,
    },
    deleteButton: {
        padding:4,
        position: 'absolute',
        bottom: -21,
        right: -10,
        backgroundColor: 'rgba(255,255,255,1)',
        zIndex: 99998999,
        borderRadius: 25,
    },
    editButton: {
        position: 'absolute',
        bottom: -15,
        right: -10,
        backgroundColor: 'rgba(255,255,255,1)',
        zIndex: 99998999,
        borderRadius: 25,
    },
    borderDot: {
        borderWidth: 1,
        borderStyle: "dashed",
        marginHorizontal: 8,
        marginVertical: 5,
        backgroundColor: colors.GRAY
    },
});

export default AppImagePicker;