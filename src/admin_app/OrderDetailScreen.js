import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
// Import Firebase API functions (need to add fetchOrderById and updateOrderStatus if not exist)
// import { fetchOrderById, updateOrderStatus } from '../../Firebase/FirebaseAPI';

const OrderDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params; // Assuming orderId is passed as a param

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Define possible order statuses
  const orderStatuses = ['Chờ xác nhận', 'Đang chuẩn bị', 'Đang giao', 'Đã hoàn thành', 'Đã hủy', 'Thanh toán thất bại'];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Need to implement fetchOrderById in FirebaseAPI.js
        // const result = await fetchOrderById(orderId);
        
        // Placeholder data for now
        const result = { 
            success: true, 
            data: {
                id: orderId,
                items: [
                    { foodItem: { foodName: 'Phở Bò' }, soLuong: 2, tongGia: 80000 },
                    { foodItem: { foodName: 'Nem Rán' }, soLuong: 1, tongGia: 30000 }
                ],
                totalAmount: 110000,
                deliveryAddress: 'Số nhà X, Đường Y, Phường Z, Quận A, TP.B',
                status: 'Chờ xác nhận',
                paymentMethod: 'Trả sau',
                paymentStatus: 'Chưa thanh toán',
                userId: 'someUserId',
                createdAt: new Date().toISOString(),
            }
        };

        if (result.success && result.data) {
          setOrder(result.data);
          setCurrentStatus(result.data.status);
        } else {
          Alert.alert('Lỗi', result.message || 'Không thể tải chi tiết đơn hàng.');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tải chi tiết đơn hàng.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return; // No change

    Alert.alert(
      'Xác nhận cập nhật trạng thái',
      `Bạn có chắc chắn muốn chuyển trạng thái đơn hàng sang "${newStatus}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Cập nhật',
          onPress: async () => {
            setUpdatingStatus(true);
            try {
              // Need to implement or verify updateOrderStatus in FirebaseAPI.js
              // const result = await updateOrderStatus(orderId, newStatus);
              
              // Placeholder result
              const result = { success: true, message: 'Cập nhật thành công (placeholder)' };

              if (result.success) {
                setCurrentStatus(newStatus);
                Alert.alert('Thành công', result.message);
              } else {
                Alert.alert('Lỗi', result.message || 'Không thể cập nhật trạng thái.');
              }
            } catch (error) {
              console.error('Error updating order status:', error);
              Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật trạng thái.');
            } finally {
              setUpdatingStatus(false);
            }
          },
        },
      ],
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0e90ad" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Không tìm thấy chi tiết đơn hàng</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Chi tiết đơn hàng #{order.id ? order.id.substring(0, 6) : '...'}</Text>
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Thông tin chung</Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>Trạng thái: <Text style={{ fontWeight: 'bold' }}>{currentStatus}</Text></Text>
          <Text style={styles.infoText}>Phương thức TT: {order.paymentMethod}</Text>
          <Text style={styles.infoText}>Trạng thái TT: {order.paymentStatus}</Text>
          <Text style={styles.infoText}>Tổng tiền: {formatPrice(order.totalAmount)}</Text>
          <Text style={styles.infoText}>Địa chỉ giao hàng: {order.deliveryAddress}</Text>
          <Text style={styles.infoText}>Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</Text>
        </View>

        <Text style={styles.sectionTitle}>Cập nhật trạng thái</Text>
        <View style={styles.statusUpdateContainer}>
            {orderStatuses.map(status => (
                <TouchableOpacity
                    key={status}
                    style={[
                        styles.statusButton,
                        currentStatus === status && styles.currentStatusButton,
                        updatingStatus && styles.disabledButton
                    ]}
                    onPress={() => !updatingStatus && handleStatusChange(status)}
                    disabled={updatingStatus}
                >
                    <Text style={[
                        styles.statusButtonText,
                        currentStatus === status && styles.currentStatusButtonText
                    ]}>
                        {status}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>

        <Text style={styles.sectionTitle}>Danh sách món ăn</Text>
        <View style={styles.itemsContainer}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.foodItem?.foodName || 'Tên món không rõ'}</Text>
              <Text style={styles.itemQuantity}>x{item.soLuong}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.tongGia)}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  nav: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0e90ad',
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
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    color: '#333',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0e90ad',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  statusUpdateContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 15,
  },
  statusButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    margin: 5,
  },
  currentStatusButton: {
    backgroundColor: '#0e90ad',
  },
  statusButtonText: {
    fontSize: 14,
    color: '#333',
  },
  currentStatusButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  }
});

export default OrderDetailScreen; 