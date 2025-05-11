import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { loadFavoritesFood } from '../../Firebase/FirebaseAPI' // Import API

const Favorites = ({ userId }) => {
  const [favorites, setFavorites] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return; // Kiểm tra nếu không có userId

    const unsubscribe = loadFavoritesFood(userId, (favoritesData) => {
      setFavorites(favoritesData)
      setLoading(false)
    })

    return () => unsubscribe && unsubscribe() // Hủy đăng ký khi component unmount
  }, [userId])

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang cập nhật...</Text>
      </View>
    )
  }

  if (!favorites || favorites.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Không có mục yêu thích nào.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {favorites.map((foodId, index) => (
        <Text key={index}>{foodId}</Text>
      ))}
    </View>
  )
}

export default Favorites

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})