// import React, { useContext } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import { CartContext } from './CartContext';

// const CartScreen = () => {
//   const { cartItems, removeFromCart } = useContext(CartContext);
//   const total = cartItems.reduce((sum, i) => sum + i.foodPrice * i.quantity, 0);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>🛒 Giỏ Hàng</Text>
//       <FlatList
//         data={cartItems}
//         keyExtractor={(item) => item.id.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.item}>
//             <Text style={styles.name}>{item.foodName}</Text>
//             <Text>{item.quantity} x {item.foodPrice.toLocaleString()} đ</Text>
//             <TouchableOpacity onPress={() => removeFromCart(item.id)}>
//               <Text style={styles.remove}>X</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//       <Text style={styles.total}>Tổng: {total.toLocaleString()} đ</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
//   item: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   name: { fontWeight: 'bold', fontSize: 16 },
//   remove: { color: 'red', fontSize: 16 },
//   total: { marginTop: 20, fontSize: 18, fontWeight: 'bold', color: '#ff5a00' },
// });

// export default CartScreen;
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

const CartScreen = ({ route, navigation }) => {
  const { cartItems = [] } = route.params || {};  // Lấy giỏ hàng từ params

  // Tính tổng giá trị giỏ hàng, cộng lại tất cả các món
  const totalPrice = cartItems.reduce((total, item) => total + (parseFloat(item.foodPrice) || 0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giỏ hàng</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Giỏ hàng của bạn đang trống.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text style={styles.foodName}>{item.foodName}</Text>
              <Text style={styles.foodPrice}>{item.foodPrice.toLocaleString('vi-VN')} đ</Text>
            </View>
          )}
        />
      )}

      {cartItems.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalPrice}>Tổng cộng: {totalPrice.toLocaleString('vi-VN')} đ</Text>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('CheckoutScreen')}  // Điều hướng tới màn hình thanh toán
          >
            <Text style={styles.checkoutButtonText}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyCartText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
  cartItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  foodPrice: {
    fontSize: 14,
    color: '#ff5a00',
    marginTop: 8,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 20,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#ff5a00',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  checkoutButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});

export default CartScreen;

