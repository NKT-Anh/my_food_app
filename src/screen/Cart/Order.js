import React, { useEffect, useState, useContext } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { UserContext } from '../../Firebase/UserContext';
import { loadOrdersRealTime, updateOrderStatus } from '../../Firebase/FirebaseAPI';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Order = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('Chờ giao hàng');
  const statusList = ['Chờ giao hàng', 'Đang giao', 'Đã đặt', 'Đã hủy'];

  useEffect(() => {
    if (user && user.id) {
      const unsubscribe = loadOrdersRealTime(user.id, (orderData) => {
        if (orderData) {
          setOrders(orderData);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt?.toDate()).toLocaleDateString('vi-VN')}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.orderStatus}>{item.status}</Text>
          {item.paymentMethod && (
            <Text style={styles.paymentMethodText}>({item.paymentMethod})</Text>
          )}
        </View>
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

      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>
          Tổng: {(item.totalAmount || 0).toLocaleString('vi-VN')} đ
        </Text>
        <Text style={styles.deliveryAddress}>
          Địa chỉ: {item.deliveryAddress}
        </Text>
      </View>

      {item.status === 'Chờ giao hàng' && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            Alert.alert(
              "Xác nhận hủy đơn",
              "Bạn có chắc chắn muốn hủy đơn hàng này không?",
              [
                { text: "Không", style: "cancel" },
                { text: "Có", onPress: () => handleCancelOrder(item.id) }
              ],
              { cancelable: true }
            );
          }}
        >
          <Text style={styles.cancelButtonText}>Hủy đơn</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const handleCancelOrder = async (orderId) => {
    try {
      const result = await updateOrderStatus(orderId, 'Đã hủy');
      if (result.success) {
        Alert.alert("Thành công", result.message);
      } else {
        Alert.alert("Lỗi", result.message || "Không thể hủy đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi hủy đơn hàng:", error);
      Alert.alert("Lỗi", "Đã xảy ra lỗi khi hủy đơn hàng!");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
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

      <FlatList
        data={orders.filter(order => order.status === selectedStatus)}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không có đơn hàng nào trong trạng thái này</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
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
  orderItem: {
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
  paymentMethodText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
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
    marginTop: 5,
  },
  foodQuantity: {
    fontSize: 14,
    color: '#666',
  },
  foodPrice: {
    fontSize: 14,
    color: '#666',
  },
  orderFooter: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Order;