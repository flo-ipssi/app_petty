import { FC, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
// import AntDesign from "@expo/vector-icons/AntDesign";
import colors from "@/utils/colors";
import { Image, StyleSheet, View } from "react-native";

interface Props {
  color?: string;
}

const LoaderPage: FC<Props> = ({ color = colors.PRIMARY }) => {
  // Animation de rotate 
  // const initialRotation = useSharedValue(0);
  // const transform = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ rotate: `${initialRotation.value}deg` }],
  //   };
  // });

  // useEffect(() => {
  //   initialRotation.value = withRepeat(withTiming(360), -1);
  // });

  // Animation scale 
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  useEffect(() => {
    scaleValue.value = withRepeat(
      withTiming(1.5, { duration: 600 }), 
      -1,
      true
    );
  }, []);

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        backgroundColor: colors.OVERLAY,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      <Animated.View style={animatedStyle}>
        {/* <AntDesign name="loading1" size={24} color={color} /> */}
        <Image
          style={styles.stretch}
          source={require("../assets/logos/no-label.png")}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  stretch: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
});

export default LoaderPage;
