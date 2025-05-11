import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import SafeAreaView
import { loadOrdersRealTime } from '../Firebase/FirebaseAPI'; // Hàm để tải đơn hàng từ Firestore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign'; // Import icon đăng xuất

const HomeShipper = ({ navigation }) => {
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng

  // Tải danh sách đơn hàng theo thời gian thực
  useEffect(() => {
    const unsubscribe = loadOrdersRealTime(null, (orderData) => {
      if (orderData) {
        const pendingOrders = orderData.filter((order) => order.status === 'Chờ giao hàng');
        setOrders(pendingOrders);
      }
    });

    return () => unsubscribe(); // Hủy đăng ký khi component bị unmount
  }, []);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Thêm logic đăng xuất tại đây
    alert('Đăng xuất thành công!');
    navigation.navigate('LogIn'); // Điều hướng về màn hình đăng nhập
  };

  // Hiển thị từng đơn hàng
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.foodName}>{item.foodItem?.foodName || 'Tên món không có'}</Text>
        <Text style={[styles.status, styles.pendingStatus]}>{item.status || 'Chờ giao hàng'}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.detailText}>Số lượng: {item.soLuong}</Text>
        <Text style={styles.detailText}>
          Tổng: {item.tongGia.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }).replace('₫', 'đ')}
        </Text>
        <Text style={styles.detailText}>Địa chỉ: {item.deliveryAddress || 'Không có địa chỉ'}</Text>
      </View>
      <TouchableOpacity style={styles.acceptButton}>
        <MaterialIcons name="check-circle" size={20} color="#fff" />
        <Text style={styles.acceptButtonText}>Nhận đơn</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Thanh điều hướng */}
        <View style={styles.navBar}>
          <Text style={styles.navTitle}>Trang chủ Shipper</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <AntDesign name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Nội dung */}
        <Text style={styles.title}>Danh sách đơn hàng</Text>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>Không có đơn hàng nào đang chờ giao</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeShipper;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  navBar: {
    height: 60,
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'center',
  },
  pendingStatus: {
    backgroundColor: '#ffcc00',
    color: '#fff',
  },
  cardBody: {
    marginBottom: 15,
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
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});