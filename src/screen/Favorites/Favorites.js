import { StyleSheet, Text, View, ActivityIndicator, FlatList, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { loadFavoritesFood, removeFavoritesFood } from '../../Firebase/FirebaseAPI'
import { UserContext } from '../../Firebase/UserContext'
import { useFavorites } from '../../Firebase/FavoritesContext'
import { MaterialIcons } from '@expo/vector-icons'
import Style from '../../globals/style'
import BottomNavigation from '../../navigator/BottomNavigation'
import { getDoc, doc, updateDoc, setDoc, arrayRemove } from 'firebase/firestore'
import { db } from '../../Firebase/FirebaseConfig'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Favorites = () => {
  const navigation = useNavigation()
  const userContext = useContext(UserContext);
  const { updateFavorites } = useFavorites();
  const [favoriteFoods, setFavoriteFoods] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    navigation.setOptions({
      title: 'Món ăn yêu thích',
      headerStyle: {
        backgroundColor: Style.colors.cam,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })
  }, [navigation])

  const fetchFoodDetails = async (foodId) => {
    try {
      const foodDoc = await getDoc(doc(db, 'foods', foodId))
      if (foodDoc.exists()) {
        return { id: foodId, ...foodDoc.data() }
      }
      return null
    } catch (error) {
      console.error('Error fetching food details:', error)
      return null
    }
  }

  useEffect(() => {
    if (!userContext?.user?.id) {
      setLoading(false);
      return;
    }

    const userId = userContext.user.id;
    let isMounted = true;

    const loadFavorites = async () => {
      try {
        const favorites = await loadFavoritesFood(userId);
        if (!isMounted) return;

        const validFavorites = Array.isArray(favorites) ? favorites : [];
        const foodDetails = await Promise.all(
          validFavorites.map(foodId => fetchFoodDetails(foodId))
        );
        
        const validFoodDetails = foodDetails.filter(food => food !== null);
        setFavoriteFoods(validFoodDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error loading favorites:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadFavorites();

    return () => {
      isMounted = false;
    };
  }, [userContext?.user?.id]);

  const handleRemoveFavorite = async (foodId) => {
    if (!userContext?.user?.id || !foodId) return
    
    try {
      await removeFavoritesFood(userContext.user.id, foodId)
      // Cập nhật state local
      const newFavorites = favoriteFoods.filter(food => food.id !== foodId);
      setFavoriteFoods(newFavorites);
      // Cập nhật context để đồng bộ với HomeScreen
      updateFavorites(newFavorites.map(food => food.id));
      
      // Log để debug
      console.log('Removed favorite:', foodId);
      console.log('Updated favorites:', newFavorites.map(food => food.id));
    } catch (error) {
      console.error("Error handling favorite:", error)
    }
  }

  const renderFoodItem = ({ item }) => {
    if (!item) return null

    return (
      <TouchableOpacity style={styles.foodCard}>
        <Image 
          source={{ uri: item.foodImage }} 
          style={styles.foodImage}
          defaultSource={require('../../../assets/images/logoC.png')}
        />
        <View style={styles.foodInfo}>
          <Text style={styles.foodName}>{item.foodName || 'Không có tên'}</Text>
          <Text style={styles.foodPrice}>
            {item.foodPrice ? Number(item.foodPrice).toLocaleString('vi-VN') + ' đ' : 'Liên hệ'}
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
    )
  }

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Style.colors.cam} />
          <Text style={styles.loadingText}>Đang tải danh sách yêu thích...</Text>
        </View>
      )
    }

    if (!favoriteFoods || favoriteFoods.length === 0) {
      return (
        <View style={styles.center}>
          <MaterialIcons name="favorite-border" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Bạn chưa có món ăn yêu thích nào</Text>
        </View>
      )
    }

    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}>Món ăn yêu thích</Text>
        </View>
        <FlatList
          data={favoriteFoods}
          renderItem={renderFoodItem}
          keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.foodList}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
      <BottomNavigation/>
    </SafeAreaView>
  )
}

export default Favorites

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 60,
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
})