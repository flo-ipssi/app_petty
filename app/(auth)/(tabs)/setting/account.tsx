import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FC, SetStateAction, useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import _ from 'lodash';
import AnimalCheckbox from '@/components/ui/AnimalCheckbox';
import { Fonts } from '@/utils/fonts';

type FilterKeys = 'cat' | 'dog' | 'bird' | 'other';
interface Props { }

const cities = ['paris', 'lyon', 'marseille'];

const Account: FC<Props> = () => {
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/200');
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [filter, setFilter] = useState<{
    cat: boolean;
    dog: boolean;
    bird: boolean;
    other: boolean;
    age: number;
    distance: number;
  }>({
    cat: false,
    dog: false,
    bird: false,
    other: false,
    age: 1,
    distance: 1,
  });

  const toggleFilter = (key: FilterKeys) => {
    setFilter((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };
  const setDistance = (value: number) => {
    setFilter((prevState) => ({
      ...prevState,
      distance: value,
    }));
  };

  const setAge = (value: number) => {
    setFilter((prevState) => ({
      ...prevState,
      age: value,
    }));
  };

  const selectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      debouncedSaveProfile(); // Save immediately after image is selected
    }
  };

  const toggleSelection = (item: any, selectedItems: never[], setSelectedItems: { (value: SetStateAction<never[]>): void; (value: SetStateAction<never[]>): void; (arg0: (prevItems: any) => any): void; }) => {
    setSelectedItems((prevItems: any[]) => {
      const newSelection = prevItems.includes(item)
        ? prevItems.filter((i: any) => i !== item)
        : [...prevItems, item];
      debouncedSaveProfile(); // Save profile after selection change
      return newSelection;
    });
  };

  const renderCheckboxes = (items: any[], selectedItems: string | any[], onToggle: { (city: any): void; (breed: any): void; (arg0: any): void; }) => {
    return items.map((item: any) => (
      <TouchableOpacity
        key={item}
        style={styles.checkboxRow}
        onPress={() => onToggle(item)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: selectedItems.includes(item) }}
      >
        <View style={styles.checkbox}>
          {selectedItems.includes(item) && <View style={styles.checked} />}
        </View>
        <Text style={styles.checkboxLabel}>{item}</Text>
      </TouchableOpacity>
    ));
  };

  // Function to save the profile
  const saveProfile = () => {
    console.log('Profile saved:', { profileImage, selectedBreeds, selectedCities, filter });
  };

  // Debounced version of saveProfile to prevent excessive saves
  const debouncedSaveProfile = useCallback(_.debounce(saveProfile, 1000), [profileImage, selectedBreeds, selectedCities, filter]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: profileImage }}
          style={styles.profileImage}
          accessibilityLabel="Profile image"
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={selectImage}
          accessibilityLabel="Edit photo"
        >
          <Text style={styles.editButtonText}>Edit Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.label}>Cities</Text>
        <View style={styles.checkboxContainer}>
          {renderCheckboxes(cities, selectedCities, (city: any) => toggleSelection(city, selectedCities, setSelectedCities))}
        </View>


        <Text style={styles.label}>Distance: {filter.distance} years</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={80}
          step={1}
          value={filter.distance}
          onValueChange={setDistance}
          accessibilityLabel={`Distance: ${filter.distance} km`}
        />

        <Text style={styles.label}>Age: {filter.age} years</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={20}
          step={1}
          value={filter.age}
          onValueChange={setAge}
          accessibilityLabel={`Select age: ${filter.age} years`}
        />

        <Text style={styles.label}>Breeds</Text>
        <View style={styles.filterAnimalsContainer}>
          <AnimalCheckbox
            icon="cat"
            label="Chat"
            isChecked={filter.cat}
            onPress={() => toggleFilter('cat')}
          />
          <AnimalCheckbox
            icon="dog"
            label="Chien"
            isChecked={filter.dog}
            onPress={() => toggleFilter('dog')}
          />
          <AnimalCheckbox
            icon="crow"
            label="Oiseaux"
            isChecked={filter.bird}
            onPress={() => toggleFilter('bird')}
          />
          <AnimalCheckbox
            icon="paw"
            label="Autres"
            isChecked={filter.other}
            onPress={() => toggleFilter('other')}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  filterAnimalsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    backgroundColor: "#FFF",
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    marginTop: 10,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  checkboxContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 15
  },
  checkboxRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 10,
    paddingRight: 15
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 3,
    marginRight: 5,
  },
  checked: {
    width: 12,
    height: 12,
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    textTransform: "capitalize"
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default Account;