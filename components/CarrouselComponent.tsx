import React from "react";
import {
    View,
    Dimensions,
    StyleSheet,
    ImageBackground,
    Text,
    Image
} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";

interface SlideData {
    file: {
        publicId: string;
        url: string;
    };
}

interface CarouselProps {
    slideList: any
}

const { width, height } = Dimensions.get("window");

const CarrouselComponent: React.FC<CarouselProps> = ({ slideList }) => {

    return (
        <View style={styles.container}>
            <SwiperFlatList
                // autoplay
                // autoplayDelay={2}
                index={0}
                data={slideList}
                renderItem={({ item }) => (
                    <Image style={styles.image} source={{ uri:item.file.url}} />
                )}
                // renderItem={({ item }) => (
                //     <View style={[styles.child]}>
                //         <ImageBackground
                //             source={item.file.url}
                //             resizeMode="cover"
                //             style={styles.image}
                //         ></ImageBackground>
                //     </View>
                // )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: "column", backgroundColor: "darkgrey" },
    child: { width, height: height - 300, justifyContent: "center" },
    image: {
        height: Dimensions.get('window').height * 0.5,
        width: Dimensions.get('window').width,
      }
});

export default CarrouselComponent;
