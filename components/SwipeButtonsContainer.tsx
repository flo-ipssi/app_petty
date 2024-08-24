import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import SwipeButton from './SwipeButton';
import colors from '@/utils/colors';

interface Props { 
  handleChoice($p: number) : any
}

const SwipeButtonsContainer: FC<Props> = ({ handleChoice }) => {
  return (
    <View style={styles.container}>
      <SwipeButton
        name="times"
        size={24}
        color={colors.ERROR} 
        onPress={() => handleChoice(-1)}
        />
      <SwipeButton
        name="star"
        size={20}
        color={colors.SECONDARY}
        // style={{height:40,wight:40,padding:0}} 
        />
      <SwipeButton
        name="heart"
        size={24}
        color={colors.PRIMARY}
        onPress={() => handleChoice(1)}
         />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 15,
    width:240,
    flexDirection: "row",
    alignItems:"center",
    justifyContent: "center",
    zIndex:-999
  },
});

export default SwipeButtonsContainer;
