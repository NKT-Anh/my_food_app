import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Modal, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const OrderScreen = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        ready: 0,
        delivering: 0,
        completed: 0
    });
    const navigation = useNavigation();
    const [selectedStatus, setSelectedStatus] = useState('Tất cả');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filterByDate, setFilterByDate] = useState(false);

    // Generate array of dates for the last 7 days
    const getLast7Days = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date);
        }
        return dates;
    };

    useEffect(() => {
        loadOrders();
    }, []);

    // Update stats whenever orders, selectedDate or filterByDate changes
    useEffect(() => {
        updateStats(orders);
    }, [orders, selectedDate, filterByDate]);

    const loadOrders = async () => {
        try {
            const ordersQuery = query(collection(db, "orders"), orderBy("createdAt", "desc"));
            const ordersSnapshot = await getDocs(ordersQuery);
            const ordersList = await Promise.all(
                ordersSnapshot.docs.map(async (orderDoc) => {
                    const orderData = orderDoc.data();
                    // Fetch user information
                    let buyerName = 'Không xác định';
                    try {
                        if (orderData.userId) {
                            const userRef = doc(db, "User", orderData.userId);
                            const userSnap = await getDoc(userRef);
                            if (userSnap.exists()) {
                                const userData = userSnap.data();
                                buyerName = userData.fullName || 'Không xác định';
                            }
                        }
                    } catch (error) {
                        console.error("Lỗi khi lấy thông tin người dùng:", error);
                    }
                    return {
                        id: orderDoc.id,
                        ...orderData,
                        buyerName
                    };
                })
            );
            setOrders(ordersList);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStats = (ordersList) => {
        const filteredOrdersForStats = ordersList.filter(order => {
            if (!filterByDate) return true;
            return order.createdAt && isSameDay(order.createdAt.toDate(), selectedDate);
        });

        const newStats = {
            total: filteredOrdersForStats.length,
            pending: filteredOrdersForStats.filter(order => order.status === 'Chờ xác nhận').length,
            ready: filteredOrdersForStats.filter(order => order.status === 'Chờ giao hàng').length,
            delivering: filteredOrdersForStats.filter(order => order.status === 'Đang giao').length,
            completed: filteredOrdersForStats.filter(order => order.status === 'Đã đặt').length
        };
        setStats(newStats);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Chưa có';
        const date = timestamp.toDate();
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDateForDisplay = (date) => {
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Chờ xác nhận':
                return '#FFA500';
            case 'Chờ giao hàng':
                return '#007BFF';
            case 'Đang giao':
                return '#28A745';
            case 'Hoàn thành':
                return '#6C757D';
            default:
                return '#6C757D';
        }
    };

    const renderOrderItem = ({ item }) => (
        <TouchableOpacity style={styles.orderCard} onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Mã đơn: {item.id.length > 10 ? `${item.id.substring(0, 10)}...` : item.id}</Text>
                <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
            </View>

            <View style={styles.orderInfo}>
                <View style={styles.infoRow}>
                    <Ionicons name="person-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>Người mua: {item.buyerName}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>Địa chỉ: {item.deliveryAddress}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="time-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>Thời gian: {formatDate(item.createdAt)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="cash-outline" size={20} color="#666" />
                    <Text style={styles.infoText}>Tổng tiền: {formatPrice(item.totalAmount)}</Text>
                </View>
            </View>

            <View style={styles.orderItems}>
                <Text style={styles.itemsTitle}>Chi tiết đơn hàng:</Text>
                {item.items?.map((orderItem, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemName}>{orderItem.foodItem.foodName}</Text>
                        <Text style={styles.itemQuantity}>x{orderItem.soLuong}</Text>
                        <Text style={styles.itemPrice}>{formatPrice(orderItem.tongGia)}</Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    const isSameDay = (date1, date2) => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    const filteredOrders = orders.filter(order => {
        // Filter by status
        const statusMatch = selectedStatus === 'Tất cả' || 
            (selectedStatus === 'Chờ xác nhận' && order.status === 'Chờ xác nhận') ||
            (selectedStatus === 'Chờ giao' && order.status === 'Chờ giao hàng') ||
            (selectedStatus === 'Đang giao' && order.status === 'Đang giao') ||
            (selectedStatus === 'Hoàn thành' && order.status === 'Đã đặt');

        // Filter by date if enabled
        const dateMatch = !filterByDate || 
            (order.createdAt && isSameDay(order.createdAt.toDate(), selectedDate));

        return statusMatch && dateMatch;
    });

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setFilterByDate(true);
        setShowDatePicker(false);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text style={styles.loadingText}>Đang tải danh sách đơn hàng...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Danh sách đơn hàng</Text>
                <View style={styles.dateFilterContainer}>
                    <TouchableOpacity 
                        style={[styles.dateFilterButton, filterByDate && styles.dateFilterButtonActive]} 
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color={filterByDate ? "#fff" : "#666"} />
                        <Text style={[styles.dateFilterText, filterByDate && styles.dateFilterTextActive]}>
                            {filterByDate ? formatDateForDisplay(selectedDate) : "Chọn ngày"}
                        </Text>
                    </TouchableOpacity>
                    {filterByDate && (
                        <TouchableOpacity 
                            style={styles.clearDateButton}
                            onPress={() => {
                                setFilterByDate(false);
                            }}
                        >
                            <Ionicons name="close-circle" size={20} color="#666" />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.statsContainer}>
                    <TouchableOpacity 
                        style={[styles.statItem, selectedStatus === 'Tất cả' && styles.statItemSelected]} 
                        onPress={() => setSelectedStatus('Tất cả')}
                    >
                        <Text style={styles.statLabel}>Tổng số:</Text>
                        <Text style={styles.statValue}>{stats.total}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.statItem, selectedStatus === 'Chờ xác nhận' && styles.statItemSelected]} 
                        onPress={() => setSelectedStatus('Chờ xác nhận')}
                    >
                        <Text style={[styles.statLabel, { color: '#FFA500' }]}>Chờ xác nhận:</Text>
                        <Text style={styles.statValue}>{stats.pending}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.statItem, selectedStatus === 'Chờ giao' && styles.statItemSelected]} 
                        onPress={() => setSelectedStatus('Chờ giao')}
                    >
                        <Text style={[styles.statLabel, { color: '#007BFF' }]}>Chờ giao:</Text>
                        <Text style={styles.statValue}>{stats.ready}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.statItem, selectedStatus === 'Đang giao' && styles.statItemSelected]} 
                        onPress={() => setSelectedStatus('Đang giao')}
                    >
                        <Text style={[styles.statLabel, { color: '#28A745' }]}>Đang giao:</Text>
                        <Text style={styles.statValue}>{stats.delivering}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.statItem, selectedStatus === 'Hoàn thành' && styles.statItemSelected]} 
                        onPress={() => setSelectedStatus('Hoàn thành')}
                    >
                        <Text style={[styles.statLabel, { color: '#6C757D' }]}>Hoàn thành:</Text>
                        <Text style={styles.statValue}>{stats.completed}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={showDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn ngày</Text>
                            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                <Ionicons name="close" size={24} color="#666" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.dateList}>
                            {getLast7Days().map((date, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.dateItem,
                                        isSameDay(date, selectedDate) && styles.dateItemSelected
                                    ]}
                                    onPress={() => handleDateSelect(date)}
                                >
                                    <Text style={[
                                        styles.dateItemText,
                                        isSameDay(date, selectedDate) && styles.dateItemTextSelected
                                    ]}>
                                        {formatDateForDisplay(date)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {filterByDate 
                                ? `Không có đơn hàng nào vào ngày ${formatDateForDisplay(selectedDate)}`
                                : selectedStatus === 'Tất cả' 
                                    ? 'Không có đơn hàng nào' 
                                    : `Không có đơn hàng nào ở trạng thái "${selectedStatus}"`
                            }
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default OrderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
    header: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    dateFilterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    dateFilterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        marginRight: 10,
    },
    dateFilterButtonActive: {
        backgroundColor: '#007BFF',
    },
    dateFilterText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
    },
    dateFilterTextActive: {
        color: '#fff',
    },
    clearDateButton: {
        padding: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: '80%',
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    dateList: {
        padding: 15,
    },
    dateItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dateItemSelected: {
        backgroundColor: '#007BFF',
        borderRadius: 8,
    },
    dateItemText: {
        fontSize: 16,
        color: '#333',
    },
    dateItemTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginBottom: 5,
        padding: 8,
        borderRadius: 8,
    },
    statItemSelected: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginRight: 5,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    listContainer: {
        padding: 15,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    orderStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
    orderInfo: {
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
    orderItems: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    itemsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    itemName: {
        flex: 2,
        fontSize: 14,
        color: '#666',
    },
    itemQuantity: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    itemPrice: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        textAlign: 'right',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
});