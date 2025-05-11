import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { UserContext } from '../Firebase/UserContext';
const CartScreen = ({ route }) => {
  const { cartItems } = route.params; 

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giỏ Hàng</Text>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text>{item.foodName}</Text>
              <Text>{item.foodPrice} đ</Text>
            </View>
          )}
        />
      ) : (
        <Text>Giỏ hàng của bạn hiện tại trống.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default CartScreen;
