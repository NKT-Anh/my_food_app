import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { loadFavoritesFood, removeFavoritesFood } from '../../Firebase/FirebaseAPI';
import Style from '../../globals/style';

const FavoritesScreen = () => {
  const [userId, setUserId] = useState(null);
  const [favoriteFoods, setFavoriteFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        navigation.navigate('LogIn');
      }
    });
    return () => unsubscribe();
  }, [navigation]);

  useEffect(() => {
    if (userId) {
      let unsubscribe;
      try {
        unsubscribe = loadFavoritesFood(userId, (favorites) => {
          setFavoriteFoods(favorites);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error loading favorites:", error);
        setLoading(false);
      }
      return () => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      };
    }
  }, [userId]);

  const handleRemoveFavorite = async (foodId) => {
    try {
      const result = await removeFavoritesFood(userId, foodId);
      if (result.success) {
        Alert.alert("Thành công", "Đã xóa món ăn khỏi danh sách yêu thích");
        setFavoriteFoods(favoriteFoods.filter(id => id !== foodId));
      } else {
        Alert.alert("Lỗi", result.message);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa món ăn khỏi danh sách yêu thích");
    }
  };

  const renderFoodItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.foodCard}
      onPress={() => navigation.navigate('FoodDetail', { foodId: item.id })}
    >
      <Image 
        source={{ uri: item.foodImage }} 
        style={styles.foodImage}
        defaultSource={require('../../../assets/images/logoC.png')}
      />
      <View style={styles.foodInfo}>
        <Text style={styles.foodName}>{item.foodName}</Text>
        <Text style={styles.foodPrice}>
          {Number(item.foodPrice).toLocaleString('vi-VN')} đ
        </Text>
        <View style={styles.tagContainer}>
          {Array.isArray(item.tag) && item.tag.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => handleRemoveFavorite(item.id)}
      >
        <MaterialIcons
          name="favorite"
          size={24}
          color={Style.colors.cam}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Style.colors.cam} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Món ăn yêu thích</Text>
      </View>
      
      {favoriteFoods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Bạn chưa có món ăn yêu thích nào</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteFoods}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.foodList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialIcons name="favorite-border" size={64} color="#ccc" />
              <Text style={styles.emptyText}>Bạn chưa có món ăn yêu thích nào</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  foodList: {
    padding: 16,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  foodPrice: {
    fontSize: 15,
    color: Style.colors.cam,
    fontWeight: '600',
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#fff5eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Style.colors.cam,
  },
  tagText: {
    fontSize: 12,
    color: Style.colors.cam,
  },
  favoriteButton: {
    padding: 8,
  },
});

export default FavoritesScreen; 