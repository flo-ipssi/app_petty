import React from "react";
import { FC } from "react";
import { Dimensions, Image, ImageSourcePropType, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import colors from "@/utils/colors";

interface Props {
    type:string
}



const ChoiceLabel: FC<Props> = ({ type }) => {
    const color = type == "like" ? colors.PRIMARY : colors.ERROR
    return (
        <View style={[styles.container, {borderColor: color}]}>
            <Text style={{
                fontSize: 48, 
                fontWeight: 'bold',
                textTransform: "uppercase",
                letterSpacing: 4,
                color:color
            }}>{type}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      borderWidth: 7,
      borderRadius:10,
      paddingHorizontal: 15,
      backgroundColor: "rgba(0,0,0,.2)",
    },
   
});

export default ChoiceLabel;
