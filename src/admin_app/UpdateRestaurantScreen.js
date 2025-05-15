import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { updateRestaurantInfo } from '../Firebase/FirebaseAPI';
import { UserContext } from '../Firebase/UserContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase/FirebaseConfig';

const UpdateRestaurantScreen = () => {
    const { user } = useContext(UserContext); // Lấy thông tin user từ context
    const [idRestaurant, setIdRestaurant] = useState('');
    const [restaurantName, setRestaurantName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [ownerName, setOwnerName] = useState('');

    const fetchRestaurantInfo = async () => {
        try {
            const restaurantRef = doc(db, 'restaurants', user.id); // Sử dụng idUser làm ID tài liệu
            const restaurantSnap = await getDoc(restaurantRef);

            if (restaurantSnap.exists()) {
                const restaurantData = restaurantSnap.data();
                setIdRestaurant(user.id); 
                setRestaurantName(restaurantData.name);
                setAddress(restaurantData.address);
                setPhone(restaurantData.phone);
            } else {
                Alert.alert('Thông báo', 'Bạn chưa đăng ký nhà hàng. Vui lòng nhập thông tin để đăng ký!');
                setIdRestaurant(user.id);
                setRestaurantName('');
                setAddress('');
                setPhone('');
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra nhà hàng:', error.message);
            Alert.alert('Lỗi', 'Không thể kiểm tra thông tin nhà hàng. Vui lòng thử lại!');
        }
    };

    useEffect(() => {
        setOwnerName(user.fullName);
        fetchRestaurantInfo();
    }, []);

    const handleUpdate = async () => {
        if (!idRestaurant || !restaurantName || !address || !phone) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
            return;
        }

        try {
            const result = await updateRestaurantInfo(idRestaurant, {
                idUser: user.id,
                username: user.fullName,
                name: restaurantName,
                address: address,
                phone: phone,
            });

            if (result.success) {
                Alert.alert('Thành công', 'Nhà hàng đã được đăng ký/cập nhật thành công!');
            } else {
                Alert.alert('Lỗi', result.error);
            }
        } catch (error) {
            console.error('Lỗi khi lưu thông tin nhà hàng:', error.message);
            Alert.alert('Lỗi', 'Không thể lưu thông tin nhà hàng. Vui lòng thử lại!');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cập nhật thông tin nhà hàng</Text>
            <TextInput
                placeholder="Tên chủ cửa hàng"
                value={ownerName}
                placeholderTextColor="gray"
                editable={false}
                style={styles.input}
            />
            <TextInput
                style={styles.input}
                placeholder="Tên nhà hàng"
                value={restaurantName}
                onChangeText={setRestaurantName}
            />
            <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                value={address}
                onChangeText={setAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
            />
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default UpdateRestaurantScreen;