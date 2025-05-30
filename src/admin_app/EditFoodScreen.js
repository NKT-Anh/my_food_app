import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { updateFoodItem } from '../Firebase/FirebaseAPI'; 

const EditFoodScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { foodData } = route.params;

  const [foodName, setFoodName] = useState(foodData.foodName || '');
  const [foodPrice, setFoodPrice] = useState(foodData.foodPrice ? String(foodData.foodPrice) : '');
  const [description, setDescription] = useState(foodData.description || '');
  const [currentFoodImage, setCurrentFoodImage] = useState(foodData.foodImage || '');
  const [newFoodImageUri, setNewFoodImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Quyền truy cập bị từ chối', 'Cần quyền truy cập thư viện ảnh để chọn ảnh.');
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewFoodImageUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!foodName || !foodPrice || !description || (!currentFoodImage && !newFoodImageUri)) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }

    const updatedFoodItem = {
      ...foodData,
      foodName: foodName.trim(),
      foodPrice: foodPrice.trim(),
      description: description.trim(),
      foodImage: currentFoodImage,
    };

    try {
      updatedFoodItem.foodImage = newFoodImageUri || currentFoodImage;

      const result = await updateFoodItem(foodData.id, updatedFoodItem);

      if (result.success) {
        Alert.alert('Thành công', result.message);
        navigation.goBack();
      } else {
        Alert.alert('Lỗi', result.message || 'Không thể cập nhật món ăn.');
      }
    } catch (error) {
      console.error('Error updating food:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi lưu thông tin.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Chỉnh sửa: {foodData.foodName || 'Không tên'}</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.label}>Tên món ăn:</Text>
        <TextInput
          style={styles.input}
          value={foodName}
          onChangeText={setFoodName}
          placeholder="Nhập tên món ăn"
        />

        <Text style={styles.label}>Giá:</Text>
        <TextInput
          style={styles.input}
          value={foodPrice}
          onChangeText={setFoodPrice}
          placeholder="Nhập giá"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Mô tả:</Text>
        <TextInput
          style={styles.input}
          value={description}
          onChangeText={setDescription}
          placeholder="Nhập mô tả"
          multiline
        />

        <Text style={styles.label}>Hình ảnh:</Text>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          <Image
            source={newFoodImageUri ? { uri: newFoodImageUri } : (currentFoodImage ? { uri: currentFoodImage } : { uri: 'https://via.placeholder.com/150' })}
            style={styles.foodImage}
          />
        </TouchableOpacity>
        <Text style={styles.imageHint}>Chạm vào ảnh để chọn ảnh mới</Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  nav: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 15,
    marginBottom: 10,
    paddingTop: 10,
  },
  backButton: {
    marginRight: 10,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0e90ad',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#0e90ad',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 15,
  },
  foodImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imageHint: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default EditFoodScreen; 