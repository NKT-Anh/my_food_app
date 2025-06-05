import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loadOrdersRealTime, updateOrderStatus } from '../Firebase/FirebaseAPI';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { UserContext } from '../Firebase/UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomeShipper = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [inProgressOrders, setInProgressOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      const unsubscribe = loadOrdersRealTime(null, (orderData) => {
        if (orderData) {
          const pending = orderData.filter(order => order.status === 'Chờ giao hàng');
          const inProgress = orderData.filter(order => order.status === 'Đang giao');
          setPendingOrders(pending);
          setInProgressOrders(inProgress);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        Alert.alert('Thành công', result.message);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật trạng thái đơn hàng');
    }
  };

  const openDeliveryLocation = (address) => {
    const url = `https://maps.google.com/?q=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  const filterOrdersByDate = (orders) => {
    return orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = order.createdAt.toDate ? order.createdAt.toDate() : new Date(order.createdAt);
      return (
        orderDate.getDate() === selectedDate.getDate() &&
        orderDate.getMonth() === selectedDate.getMonth() &&
        orderDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTime}>
            {formatTime(item.createdAt?.toDate())} - {formatDate(item.createdAt?.toDate())}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.orderStatus}>{item.status}</Text>
            {item.paymentMethod && (
              <Text style={styles.paymentMethodText}>({item.paymentMethod})</Text>
            )}
          </View>
        </View>
        <Text style={styles.orderTotal}>
          Tổng: {(item.totalAmount || 0).toLocaleString('vi-VN')} đ
        </Text>
      </View>

   
      {item.items && item.items.map((foodItem, index) => (
        <View key={index} style={styles.foodItem}>
          <Text style={styles.foodName}>{foodItem.foodItem?.foodName || 'Tên món không có'}</Text>
          <View style={styles.foodDetails}>
            <Text style={styles.foodQuantity}>Số lượng: {foodItem.soLuong || 0}</Text>
            <Text style={styles.foodPrice}>
              {(foodItem.tongGia || 0).toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>
      ))}

      <View style={styles.deliveryInfo}>
        {item.status === 'Đang giao' && item.deliveryAddress ? (
          <TouchableOpacity onPress={() => openDeliveryLocation(item.deliveryAddress)} style={styles.deliveryAddressContainer}>
            <Text style={styles.deliveryAddress}>
              <Ionicons name="location" size={16} color="#666" /> {item.deliveryAddress}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.deliveryAddressContainer}>
            <Text style={styles.deliveryAddress}>
              <Ionicons name="location" size={16} color="#666" /> {item.deliveryAddress || 'Chưa có địa chỉ'}
            </Text>
          </View>
        )}
      </View>

      {item.status === 'Chờ giao hàng' && (
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleUpdateStatus(item.id, 'Đang giao')}
        >
          <Text style={styles.acceptButtonText}>Nhận đơn</Text>
        </TouchableOpacity>
      )}

      {item.status === 'Đang giao' && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => handleUpdateStatus(item.id, 'Đã đặt')}
        >
          <Text style={styles.completeButtonText}>Hoàn thành</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Chờ giao hàng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'inProgress' && styles.activeTab]}
          onPress={() => setActiveTab('inProgress')}
        >
          <Text style={[styles.tabText, activeTab === 'inProgress' && styles.activeTabText]}>
            Đang giao
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name="date-range" size={22} color="#007bff" />
          <Text style={{ marginLeft: 8, fontSize: 16 }}>
            {selectedDate.toLocaleDateString('vi-VN')}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setSelectedDate(date);
            }}
          />
        )}
      </View>

      <FlatList
        data={activeTab === 'pending'
          ? filterOrdersByDate(pendingOrders)
          : filterOrdersByDate(inProgressOrders)}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Không có đơn hàng {activeTab === 'pending' ? 'chờ giao' : 'đang giao'} trong ngày này
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    height: 60,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  orderCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    marginBottom: 10,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderTime: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
    marginTop: 5,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  foodItem: {
    marginVertical: 5,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  foodDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodQuantity: {
    fontSize: 14,
    color: '#666',
  },
  foodPrice: {
    fontSize: 14,
    color: '#666',
  },
  deliveryInfo: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  deliveryAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
  },
  acceptButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completeButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentMethodText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 12,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default HomeShipper;