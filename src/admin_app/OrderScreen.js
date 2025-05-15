import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';

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

    useEffect(() => {
        loadOrders();
    }, []);

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

            // Calculate statistics
            const newStats = {
                total: ordersList.length,
                pending: ordersList.filter(order => order.status === 'Chờ xác nhận').length,
                ready: ordersList.filter(order => order.status === 'Chờ giao hàng').length,
                delivering: ordersList.filter(order => order.status === 'Đang giao').length,
                completed: ordersList.filter(order => order.status === 'Đã đặt').length
            };
            setStats(newStats);
        } catch (error) {
            console.error("Lỗi khi tải danh sách đơn hàng:", error);
        } finally {
            setLoading(false);
        }
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
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderId}>Mã đơn: {item.id}</Text>
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
        </View>
    );

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
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Tổng số:</Text>
                        <Text style={styles.statValue}>{stats.total}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: '#FFA500' }]}>Chờ xác nhận:</Text>
                        <Text style={styles.statValue}>{stats.pending}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: '#007BFF' }]}>Chờ giao:</Text>
                        <Text style={styles.statValue}>{stats.ready}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: '#28A745' }]}>Đang giao:</Text>
                        <Text style={styles.statValue}>{stats.delivering}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statLabel, { color: '#6C757D' }]}>Hoàn thành:</Text>
                        <Text style={styles.statValue}>{stats.completed}</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={orders}
                keyExtractor={(item) => item.id}
                renderItem={renderOrderItem}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
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