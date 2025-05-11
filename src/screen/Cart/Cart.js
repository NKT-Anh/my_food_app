import React, { useEffect, useState, useContext } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../../Firebase/UserContext';
import { loadCartRealTime, updateOrderStatus, checkoutOrders } from '../../Firebase/FirebaseAPI';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const Cart = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Chờ xác nhận');
  const statusList = ['Chờ xác nhận', 'Chờ giao hàng', 'Đang giao', 'Đã đặt'];

  useEffect(() => {
    if (user && user.id) {
      const unsubscribeUser = loadCartRealTime(user.id, (cartData) => {
        if (cartData) {
          setCart(cartData);
        }
      });
      return unsubscribeUser;
    }
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodName}>{item.foodItem?.foodName || 'Tên món không có'}</Text>
        <Text style={styles.status}>{item.status || 'Chờ xác nhận'}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.detailText}>Số lượng: {item.soLuong}</Text>
        <Text style={styles.detailText}>
          Tổng: {item.tongGia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ')}
        </Text>
      </View>
    </View>
  );

  const calculateTotal = () => {
    const total = cart
      .filter((item) => item.status === selectedStatus)
      .reduce((sum, item) => sum + item.tongGia, 0);
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
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Tổng: {calculateTotal()} VND</Text>
        </View>
      </>
    );
  };

  const handleCheckout = async () => {
    if (!user || !user.id) {
        alert("Vui lòng đăng nhập để tiếp tục!");
        return;
    }

    // Lọc các đơn hàng trong trạng thái "Chờ xác nhận" hoặc trạng thái rỗng
    const ordersToCheckout = cart.filter(
        (item) => !item.status || item.status === 'Chờ xác nhận'
    );

    if (ordersToCheckout.length === 0) {
        alert("Không có đơn hàng nào để thanh toán!");
        return;
    }

    try {
        // Gọi API để xử lý thanh toán
        const result = await checkoutOrders(user.id, ordersToCheckout);

        if (result.success) {
            alert(result.message);

            // Tải lại giỏ hàng từ Firestore
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
});

export default Cart;