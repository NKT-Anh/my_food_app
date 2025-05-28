import React, { useEffect, useState, useContext } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { UserContext } from '../../Firebase/UserContext';
import { loadCartRealTime, updateOrderStatus, checkoutOrders, removeFoodFromCart, updateCartItemQuantity } from '../../Firebase/FirebaseAPI';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const Cart = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Chờ xác nhận');
  const statusList = ['Chờ xác nhận', 'Chờ giao hàng', 'Đang giao', 'Đã đặt'];
  const [paymentMethod, setPaymentMethod] = useState('Trả sau');

  useEffect(() => {
    if (user && user.id) {
      const unsubscribeUser = loadCartRealTime(user.id, (cartData) => {
        if (cartData) {
          setCart(cartData);
        }
      });
        return () => {
          unsubscribeUser();
        };
    }
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodName}>{item.foodItem?.foodName || 'Tên món không có'}</Text>
        <View style={styles.cardHeaderRight}>
          <Text style={styles.status}>{item.status || 'Chờ xác nhận'}</Text>
          {selectedStatus === 'Chờ xác nhận' && (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Xác nhận xóa",
                  "Bạn có chắc chắn muốn xóa món ăn này khỏi giỏ hàng?",
                  [
                    { text: "Hủy", style: "cancel" },
                    { text: "Xóa", onPress: () => handleRemoveItem(item.foodItem?.foodId) }
                  ],
                  { cancelable: true }
                );
              }}
              style={styles.removeButton}>
              <Icon name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.quantityContainer}>
          <Text style={styles.detailText}>Số lượng:</Text>
          {selectedStatus === 'Chờ xác nhận' && (
            <TouchableOpacity onPress={() => handleUpdateQuantity(item.foodItem?.foodId, (item.soLuong || 0) - 1)} style={styles.quantityButton}>
              <Icon name="remove-circle-outline" size={24} color="#007bff" />
            </TouchableOpacity>
          )}
          <Text style={styles.quantityText}>{item.soLuong || 0}</Text>
          {selectedStatus === 'Chờ xác nhận' && (
            <TouchableOpacity onPress={() => handleUpdateQuantity(item.foodItem?.foodId, (item.soLuong || 0) + 1)} style={styles.quantityButton}>
              <Icon name="add-circle-outline" size={24} color="#007bff" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.detailText}>
          Tổng: {(item.tongGia || 0).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ')}
        </Text>
      </View>
    </View>
  );

  const calculateTotal = () => {
    const total = cart
      .filter((item) => !item.status || item.status === 'Chờ xác nhận')
      .reduce((sum, item) => sum + (item.tongGia || 0), 0);
    return total.toLocaleString('vi-VN') + ' đ';
  };

  const renderContent = () => {
    const filteredCart = cart.filter(
      (item) =>
        selectedStatus === 'Chờ xác nhận'
          ? !item.status || item.status === 'Chờ xác nhận'
          : item.status === selectedStatus
    );

    if (filteredCart.length === 0) {
      return <Text style={styles.emptyText}>Chưa có đơn hàng trong trạng thái này</Text>;
    }

    return (
      <>
        <FlatList
          data={filteredCart}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
        {selectedStatus === 'Chờ xác nhận' && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Tổng: {calculateTotal()}</Text>
          </View>
        )}
      </>
    );
  };

  const handleRemoveItem = async (foodId) => {
    if (!user || !user.id) {
      alert("Vui lòng đăng nhập để xóa món!");
      return;
    }
    if (!foodId) {
      alert("Không tìm thấy ID món ăn để xóa.");
      return;
    }
    try {
      const result = await removeFoodFromCart(user.id, foodId);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.message || "Không thể xóa món ăn khỏi giỏ hàng");
      }
    } catch (error) {
      console.error("Lỗi khi xóa món ăn khỏi giỏ hàng:", error);
      alert("Đã xảy ra lỗi khi xóa món ăn khỏi giỏ hàng!");
    }
  };

  const handleUpdateQuantity = async (foodId, newQuantity) => {
    if (!user || !user.id) {
      alert("Vui lòng đăng nhập để cập nhật số lượng!");
      return;
    }
    if (!foodId) {
      alert("Không tìm thấy ID món ăn để cập nhật.");
      return;
    }
    if (newQuantity < 1) {
      // Nếu số lượng mới là 0 hoặc âm, hỏi xác nhận xóa
      Alert.alert(
        "Xác nhận xóa",
        "Bạn có muốn xóa món ăn này khỏi giỏ hàng không?",
        [
          { text: "Hủy", style: "cancel" },
          { text: "Xóa", onPress: () => handleRemoveItem(foodId) }
        ],
        { cancelable: true }
      );
      return;
    }
    try {
      const result = await updateCartItemQuantity(user.id, foodId, newQuantity);
      if (!result.success) {
        alert(result.message || "Không thể cập nhật số lượng món ăn.");
      }
      // loadCartRealTime sẽ tự cập nhật UI
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      alert("Đã xảy ra lỗi khi cập nhật số lượng!");
    }
  };

  const handleCheckout = async () => {
    if (!user || !user.id) {
        alert("Vui lòng đăng nhập để tiếp tục!");
        return;
    }

    const ordersToCheckout = cart.filter(
        (item) => !item.status || item.status === 'Chờ xác nhận'
    );

    if (ordersToCheckout.length === 0) {
        alert("Không có đơn hàng nào để thanh toán!");
        return;
    }

    try {

        const groupedOrder = {
            items: ordersToCheckout.map(item => ({
                foodItem: { 
                    foodName: item.foodItem?.foodName || 'Tên món không có',
                    ...item.foodItem
                },
                soLuong: item.soLuong || 0,
                tongGia: item.tongGia || 0
            })),
            totalAmount: ordersToCheckout.reduce((sum, item) => sum + (item.tongGia || 0), 0),
            createdAt: new Date(),
            
            status: 'Chờ giao hàng',
            userId: user.id
        };


        const result = await checkoutOrders(user.id, [groupedOrder],paymentMethod);

        if (result.success) {
            alert(result.message);


            loadCartRealTime(user.id, (cartData) => {
                if (cartData) {
                    setCart(cartData);
                }
            });
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("Lỗi khi thanh toán:", error.message);
        alert("Đã xảy ra lỗi khi thanh toán!");
    }
};

  return (
    <View style={{ flex: 1 }}>  
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Giỏ hàng</Text>
        </View>
        <View style={styles.statusContainer}>
          <FlatList
            data={statusList}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedStatus(item)}
                style={[
                  styles.statusTab,
                  selectedStatus === item && styles.activeStatusTab,
                ]}
              >
                <Text
                  style={[
                    styles.statusTabText,
                    selectedStatus === item && styles.activeStatusTabText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.content}>{renderContent()}</View>
        <View style={{ marginHorizontal: 15, marginBottom: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 5 }}>Phương thức thanh toán</Text>
          <View style={{ flexDirection: 'row' }}>
            {['Trả trước', 'Trả sau'].map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentOption,
                  paymentMethod === method && styles.selectedPaymentOption,
                ]}
                onPress={() => setPaymentMethod(method)}
              >
                <View style={styles.radioCircle}>
                  {paymentMethod === method && <View style={styles.selectedRadio} />}
                </View>
                <Text style={styles.paymentOptionText}>{method}</Text>
              </TouchableOpacity>
            ))}
          </View>
      </View>
        {selectedStatus === 'Chờ xác nhận' && (
          
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Thanh toán tất cả</Text>
            
          </TouchableOpacity>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  nav: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 10,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  statusTab: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeStatusTab: {
    backgroundColor: '#007bff',
  },
  statusTabText: {
    fontSize: 14,
    color: '#555',
  },
  activeStatusTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  cardBody: {
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  totalContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    margin: 15,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentOption: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 10,
  paddingHorizontal: 15,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: '#ccc',
  marginRight: 10,
  backgroundColor: '#fff',
  },
  selectedPaymentOption: {
    borderColor: '#007bff',
    backgroundColor: '#e6f0ff',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRadio: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  paymentOptionText: {
    fontSize: 14,
    color: '#333',
  },
  removeButton: {
    padding: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    marginHorizontal: 10,
  },
});

export default Cart;