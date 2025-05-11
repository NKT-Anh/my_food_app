import React, { useEffect, useState, useContext } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { UserContext } from '../../Firebase/UserContext';
import { loadOrdersRealTime } from '../../Firebase/FirebaseAPI'; // API để tải đơn hàng theo thời gian thực
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const Order = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng
  const [selectedStatus, setSelectedStatus] = useState('Chờ giao hàng'); // Trạng thái được chọn
  const statusList = ['Chờ giao hàng', 'Đang giao', 'Đã đặt', 'Đã hủy']; // Các trạng thái đơn hàng

  // Tải đơn hàng theo thời gian thực
  useEffect(() => {
    if (user && user.id) {
        const unsubscribe = loadOrdersRealTime(user.id, (orderData) => {
            if (orderData) {
                setOrders(orderData);
            }
        });
        return () => unsubscribe(); // Hủy đăng ký khi component bị unmount
    }
  }, [user]);

  // Lọc đơn hàng theo trạng thái
  const getOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };

  // Hiển thị từng đơn hàng
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

  // Hiển thị nội dung theo trạng thái
  const renderContent = () => {
    const filteredOrders = getOrdersByStatus(selectedStatus);

    if (filteredOrders.length === 0) {
      return <Text style={styles.emptyText}>Chưa có đơn hàng trong trạng thái này</Text>;
    }

    return (
      <FlatList
        data={filteredOrders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* Thanh điều hướng */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.navTitle}>Đơn hàng</Text>
        </View>

        {/* Tabs trạng thái */}
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

        {/* Nội dung đơn hàng */}
        <View style={styles.content}>{renderContent()}</View>
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
});

export default Order;