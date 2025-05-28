import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { addFavoritesFood, removeFavoritesFood } from '../../Firebase/FirebaseAPI'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useNavigation } from '@react-navigation/native'
import Style from '../../globals/style'

const AddFavorites = ({ foodId, isFavorite, onFavoriteChange }) => {
  const [userId, setUserId] = useState(null)
  const navigation = useNavigation()

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
      } else {
        navigation.navigate('LogIn')
      }
    })
    return () => unsubscribe()
  }, [navigation])

  const handleAddToFavorites = async () => {
    if (!userId) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập để thêm vào danh sách yêu thích.")
      return
    }

    try {
      if (isFavorite) {
        const result = await removeFavoritesFood(userId, foodId)
        if (result.success) {
          Alert.alert("Thành công", "Đã xóa món ăn khỏi danh sách yêu thích")
          onFavoriteChange(false)
        } else {
          Alert.alert("Lỗi", result.message)
        }
      } else {
        const result = await addFavoritesFood(userId, foodId)
        if (result.success) {
          Alert.alert("Thành công", "Đã thêm món ăn vào danh sách yêu thích")
          onFavoriteChange(true)
        } else {
          Alert.alert("Lỗi", result.message)
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi thao tác với danh sách yêu thích")
    }
  }

  return (
    <TouchableOpacity 
      style={styles.favoriteButton} 
      onPress={handleAddToFavorites}
    >
      <MaterialIcons
        name="favorite"
        size={24}
        color={isFavorite ? Style.colors.cam : '#ccc'}
      />
    </TouchableOpacity>
  )
}

export default AddFavorites

const styles = StyleSheet.create({
  favoriteButton: {
    padding: 8,
  }
})