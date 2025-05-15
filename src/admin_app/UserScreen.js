import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons, Feather } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';

const UserScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, "User"));
            const usersList = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        } catch (error) {
            console.error("Lỗi khi tải danh sách người dùng:", error);
            Alert.alert("Lỗi", "Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const addUser = () => {
        Alert.alert("Thêm người dùng", "Chức năng đang được phát triển");
    }

    const deleteUser = (userName) => {
        Alert.alert(
            "Xác nhận xóa",
            `Bạn có chắc chắn muốn xóa người dùng "${userName}"?`,
            [
                {
                    text: 'Không',
                    style: 'cancel',
                    onPress: () => console.log("Hủy xóa"),
                },
                {
                    text: 'Có',
                    style: 'destructive',
                    onPress: () => console.log(`Đã xóa ${userName}`),
                }
            ]
        )
    }

    const itemData = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <Ionicons name="person-circle-outline" size={40} color="#0e90ad" />
                <View>
                    <Text style={styles.itemTitle}>{item.fullName || 'Chưa có tên'}</Text>
                    <Text style={styles.itemEmail}>{item.email}</Text>
                    <Text style={styles.itemPhone}>{item.phone || 'Chưa có số điện thoại'}</Text>
                </View>
                <View style={styles.icon}>
                    <Feather name="edit" size={24} color="#0e90ad"
                        style={{ marginRight: 10 }}
                        onPress={() => Alert.alert('Thông tin người dùng:', `Tên: ${item.fullName}\nEmail: ${item.email}\nSĐT: ${item.phone || 'Chưa có'}\nĐịa chỉ: ${item.address || 'Chưa có'}\nVai trò: ${item.role || 'user'}`)}
                    />
                    <Feather name="trash-2" size={24} color="red"
                        onPress={() => deleteUser(item.fullName)} />
                </View>
            </View>
        )
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0e90ad" />
                <Text style={styles.loadingText}>Đang tải danh sách người dùng...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.titleView}>
                <View>
                    <Text style={styles.welcomeText}>Chào admin</Text>
                    <Text style={styles.subText}>Chào mừng bạn trở lại</Text>
                </View>
                <View style={styles.halfCircle}>
                    <View style={styles.countUser}>
                        <Text style={styles.textUser}>{users.length}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={itemData}
                    ItemSeparatorComponent={() => <View style={styles.list}></View>}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Không có người dùng nào</Text>
                        </View>
                    }
                />

                <TouchableOpacity style={styles.createButton} onPress={addUser}>
                    <Ionicons name="add-circle" size={60} color="#007BFF" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default UserScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#0e90ad',
        fontSize: 16,
    },
    createButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    titleView: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0e90ad',
    },
    subText: {
        fontSize: 14,
        color: '#666',
    },
    halfCircle: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 5,
        borderColor: 'orange',
    },
    countUser: {
        backgroundColor: '#e8f5f3',
        height: 50,
        width: 50,
        borderRadius: 50,
        alignItems: 'center',
    },
    textUser: {
        textAlign: 'center',
        paddingTop: 15,
        color: '#0e90ad',
        fontSize: 15,
        fontWeight: '600'
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5f3',
        flex: 1,
        height: 90,
        padding: 5,
        borderRadius: 10,
    },
    list: {
        height: 20,
    },
    itemTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#0e90ad',
        paddingHorizontal: 20,
        marginVertical: 2,
    },
    itemEmail: {
        color: '#666',
        fontSize: 14,
        paddingHorizontal: 20,
        fontStyle: 'italic',
    },
    itemPhone: {
        color: '#666',
        fontSize: 14,
        paddingHorizontal: 20,
    },
    icon: {
        position: 'absolute',
        right: 10,
        flexDirection: 'row',
        marginRight: 10,
        alignItems: 'center',
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